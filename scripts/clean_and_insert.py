"""
clean_and_insert.py
Cleans LaTeX macros that KaTeX doesn't support, then upserts into Supabase.

Usage:
    python scripts/clean_and_insert.py file1.json file2.json ...

Fixes applied to question_text and solution_text:
    \newcommand{...}[...]{...}  → removed
    \D\frac                     → \dfrac
    \D                          → \displaystyle
    \e  (not followed by letter) → e
    \begin{quote}...\end{quote} → content only
    \begin{tabular}...\end{tabular} → removed
    \itshape                    → removed
    \vspace{...}                → removed
    \hspace{...}                → removed
    \noindent                   → removed
"""

import json
import os
import re
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


SUBTOPIC_REMAP = {
    "natuerliche-exponentialfunktionen": "exponentialfunktion",
    "natürliche-exponentialfunktionen":  "exponentialfunktion",
    "trigonometrische-funktionen":        "sinus-kosinus",
}


def clean(text: str) -> str:
    if not text:
        return text

    # Remove \newcommand declarations (full line)
    text = re.sub(r'\\newcommand\{[^}]+\}(?:\[\d+\])?\{[^}]*\}\n?', '', text)

    # \D\frac → \dfrac  (most common use)
    text = text.replace('\\D\\frac', '\\dfrac')

    # remaining \D → \displaystyle
    text = re.sub(r'\\D(?![a-zA-Z])', '\\\\displaystyle ', text)

    # \e not followed by a letter → e  (e.g. \e^x → e^x)
    text = re.sub(r'\\e(?![a-zA-Z])', 'e', text)

    # \begin{quote}...\end{quote} → content only
    text = re.sub(r'\\begin\{quote\}([\s\S]*?)\\end\{quote\}', r'\1', text)

    # \begin{tabular}...\end{tabular} → remove entirely (can't render in KaTeX)
    text = re.sub(r'\\begin\{tabular\}[\s\S]*?\\end\{tabular\}', '', text)

    # Strip unsupported formatting commands
    text = re.sub(r'\\(?:itshape|noindent|centering|normalsize|large|Large|small|footnotesize|scriptsize|tiny)\b', '', text)
    text = re.sub(r'\\(?:vspace|hspace)\*?\{[^}]*\}', '', text)

    # Custom old-style macros
    text = re.sub(r'\\EPSR\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[\s\S]*?\}\{([\s\S]*?)\}', r'\1', text)  # \EPSR figure → keep caption
    text = re.sub(r'\\EPS\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}', '', text)   # \EPS figure → remove
    text = re.sub(r'\\PSFM\{[^}]*\}\{[^}]*\}', '', text)                     # \PSFM label → remove
    text = re.sub(r'\\EPUNKT\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}', r'\1(\2|\3)', text)  # \EPUNKT{B}{x}{y} → B(x|y)
    text = re.sub(r'\\parbox(?:\[[^\]]*\])?\{[^}]*\}\{([\s\S]*?)\}', r'\1', text)    # \parbox → content
    text = text.replace('\\QDQ', '\\Leftrightarrow')
    text = text.replace('\\QQ',  '\\Leftrightarrow')
    text = text.replace('\\DANN', '\\Rightarrow')
    text = re.sub(r'\\root\s+(\w+)\\of\{', r'\\sqrt[\1]{', text)             # \root 3\of{} → \sqrt[3]{}
    text = re.sub(r'\\DD_\{?(\w+)\}?', r'D_{\1}', text)                     # \DD_f → D_f
    text = re.sub(r'\\(?:hfill|vfill|quad|qquad)\b', ' ', text)
    text = re.sub(r'\\(?:parbox|text)\b', '', text)

    return text


if __name__ == "__main__":
    files = sys.argv[1:]
    if not files:
        print("Usage: python clean_and_insert.py file1.json file2.json ...")
        raise SystemExit(1)

    total = 0
    for path in files:
        with open(path, encoding="utf-8") as f:
            questions = json.load(f)

        for q in questions:
            subtopic = q["subtopic"]
            subtopic = SUBTOPIC_REMAP.get(subtopic, subtopic)

            row = {
                "smart_id":           q["smart_id"],
                "subject":            q["subject"],
                "topic":              q["topic"],
                "subtopic":           subtopic,
                "title":              q.get("mini_topic", ""),
                "text":               clean(q["question_text"]),
                "erwartungshorizont": clean(q.get("solution_text", "")),
                "images":             q.get("images", []),
                "max_points":         q["max_points"],
                "difficulty":         q["difficulty"],
                "source":             q.get("source"),
                "locked":             q.get("locked", False),
            }

            supabase.table("questions").upsert(row, on_conflict="smart_id").execute()
            print(f"Inserted: {q['smart_id']}")
            total += 1

    print(f"\n{total} questions inserted")
