# Backend — FastAPI

Local HTTP API for trusted model inference and saved historical reports. Run pytest before claiming endpoint behavior.

## Scope and evidence

This is a research artifact, not a deployment-ready industrial diagnosis. The source of truth is `README.md`, saved Kaggle reports, and actual code paths. Do not invent outcomes or silently overwrite experimental evidence.

```powershell
 git clone https://github.com/MENSTRUE/DowntimeReason-Miner.git
 cd DowntimeReason-Miner\backend
 py -3.11 -m venv .venv
 .\.venv\Scripts\Activate.ps1
 python -m pip install -r requirements.txt
 Copy-Item .env.example .env
 python -m pytest -q
 python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Second terminal:

```powershell
cd DowntimeReason-Miner\frontend
Copy-Item .env.example .env
npm ci
npm run build
npm run dev
```

Set `frontend/.env` to `VITE_API_BASE_URL=http://127.0.0.1:8000`. The API client adds `/api/v1`; do not configure the prefix twice.

