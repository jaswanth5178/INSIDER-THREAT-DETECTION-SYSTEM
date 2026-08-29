from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from security.auth import authenticate

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(request: LoginRequest):
    result = authenticate(request.username, request.password)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return result