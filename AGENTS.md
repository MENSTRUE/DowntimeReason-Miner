# AGENTS.md — DowntimeReason Miner

## Mission and source of truth
Maintain a research-grade, evidence-backed NLP + operations demo. Consult the repository README, exact Kaggle report JSON/CSV, notebook, and actual implementation before altering claims. `README.md` is canonical English; `docs/id/README.md` MUST be a **full, section-for-section Indonesian translation**, not a shortened summary. Update paired `docs/en/*.md` and `docs/id/*.md` together.

## Non-negotiable claim boundaries
- `OK` and `DIFFICULT` are aviation logbook `PROBLEM_TYPE` labels, not a machine's safe/unsafe state and not severity grades.
- `CAUSE` exists in only 76 of 6,169 logbook rows; do not invent root-cause supervision.
- Synthetic industrial clusters are language themes, not diagnosed physical failure causes.
- PIADE records are historical operational states; they do not constitute a future downtime predictor.
- Exp02 macro-F1 0.778683 and Exp01 0.722441 refer to the same held-out grouped partition and are not independent replication.
- Treat test-set reuse and class imbalance explicitly; never manufacture metric improvements.

## Scope / implementation
- Backend: `backend/app`, FastAPI, `/api/v1`, trusted joblib, allowlisted CSV/JSON reports.
- Frontend: `frontend/src`, React/TypeScript/Vite, controlled API URL, no fake data or unsupported safety labels.
- Artifact registry: `models/` contains the three approved research models; raw dataset stays outside Git.
- Respect `/api/v1` exactly once; `VITE_API_BASE_URL` should normally be scheme+host+port.
- Preserve client/back-end response contract and validate with the actual app.

## Engineering safety
1. Inspect existing code and reports before changing it. Keep edits minimal and backwards compatible.
2. No untrusted `joblib.load` / pickle files, unsafe shell actions, secrets in commits, or public unauthenticated deployment.
3. Keep raw user text out of production logs; limit request size and rate, validate inputs.
4. Run `python -m pytest -q` from `backend/`, and `npm run build` from `frontend/` after relevant edits.
5. When changing inference, run model-backed smoke tests with actual exported artifacts and compare results with saved held-out evidence; unit mocks alone are insufficient.
6. For plots and screenshots, link actual `assets/plots` and `assets/screenshots` files, never invented media paths.
7. If an upstream dataset license or deployment capability is unverified, write **unverified** rather than guessing.
8. Preserve original Kaggle report files; derived summaries must cite their exact filename.

## Documentation standard
Complete Before–Now–Next, overview, use cases, provenance, data audit, methodology, splits, evaluation, metrics, error analysis, architecture, repo structure, API, run instructions, tests, reproduction, deployment, security, limits, claims, roadmap, FAQ, troubleshooting, license, references, plots, screenshots, known missing evidence. Maintain English/Indonesian parity and relative links.

## Pull request acceptance
Include motivation, changed files, tests run, evidence, backwards compatibility, updated language twins, new failure modes, and remaining risks. Never claim a test ran if it did not.
