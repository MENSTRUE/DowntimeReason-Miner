# DowntimeReason Miner — Frontend

A responsive React + TypeScript + Vite research dashboard using **warm ivory, terracotta and forest green**.

## Requirements

- Node.js 20.19+ or 22.12+
- The existing Day 26 FastAPI backend running at `http://127.0.0.1:8000`
- Kaggle artifacts copied into the repository root `models/` and `reports/`

## Run

```powershell
cd "D:\porto\100 day\day 26\DowntimeReason Miner\frontend"
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. To type-check and build: `npm run build`.

## Routes

- `/` dashboard: health, Kaggle experiment 02 metrics, cluster frequency and provenance notes.
- `/classify`: actual FastAPI classification using Experiment 02 or baseline 01.
- `/themes`: theme explorer, clustering request, CSV-derived theme counts.
- `/analytics`: PIADE equipment & alarm historical reports, experiment summaries, JSON export.

## API endpoints

`GET /api/v1/health`, `POST /api/v1/classify`, `POST /api/v1/themes`, `GET /api/v1/analytics/{report_name}`. Batch endpoints are available in the backend but not required by the UI.

## Research limitations

`OK` and `DIFFICULT` are original aviation logbook `PROBLEM_TYPE` labels, **not verified physical failure causes**. Cluster IDs reflect text similarity, and PIADE analytics are historical rather than live sensor readings. The Experiment 02 positive score is **uncalibrated** and must not be presented as failure probability. The interface explicitly displays unavailable models and reports instead of fabricating results.

## Custom API URL

Set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1` in `.env`. Make sure backend `DOWNTIME_CORS_ORIGINS` includes `http://127.0.0.1:5173`.
