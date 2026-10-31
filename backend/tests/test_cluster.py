from fastapi.testclient import TestClient
from app.main import app
from app.api.routes import cluster
client=TestClient(app)

def test_theme_mock(monkeypatch):
    monkeypatch.setattr(cluster,'cluster_texts',lambda texts: [{'text':texts[0],'cluster_id':2}])
    r=client.post('/api/v1/themes',json={'text':'Conveyor belt blocked'})
    assert r.status_code==200
    assert r.json()['result']['cluster_id']==2
