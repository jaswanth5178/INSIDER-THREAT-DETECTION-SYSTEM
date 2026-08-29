import jwt
from datetime import datetime, timedelta

SECRET_KEY = "CHANGE_THIS_IN_PROD"
ALGORITHM = "HS256"
TOKEN_EXP_MINUTES = 60


def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=TOKEN_EXP_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])