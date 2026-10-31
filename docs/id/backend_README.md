# Backend — FastAPI

API HTTP lokal untuk inferensi model tepercaya dan laporan historis tersimpan. Jalankan pytest sebelum mengklaim perilaku endpoint.

## Ruang lingkup dan bukti

Ini artefak penelitian, bukan diagnosis industri yang siap deployment. Sumber rujukan utama ialah `README.md`, laporan Kaggle tersimpan, serta jalur kode yang benar-benar tersedia. Jangan mengarang hasil atau menimpa bukti eksperimen tanpa penjelasan.

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

