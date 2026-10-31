# Backend agent guidance

- Maintain strict separation between aviation logbook classification, industrial synthetic clustering, and PIADE analytics.
- Never market `OK` / `DIFFICULT` as physical root-cause labels.
- Never use API-submitted filenames, paths, URLs, or `.joblib` files in model loading.
- Ensure vectorizer and estimator are loaded together from trusted exported artifacts.
- Test behavior with real exported models before claiming deployment readiness.
- Keep Pydantic validation, response semantics, and error handling consistent with API code.
- Models are intentionally tracked in Git if small enough. Raw datasets and secrets must remain ignored.
