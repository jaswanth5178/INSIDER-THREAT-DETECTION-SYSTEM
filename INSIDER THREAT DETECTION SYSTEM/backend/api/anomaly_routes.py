from fastapi import APIRouter, Depends
from api.deps import require_admin
from core.db_repository import DBRepository

router = APIRouter()
repo = DBRepository()


# ✅ GET ALL ANOMALY RESULTS
@router.get("/anomalies")
def get_anomalies(user=Depends(require_admin)):
    df = repo.get_anomaly_results()

    return df.to_dict(orient="records")