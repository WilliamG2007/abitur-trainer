# AbiturTrainer Bayern

Exam prep app for the Bayern Abitur (G9). Practice questions with AI-powered grading via Claude.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router v6
- Anthropic SDK (claude-sonnet-4-20250514)

## Subjects

| Subject | Status |
|---|---|
| Mathematik | Active — Analysis, Stochastik, Geometrie |
| Deutsch | Coming soon |
| Englisch | Coming soon |
| Physik | Coming soon |
| Geschichte | Coming soon |

## Local development

```bash
cp .env.example .env
# Add your Anthropic API key to .env

npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add `VITE_ANTHROPIC_API_KEY` in **Project → Settings → Environment Variables**
4. Deploy — `vercel.json` handles SPA routing automatically

## Project structure

```
src/
├── components/     # DrawingCanvas, UploadBox, QuestionCard, ResultsPanel, ...
├── context/        # ProgressContext (localStorage, Supabase-ready interface)
├── data/           # questions.ts, achievements.ts
├── lib/            # gradeWithClaude.ts
└── pages/          # Landing, Math, German, English, Physics, History
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key (required) |
