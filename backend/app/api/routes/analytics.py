from typing import Literal
from fastapi import APIRouter, Query
from app.services.analytics_service import report_data
router = APIRouter(prefix='/analytics', tags=['Historical analytics'])

@router.get('/{report_name}')
def get_report(report_name: Literal['industrial_clusters','piade_alarms','piade_downtime','experiment_01','experiment_02'], limit: int = Query(100, ge=1, le=1000)):
    return report_data(report_name, limit)
