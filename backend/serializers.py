from __future__ import annotations

import datetime  # noqa: TC003
import re

import pydantic
import models
import exceptions


class BaseModel(pydantic.BaseModel):
    """Базовая модель pydantic."""


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
    """Модель валидаци формы запроса на все доступные регионы"""

class OfficesRequest(BaseModel):
    """Модель валидации формы запроса на все доступные офисы"""

    region_id: int | None = pydantic.Field(alias='regionId', default=None, title="ID региона")

class ScheduleRequest(BaseModel):
    """Модель валидации формы запроса на расписание фильмов."""

    hall_id: int | None = pydantic.Field(alias="hallId", default=None, title="ID зала")
    film_id: int | None = pydantic.Field(
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

    office_id: int = pydantic.Field(alias="officeId", title="ID офиса")

class HallsRequest(BaseModel):
    """Модель валидации формы запроса списка залов"""

    office_id: int = pydantic.Field(
        alias="officeId", title="ID офиса"
    )

class HallsForFilmRequest(BaseModel):
    """Модель валидации формы запроса списка залов для фильма."""

    office_id: int = pydantic.Field(
        alias="officeId", title="ID офиса"
    )


class FimlsSearchRequest(BaseModel):
    """Модель валидации формы запроса списка фильмов."""

    age_restriction: models.AgeRestriction | None = pydantic.Field(
        alias="ageRestiction", default=models.AgeRestriction.ZERO_PLUS,
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
        title="ID офиса"
    )

