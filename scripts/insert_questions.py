"""
insert_questions.py
Bulk-insert questions from questions_clean.json into the Supabase questions table.

Requirements:
    pip install supabase python-dotenv

Environment variables (.env or shell):
    SUPABASE_URL
    SUPABASE_SERVICE_KEY

Expected questions_clean.json shape:
[
  {
    "smart_id":      "math-analysis-ganzrationale-001",
    "subject":       "math",
    "topic":         "analysis",
    "subtopic":      "ganzrationale-funktionen",
    "mini_topic":    "Kurvendiskussion",
    "question_text": "...",
    "solution_text": "...",
    "images":        ["img1.png"],
    "max_points":    5,
    "difficulty":    "easy",
    "source":        "Abitur 2023 Bayern",
    "locked":        false
  },
  ...
]

DB column mapping:
    smart_id      → smart_id   (TEXT UNIQUE – add via migration if missing)
    question_text → text
    solution_text → erwartungshorizont
    mini_topic    → title
    images        → images     (TEXT[] – add via migration if missing)
    all others    → direct match

Run this SQL migration first if the columns don't exist yet:
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS smart_id TEXT UNIQUE;
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS images   TEXT[] NOT NULL DEFAULT '{}';
"""

import json
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

json_path = sys.argv[1] if len(sys.argv) > 1 else "questions_clean.json"

with open(json_path, encoding="utf-8") as f:
    questions = json.load(f)

inserted = 0

for q in questions:
    row = {
        "smart_id":           q["smart_id"],
        "subject":            q["subject"],
        "topic":              q["topic"],
        "subtopic":           q["subtopic"],
        "title":              q.get("mini_topic", ""),
        "text":               q["question_text"],
        "erwartungshorizont": q.get("solution_text", ""),
        "images":             q.get("images", []),
        "max_points":         q["max_points"],
        "difficulty":         q["difficulty"],
        "source":             q.get("source"),
        "locked":             q.get("locked", False),
    }

    supabase.table("questions").upsert(row, on_conflict="smart_id").execute()

    print(f"Inserted: {q['smart_id']}")
    inserted += 1

print(f"\n{inserted} questions inserted")
