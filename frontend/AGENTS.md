# Frontend agent instructions

- Never fabricate inference labels, model readiness, research metrics, or historical analytics.
- Follow the existing FastAPI contract under `/api/v1`, especially response envelopes `result`, `rows` and `data`.
- Preserve independent boundaries between Industrial synthetic work orders, aviation logbook and PIADE.
- Use accessible interactive controls, keyboard-operable buttons, meaningful empty/loading/error states.
- Keep theme palette: warm ivory, terracotta, forest green; avoid copying the design identity of other projects.
- Never interpret the classification score as a calibrated root-cause probability.
- Keep any English README mirrored in full in the project's Indonesian documentation when documentation is requested.
