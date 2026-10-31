# DowntimeReason Miner — FastAPI Backend

Research inference for the Day 26 / 100 NLP study. This backend intentionally **does not claim physical root-cause identification**. It exposes (a) `PROBLEM_TYPE` classification from an aviation maintenance logbook, (b) exploratory theme clusters from synthetic industrial work orders, and (c) read-only PIADE / Kaggle historical reports.

## Requirements

Python 3.11 or 3.12 recommended. If your Kaggle model is serialized with newer scikit-learn versions, loading may require matching versions; prefer re-export with a pinned environment. Only load your own trusted `.joblib` files—joblib/pickle may execute code while loading.

## Install (PowerShell, from repository root)

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000/docs and http://127.0.0.1:8000/api/v1/health.

## Model placement

Place these **trusted Kaggle-exported** artifacts under repository `models/` (subfolders okay if each filename is unique):

- `logbook_problem_type_experiment02_champion.joblib` (primary classifier; required for readiness)
- `logbook_problem_category_champion.joblib` (Experiment 01 baseline, optional)
- `industrial_text_themes.joblib` (exploratory 12-cluster model; required for readiness)

Existing Kaggle outputs may have these under `downtimereason_day26/experiment_02_logbook/models/` and `downtimereason_day26/models/`.

The backend returns **HTTP 503** if a requested model is missing. Health still returns HTTP 200 with `ready_for_inference:false` to expose partial readiness. Reload the backend after copying model files (loaders cache models).

Copy Kaggle report files into `reports/`, keeping Experiment 02's `heldout_metrics.json` under an `experiment_02/` or `experiment_02_logbook/` folder for unambiguous lookup.

## Endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | File presence and readiness |
| POST | `/api/v1/classify` | One work-order text, EXP02 default |
| POST | `/api/v1/classify/batch` | Multiple texts, bounded by configuration |
| POST | `/api/v1/themes` | One exploratory cluster |
| POST | `/api/v1/themes/batch` | Multiple exploratory clusters |
| GET | `/api/v1/analytics/{report_name}` | Saved report (not live data) |

Example request:

```powershell
$body = @{ text = 'Conveyor belt blocked due to material buildup'; experiment = '02' } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri http://127.0.0.1:8000/api/v1/classify -ContentType 'application/json' -Body $body
```

Experiment 02 `positive_score` is the classifier's **uncalibrated probability estimate**, not certainty of actual root cause. The `decision_threshold` was selected on the validation split of the Kaggle study, then carried to the refitted estimator.

## Test

```powershell
python -m pytest -q
```

Tests use mocked prediction to verify API behavior and do **not** claim Kaggle model performance. Test actual inference manually with your exported files. Version mismatches may trigger warnings or errors.

## Limitations

* The `PROBLEM_TYPE` labels mainly represent `OK` versus `DIFFICULT`, not physical failure categories.
* Clustering themes are unsupervised; cluster IDs are not verified cause codes.
* PIADE reports describe recorded downtime / alarms rather than forecast or causal inference.
* Not production validated, and no live machine/sensor stream is connected.
* Treat uploaded text as untrusted input; restrict API network exposure until you add authentication, rate limits, monitoring, and deployment controls.
