import numpy as np
from app.inference.model_loader import load_artifact, CLASSIFIER_EXP02, CLASSIFIER_EXP01, ModelUnavailable


def _positive_score(model, texts, positive_label):
    classes = list(model.classes_)
    if positive_label not in classes:
        raise ModelUnavailable(f'Positive label {positive_label!r} missing from saved estimator classes')
    idx = classes.index(positive_label)
    if hasattr(model, 'predict_proba'):
        return np.asarray(model.predict_proba(texts)[:, idx], dtype=float), 'probability_uncalibrated'
    score = np.asarray(model.decision_function(texts), dtype=float)
    return (score if idx == 1 else -score), 'margin_not_probability'


def classify_texts(texts: list[str], experiment: str = '02') -> list[dict]:
    artifact = load_artifact(CLASSIFIER_EXP02 if experiment == '02' else CLASSIFIER_EXP01)
    model = artifact.get('pipeline')
    if model is None:
        raise ModelUnavailable('Classifier artifact has no pipeline')
    if experiment == '02':
        positive = str(artifact.get('positive_label', 'DIFFICULT'))
        negative = str(artifact.get('negative_label', 'OK'))
        threshold = float(artifact['decision_threshold'])
        scores, score_kind = _positive_score(model, texts, positive)
        preds = [positive if val >= threshold else negative for val in scores]
        return [{'text': t, 'label': p, 'positive_label': positive, 'positive_score': float(s),
                 'score_kind': score_kind, 'decision_threshold': threshold, 'experiment': '02'}
                for t, p, s in zip(texts, preds, scores)]
    predictions = model.predict(texts)
    return [{'text': t, 'label': str(label), 'positive_label': None, 'positive_score': None,
             'score_kind': 'unavailable', 'decision_threshold': None, 'experiment': '01'}
            for t, label in zip(texts, predictions)]
