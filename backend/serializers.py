from __future__ import annotations

import datetime  # noqa: TC003
import re

import pydantic
from fastapi_camelcase import CamelModel

import exceptions
import models


def generate_pydantic_camel_alias(alias: str) -> str:
    return alias[0].lower + alias[1:].replace("_", "")

class BaseModel(
    CamelModel
):
    """Базовая модель pydantic."""

    class Config:  # noqa: D106
        alias_generator = generate_pydantic_camel_alias  # snake_case → camelCase
        from_attributes = True
        populate_by_name = True  # Разрешает использовать как исходные имена, так и алиасы

class SendSmsRequest(BaseModel):
    """Модель валидации формы отправки смс на авторизацию."""

    phone: str = pydantic.Field(alias="phone", title="Номер телефона")

    @pydantic.field_validator("phone")
    def validate_phone(cls, phone: str) -> str:  # noqa: N805
        if not (re.match(r"\d{11}", phone)):
            raise exceptions.INVALID_PHONE_FORMAT

        return phone


class ValidateSmsRequest(BaseModel):
    """Модель валидации формы ввода смс кода на авторизации."""

    phone: str = pydantic.Field(alias="phone", title="Номер телефона")
    code: str = pydantic.Field(alias="code", title="Код из СМС")  # noqa: RUF001

    @pydantic.field_validator("phone")
    def validate_phone(cls, phone: str) -> str:  # noqa: N805
        if not (re.match(r"\d{11}", phone)):
            raise exceptions.INVALID_PHONE_FORMAT

        return phone

    @pydantic.field_validator("code")
    def validate_code(cls, code: str) -> str:  # noqa: N805
        if not (re.match(r"\d{6}", code)):
            raise exceptions.INVALID_CODE_FORMAT

        return code


class RegionsRequest(BaseModel):
    """Модель валидаци формы запроса на все доступные регионы."""


class OfficesRequest(BaseModel):
    """Модель валидации формы запроса на все доступные офисы."""

    region_id: int | None = pydantic.Field(
        alias="regionId", default=None, title="ID региона"
    )


class ScheduleRequest(BaseModel):
    """Модель валидации формы запроса на расписание фильмов."""

    # hall_id: int | None = pydantic.Field(alias="hallId", default=None, title="ID зала")
    film_id: int = pydantic.Field(
        alias="filmId",
        default=None,
        title="ID фильма",
    )
    date_from: datetime.datetime | None = pydantic.Field(
        alias="dateFrom",
        default=None,
        title="Минимальная дата расписания",
    )
    date_to: datetime.datetime | None = pydantic.Field(
        alias="dateTo",
        default=None,
        title="Максимальная дата расписания",
    )
    #
    # office_id: int = pydantic.Field(alias="officeId", title="ID офиса")
    region_id: int = pydantic.Field(
        alias="regionId",
        title="ID региона",
    )


class HallsRequest(BaseModel):
    """Модель валидации формы запроса списка залов."""

    office_id: int = pydantic.Field(alias="officeId", title="ID офиса")


class HallsForFilmRequest(BaseModel):
    """Модель валидации формы запроса списка залов для фильма."""

    office_id: int = pydantic.Field(alias="officeId", title="ID офиса")


class FimlsSearchRequest(BaseModel):
    """Модель валидации формы запроса списка фильмов."""

    age_restriction: models.AgeRestriction | None = pydantic.Field(
        alias="ageRestiction",
        default=models.AgeRestriction.ZERO_PLUS,
    )

    genres_id: list[int] | None = pydantic.Field(
        alias="genresId",
        default=None,
    )

    rating_from: float | None = pydantic.Field(
        alias="ratingFrom",
        default=None,
    )

    rating_to: float | None = pydantic.Field(
        alias="ratingTo",
        default=None,
    )

    search: str = pydantic.Field(
        alias="search",
        default="",
    )

    office_id: int | None = pydantic.Field(
        alias="officeId",
        default=None,
        title="ID офиса",
    )

class EditProfileRequest(BaseModel):
    """Модель редактирования профиля авторизованного пользователя."""

    first_name: str = pydantic.Field(
        alias="firstName",
        title="Имя",
    )

    last_name: str | None = pydantic.Field(
        alias="lastName",
        default=None,
        title="Фамилия",
    )

    avatar: str | None = pydantic.Field(
        alias="avatar",
        default=None,
        title="Изображение профиля",
    )

    email: str | None = pydantic.Field(
        alias="email",
        default=None,
        title="E-mail",
    )

class UserOrdersRequest(BaseModel):
    page: int | None = pydantic.Field(
        alias="page",
        default=None,
        title="Страница",
    )

    search: str | None = pydantic.Field(
        alias="search",
        default=None,
        title="Строка поиска",
    )

    status: models.OrderStatuses | None = pydantic.Field(
        alias="status",
        default=None,
        title="Статус заказа",
    )

class AddLocalOrderRequest(BaseModel):
    order_id: int = pydantic.Field(
        alias='orderId',
        title="Номер заказа",
    )

    price: int | float = pydantic.Field(
        alias="price",
        title="Цена заказа",
    )

class CreateOrderRequest(BaseModel):
    seat_id: int = pydantic.Field(
        alias="seatId",
        title="ID места",
    )

    schedule_id: int = pydantic.Field(
        alias="scheduleId",
        title="ID расписания",
    )

