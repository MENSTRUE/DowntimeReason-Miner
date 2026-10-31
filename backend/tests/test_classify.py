from fastapi.testclient import TestClient
from app.main import app
from app.api.routes import classify
client=TestClient(app)

def test_short_text_rejected():
    assert client.post('/api/v1/classify',json={'text':'x'}).status_code == 422

def test_classification_mock(monkeypatch):
    monkeypatch.setattr(classify,'classify_texts', lambda texts,experiment: [{'text':texts[0],'label':'OK','experiment':experiment}])
    r=client.post('/api/v1/classify',json={'text':'Pump bearing noise'})
    assert r.status_code==200
    assert r.json()['result']['label']=='OK'
