from fastapi import APIRouter
from app.inference.model_loader import model_status
router = APIRouter(tags=['Health'])

@router.get('/health')
def health():
    status = model_status()
    return {'status': 'ok', 'service': 'DowntimeReason Miner', 'models': status,
            'ready_for_inference': bool(status['classifier_exp02']['available'] and status['themes']['available']),
            'production_validated': False}
