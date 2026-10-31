from fastapi import APIRouter
from app.schemas.prediction import ClassificationRequest, ClassificationBatchRequest
from app.inference.text_classifier import classify_texts
router = APIRouter(prefix='/classify', tags=['Classification'])

@router.post('')
def classify(payload: ClassificationRequest):
    return {'result': classify_texts([payload.text], payload.experiment)[0], 'task': 'logbook_problem_type_not_physical_root_cause'}

@router.post('/batch')
def classify_batch(payload: ClassificationBatchRequest):
    return {'results': classify_texts(payload.texts, payload.experiment), 'task': 'logbook_problem_type_not_physical_root_cause'}
