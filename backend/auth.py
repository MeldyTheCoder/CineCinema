from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

import exceptions
import models
import settings

SECRET = settings.PRIVATE_KEY
DIGEST = "sha256"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        SECRET,
        algorithm=ALGORITHM,
    )


def check_user_auth(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        phone: str = payload.get("sub")

        if phone is None:
            raise exceptions.INCORRECT_LOGIN_DATA_EXCEPTION

    except jwt.exceptions.PyJWTError as error:
        raise exceptions.INCORRECT_LOGIN_DATA_EXCEPTION

    return phone


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> models.User:
    phone = check_user_auth(token)

    user = await models.User.objects.get_or_none(phone=phone)
    if user is None:
        raise exceptions.INCORRECT_LOGIN_DATA_EXCEPTION

    return user


def create_token(user: models.User) -> dict:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": user.phone}
    access_token = create_access_token(
        data=data,
        expires_delta=access_token_expires,
    )
    return {"accessToken": access_token, "tokenType": "Bearer"}


UserType = Annotated[models.User, Depends(get_current_user)]
