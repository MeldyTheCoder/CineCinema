import fastapi

import auth
import exceptions
import models
import serializers
from auth import create_token
from redis_manager import check_phone_code, generate_phone_code

router = fastapi.APIRouter(prefix="/users", tags=["Пользователи"])


@router.post("/send-sms/", name="Отправка CMC-кода на номер телефона")
async def send_sms(data: serializers.SendSmsRequest) -> dict:
    """Отправка СМС-кода авторизации пользователю."""  # noqa: RUF002
    user: models.User | None = await models.User.objects.get_or_none(phone=data.phone)
    if not user:
        raise exceptions.USER_NOT_FOUND

    code = generate_phone_code(phone=user.phone)
    print(f"[+] Код отправлен: {code}")
    return {"message": "Код отправлен"}


@router.post("/validate-sms/", name="Валидация СМС-кода и выдача токена")
async def validate_sms_code(data: serializers.ValidateSmsRequest) -> dict:
    """Проверка СМС-кода авторизации пользователя."""  # noqa: RUF002
    user: models.User | None = await models.User.objects.get_or_none(phone=data.phone)
    if not user:
        raise exceptions.USER_NOT_FOUND

    code_valid = check_phone_code(phone=data.phone, code_input=data.code)
    if code_valid:
        return create_token(user=user)

    raise fastapi.HTTPException(detail="Неверно введен код.", status_code=400)


@router.get("/me/", name="Получить данные пользователя по токену")
async def get_me(user: auth.UserType) -> models.User:
    """Вывод данных пользователя по токену."""
    return user
