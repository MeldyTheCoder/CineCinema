import datetime
import enum

import databases
import fastapi
import ormar
import sqlalchemy
import sqlalchemy_utils

import exceptions
import fn_utils as dates
import settings

engine = sqlalchemy.create_engine(settings.DATABASE_URL)
database = databases.Database(settings.DATABASE_URL)
metadata = sqlalchemy.MetaData()

ormar_config = ormar.OrmarConfig(
    metadata=metadata,
    engine=engine,
    database=database,
)

class AgeRestriction(enum.Enum):
    ZERO_PLUS = 0
    SIX_PLUS = 6
    TWELVE_PLUS = 12
    SIXTEEN_PLUS = 16
    EIGHTEEN_PLUS = 18


class SeatType(enum.Enum):
    STANDART = "standart"
    VIP = "vip"
    DISABLED = "disabled"
    VOID = 'void'


class MimeType(enum.Enum):
    VIDEO = "video"
    PHOTO = "photo"

class OrderStatuses(enum.Enum):
    NOT_PAID = 'not_paid'
    PAID = 'paid'
    COMPLETE = 'complete'
    POSTPONED = 'postponed'
    CANCELED = 'canceled'
    REFUND = 'refund'

class BonusLogType(enum.Enum):
    DEPOSIT = 'deposit'
    WITHDRAWAL = 'withdrawal'

class PaymentStatuses(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethods(enum.Enum):
    CARD = 'card'
    CASH = 'cash'
    BONUSES = 'bonuses'


def get_current_time() -> datetime.datetime:
    return datetime.datetime.now(tz=settings.TIMEZONE)


def to_camel_case(alias: str) -> str:
    return alias[0].lower() + alias[1:].replace("_", "")


class BaseOrmarModel(ormar.Model):
    ormar_config = ormar_config.copy(
        abstract=True,
    )

class User(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="users",
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    first_name = ormar.String(max_length=50, nullable=False)
    last_name = ormar.String(max_length=50, nullable=True)
    phone = ormar.String(max_length=20, nullable=False)
    email = ormar.String(nullable=True, max_length=120)
    avatar = ormar.Text(nullable=True)
    registration_date = ormar.DateTime(
        default=get_current_time,
        nullable=True,
    )
