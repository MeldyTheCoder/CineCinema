import fastapi


class ParseError(Exception):
    pass

INCORRECT_LOGIN_DATA_EXCEPTION = fastapi.HTTPException(
    detail="Неверные данные для входа.",
    status_code=401,
)

INCORRECT_REGISTRATION_DATA_EXCEPTION = fastapi.HTTPException(
    detail="Неверные данные для регистрации.",
    status_code=405,
)

USER_ALREADY_REGISTERED_EXCEPTION = fastapi.HTTPException(
    detail="Данный пользователь уже зарегистрирован.",
    status_code=405,
)

PASSWORD_INVALID = fastapi.HTTPException(
    detail="Неверный старый пароль!",
    status_code=400,
)

USER_NOT_FOUND = fastapi.HTTPException(
    detail="Пользователь не найден.",
    status_code=404,
)

INVALID_CODE_FORMAT = ParseError("Неверный формат кода СМС.")  # noqa: RUF001

INVALID_PHONE_FORMAT = ParseError("Неверный формат номера телефона.")

HALL_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами зал не найден!",
    status_code=404,
)

OFFICE_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами офис не найден!",
    status_code=404,
)

REGION_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами регион не найден!",
    status_code=404,
)

FILM_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами фильм не найден!",
    status_code=404,
)

GENRE_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами жанр не найден!",
    status_code=404,
)

SCHEDULE_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемое Вами расписание не найден!",
    status_code=404,
)