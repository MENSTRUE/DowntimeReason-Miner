"""Read-only snapshots from Kaggle-produced reports; never imply live sensor data."""
import csv
import json
from pathlib import Path
from app.core.config import settings

ALLOWED = {
    'industrial_clusters': 'industrial_cluster_audit.csv',
    'piade_alarms': 'piade_alarm_frequencies.csv',
    'piade_downtime': 'piade_downtime_by_equipment.csv',
    'experiment_01': 'logbook_final_metrics.json',
    'experiment_02': 'heldout_metrics.json',
}


def _locate_report(name: str) -> Path | None:
    path = settings.downtime_report_dir.expanduser().resolve()
    filename = ALLOWED[name]
    if not path.is_dir():
        return None
    results = sorted(p for p in path.rglob(filename) if p.is_file())
    if name == 'experiment_02':
        chosen = [p for p in results if 'experiment_02' in p.parts or 'experiment_02_logbook' in p.parts]
        results = chosen
    return results[0] if len(results) == 1 else None


def report_data(name: str, limit: int = 100):
    f = _locate_report(name)
    if f is None:
        return {'available': False, 'source': 'saved_kaggle_report', 'name': name, 'rows': []}
    if f.suffix == '.json':
        return {'available': True, 'source': 'saved_kaggle_report', 'name': name,
                'data': json.loads(f.read_text(encoding='utf-8'))}
    with f.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(__import__('itertools').islice(csv.DictReader(stream), limit))
    return {'available': True, 'source': 'saved_kaggle_report', 'name': name, 'rows': rows, 'limit': limit}
