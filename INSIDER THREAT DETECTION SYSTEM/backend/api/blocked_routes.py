from fastapi import APIRouter, Depends
from api.deps import require_admin
from core.db_repository import DBRepository
from pydantic import BaseModel

router = APIRouter()
repo = DBRepository()


class BlockRequest(BaseModel):
    employee: str


# 🔴 BLOCK
@router.post("/block")
def block_employee(req: BlockRequest, user=Depends(require_admin)):
    repo.block_employee(req.employee)

    return {"message": f"{req.employee} blocked successfully 🚫"}


# 🟢 GET BLOCKED
@router.get("/blocked")
def get_blocked(user=Depends(require_admin)):
    return repo.get_blocked_employees()


# 🔄 UNBLOCK
@router.delete("/unblock/{employee}")
def unblock(employee: str, user=Depends(require_admin)):
    repo.unblock_employee(employee)

    return {"message": f"{employee} unblocked ✅"}