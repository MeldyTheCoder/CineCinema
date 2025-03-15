import datetime
import enum
from email.policy import default
from sys import orig_argv

import databases
import ormar
import sqlalchemy
import sqlalchemy_utils

import settings

if not sqlalchemy_utils.database_exists(settings.DATABASE_URL):
    sqlalchemy_utils.create_database(settings.DATABASE_URL)

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


class MimeType(enum.Enum):
    VIDEO = "video"
    PHOTO = "photo"


def get_current_time() -> datetime.datetime:
    return datetime.datetime.now(tz=settings.TIMEZONE)

def to_camel_case(snake_str: str) -> str:
    parts = snake_str.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

class BaseOrmarModel(ormar.Model):
    ormar_config = ormar_config.copy(
        abstract=True,
    )

    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        return {to_camel_case(key): value for key, value in data.items()}

class CamelQuerySet(ormar.QuerySet):
    async def all_camel(self, *args, **kwargs):
        dataset: list[ormar.Model] = await super().all(*args, **kwargs)
        return [self._to_camel(instance) for instance in dataset]

    @staticmethod
    def _to_camel(instance: ormar.Model):
        """Преобразует данные модели в camelCase."""
        data = instance.dict()
        return {to_camel_case(key): value for key, value in data.items()}

class User(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="users",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    first_name = ormar.String(max_length=50, nullable=False)
    last_name = ormar.String(max_length=50, nullable=False)
    phone = ormar.String(max_length=20, nullable=False)

class Region(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="regions",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    title = ormar.String(
        max_length=100,
        nullable=False,
        unique=True,
    )

    longitude = ormar.Decimal(
        max_digits=9,
        decimal_places=6,
        nullable=False,
    )

    latitude = ormar.Decimal(
        max_digits=9,
        decimal_places=6,
        nullable=False,
    )


class Office(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="offices",
        constraints=[ormar.UniqueColumns('address', 'region')],
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    address = ormar.String(
        max_length=100,
    )

    region = ormar.ForeignKey(
        to=Region,
        nullable=False,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
        related_name="offices",
    )

    longitude = ormar.Decimal(
        max_digits=9,
        decimal_places=6,
        nullable=False,
    )

    latitude = ormar.Decimal(
        max_digits=9,
        decimal_places=6,
        nullable=False,
    )

    active = ormar.Boolean(
        default=True,
        nullable=False,
    )

class Genre(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="genres",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    title = ormar.String(
        max_length=30,
        nullable=False,
        unique=True,
    )


class Film(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="films",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(minimum=1, primary_key=True, autoincrement=True, nullable=False)
    title = ormar.String(max_length=100, nullable=False)
    description = ormar.Text(nullable=False)
    genres = ormar.ManyToMany(
        to=Genre,
        ondelete=ormar.ReferentialAction.SET_NULL,
        onupdate=ormar.ReferentialAction.CASCADE,
    )
    rating = ormar.Decimal(
        maximum=10,
        minimum=1,
        nullable=False,
        max_digits=4,
        decimal_places=2,
    )
    age_restriction = ormar.Enum(enum_class=AgeRestriction, nullable=False)
    duration_seconds = ormar.Integer(minimum=1, nullable=False)
    cover_url = ormar.String(max_length=255, nullable=False)
    price = ormar.Integer(minimum=1, nullable=False)
    active_date_from = ormar.DateTime(nullable=False, timezone=True)
    active_date_to = ormar.DateTime(nullable=False, timezone=True)


class FilmAttachment(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="attachments",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )
    mime_type = ormar.Enum(enum_class=MimeType, nullable=False)
    attachment_url = ormar.String(max_length=255, nullable=False)
    film = ormar.ForeignKey(
        to=Film,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
        related_name="attachments",
    )


class Hall(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="halls",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    title = ormar.String(
        max_length=50,
        unique=True,
        nullable=False,
    )

    price_factor = ormar.Decimal(
        minimum=1.0,
        maximum=2.0,
        decimal_places=2,
        max_digits=3,
        nullable=False,
        default=1.0,
    )

    columns = ormar.Integer(
        minimum=1,
        nullable=False,
        default=1,
    )

    rows = ormar.Integer(
        minimum=1,
        nullable=False,
        default=1,
    )

    active = ormar.Boolean(
        default=True,
        nullable=False,
    )

    office = ormar.ForeignKey(
        to=Office,
        nullable=False,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
        related_name="halls",
    )


class Seat(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="seats",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    row = ormar.Integer(
        nullable=False,
    )

    column = ormar.Integer(
        nullable=False,
    )

    hall = ormar.ForeignKey(
        to=Hall,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=False,
    )

    price_factor = ormar.Decimal(
        minimum=1.0,
        maximum=2.0,
        decimal_places=2,
        max_digits=3,
        nullable=False,
        default=1.0,
    )

    type = ormar.Enum(enum_class=SeatType, nullable=False, default=SeatType.STANDART)


class Schedule(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="schedule",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    hall = ormar.ForeignKey(
        to=Hall,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=False,
        related_name="schedule",
    )

    time = ormar.Integer(
        minimum=1,
        maximum=1440,
        nullable=False,
    )

    film = ormar.ForeignKey(
        to=Film,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=False,
        related_name="schedule",
    )

    day_id = ormar.Integer(
        minimum=1,
        maximum=365,
        nullable=False,
    )

    year = ormar.Integer(
        minimum=2020,
        nullable=False,
    )


class Order(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="orders",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    schedule = ormar.ForeignKey(
        to=Schedule,
        ondelete=ormar.ReferentialAction.RESTRICT,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=False,
    )

    seat = ormar.ForeignKey(
        to=Seat,
        ondelete=ormar.ReferentialAction.RESTRICT,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=False,
    )

    date_created = ormar.DateTime(
        nullable=False,
        timezone=True,
        default=get_current_time,
    )

    user = ormar.ForeignKey(
        to=User,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
    )

    office = ormar.ForeignKey(
        to=Office,
        nullable=False,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
    )


class Announcements(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="announces",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    title = ormar.String(
        max_length=50,
        nullable=False,
    )

    text = ormar.String(
        max_length=100,
        nullable=False,
    )

    cover_url = ormar.Text(
        nullable=False,
    )

    film = ormar.ForeignKey(
        to=Film,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
    )

    date_closes = ormar.DateTime(
        nullable=True,
        timezone=True,
    )

    date_created = ormar.DateTime(
        nullable=False,
        default=get_current_time,
        timezone=True,
    )

class Actor(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="actors",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    first_name = ormar.String(
        max_length=50,
        nullable=False,
    )

    last_name = ormar.String(
        max_length=50,
        nullable=False,
    )

    photo_url = ormar.Text(
        nullable=False,
    )


class FilmActor(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="filmactor",
        queryset_class=CamelQuerySet,
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    actor = ormar.ForeignKey(
        to=Actor,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
        related_name="roles",
    )

    film = ormar.ForeignKey(
        to=Film,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
        related_name="actors",
    )

    role = ormar.String(
        max_length=50,
        nullable=False,
    )

if __name__ != "__main__":
    metadata.create_all(bind=engine)
