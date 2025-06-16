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

ORDER_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами заказ не найден!",
    status_code=404,
)

SEAT_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемое Вами место в зале не найдено.",
    status_code=404,
)

SEAT_UNAVAILABLE = lambda seat: fastapi.HTTPException(  # noqa: E731
    detail=f"Данное место ({seat.id}) недоступно для бронирования.",
    status_code=400,
)

TICKER_PRINT_RESTRICTED = fastapi.HTTPException(
    detail="Печать билета запрещена, потому что заказ уже закрыт.",
    status_code=400,
)

RECEIPT_PRINT_RESTRICTED = fastapi.HTTPException(
    detail="Печать чека запрещена, потому что заказ не был оплачен или отменен.",
    status_code=400,
)

ORDER_ALREADY_CANCELED = fastapi.HTTPException(
    detail="Заказ уже отменен.",
    status_code=400,
)

ORDER_CANCEL_RESTRICTED = fastapi.HTTPException(
    detail="Нельзя отменить оплаченный или завершенный заказ.",
    status_code=400,
)

ORDER_REFUND_RESTRICTED = fastapi.HTTPException(
    detail="Нельзя оформить возврат на отмененные и неоплаченные заказы.",
    status_code=400,
)