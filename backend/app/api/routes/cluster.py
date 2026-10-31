from fastapi import APIRouter
from app.schemas.prediction import SingleText, BatchText
from app.inference.theme_clusterer import cluster_texts
router = APIRouter(prefix='/themes', tags=['Exploratory themes'])

@router.post('')
def cluster(payload: SingleText):
    return {'result': cluster_texts([payload.text])[0]}

@router.post('/batch')
def cluster_batch(payload: BatchText):
    return {'results': cluster_texts(payload.texts)}
