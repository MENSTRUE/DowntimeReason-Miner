from app.inference.model_loader import load_artifact, THEME_MODEL, ModelUnavailable


def cluster_texts(texts: list[str]) -> list[dict]:
    artifact = load_artifact(THEME_MODEL)
    vec = artifact.get('vectorizer')
    model = artifact.get('clusterer')
    if vec is None or model is None:
        raise ModelUnavailable('Theme artifact must include vectorizer and clusterer')
    assigned = model.predict(vec.transform(texts))
    return [{'text': text, 'cluster_id': int(group), 'meaning': 'exploratory_theme_not_verified_root_cause'}
            for text, group in zip(texts, assigned)]
