import datetime
import enum

import pydantic


class Model(pydantic.BaseModel):
    """
    Базовая модель pydantic
    """


class OrderStatuses(enum.Enum):
    NOT_PAID = 'not_paid'
    PAID = 'paid'
    COMPLETE = 'complete'
    POSTPONED = 'postponed'
    CANCELED = 'canceled'
    REFUND = 'refund'

class Film(Model):
    id: int = pydantic.Field(
        title="ID"
    )

    title: str = pydantic.Field(
        title="Название фильма"
    )

class Hall(Model):
    id: int = pydantic.Field(
        title="ID"
    )

    title: str = pydantic.Field(
        title="Название зала",
    )

class Schedule(Model):
    id: int = pydantic.Field(
        title="ID"
    )

    time: int = pydantic.Field(
        title="Время в секундах",
    )

    day_id: int = pydantic.Field(
        title="ID дня",
    )

    year: int = pydantic.Field(
        title="Год",
    )

    hall: Hall = pydantic.Field(
        title="Зал"
    )

    @classmethod
    @pydantic.field_validator('year')
    def validate_year(cls, value: int):
        if value > datetime.datetime.now().year:
            raise ValueError(
                "Год не может быть больше текущего."
            )
        return value

    @classmethod
    @pydantic.field_validator('day_id')
    def validate_day_id(cls, value: int):
        if value > 365:
            raise ValueError(
                "В году не может быть больше 365 дней."
            )

        if value < 0:
            raise ValueError(
                "Минимальное значение - 1"
            )

        return value

    @classmethod
    @pydantic.field_validator('time')
    def validate_time(cls, value: int):
        if value > 86_400:
            raise ValueError(
                "Максимальное значение - 86_400."
            )

        if value < 0:
            raise ValueError(
                "Минимальное значение - 0."
            )
        return value


class Order(Model):
    id: int = pydantic.Field(
        title="ID",
    )

    date_created: datetime.datetime = pydantic.Field(
        title="Дата создания",
    )

    status: OrderStatuses = pydantic.Field(
        title="Статус заказа",
    )

    price: int = pydantic.Field(
        title="Цена заказа",
        default=0,
    )


