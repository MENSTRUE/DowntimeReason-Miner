"""Lazy, thread-safe loading of trusted Kaggle-generated joblib files only."""
from functools import lru_cache
from pathlib import Path
import joblib
from app.core.config import settings

CLASSIFIER_EXP02 = 'logbook_problem_type_experiment02_champion.joblib'
CLASSIFIER_EXP01 = 'logbook_problem_category_champion.joblib'
THEME_MODEL = 'industrial_text_themes.joblib'

class ModelUnavailable(RuntimeError):
    pass

def _find_file(filename: str) -> Path:
    root = settings.downtime_model_dir.expanduser().resolve()
    direct = root / filename
    matches = [direct] if direct.is_file() else sorted(p for p in root.rglob(filename) if p.is_file()) if root.is_dir() else []
    if len(matches) != 1:
        raise ModelUnavailable(f'Expected exactly one {filename} under {root}; found {len(matches)}. Copy trusted Kaggle artifacts into models/.')
    return matches[0]

@lru_cache(maxsize=3)
def load_artifact(filename: str) -> dict:
    # WARNING: joblib is pickle-based. NEVER load files supplied by API callers.
    obj = joblib.load(_find_file(filename))
    if not isinstance(obj, dict):
        raise ModelUnavailable(f'Invalid artifact dictionary: {filename}')
    return obj

def model_status() -> dict:
    status = {}
    for key, filename in [('classifier_exp02', CLASSIFIER_EXP02), ('classifier_exp01', CLASSIFIER_EXP01), ('themes', THEME_MODEL)]:
        try:
            status[key] = {'available': True, 'path': str(_find_file(filename))}
        except ModelUnavailable:
            status[key] = {'available': False, 'path': None}
    return status
