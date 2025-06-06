import datetime
import enum

import databases
import fastapi
import ormar
import sqlalchemy
import sqlalchemy_utils

import exceptions
import fn_utils as dates
import models
import settings

if not sqlalchemy_utils.database_exists(settings.DATABASE_URL):
    sqlalchemy_utils.create_database(settings.DATABASE_URL)


BONUS_LOG_PRICE_PERCENT = 5

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
    VOID = "void"


class MimeType(enum.Enum):
    VIDEO = "video"
    PHOTO = "photo"


class OrderStatuses(enum.Enum):
    NOT_PAID = "not_paid"
    PAID = "paid"
    COMPLETE = "complete"
    POSTPONED = "postponed"
    CANCELED = "canceled"
    REFUND = "refund"


class BonusLogType(enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"


class PaymentStatuses(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethods(enum.Enum):
    CARD = "card"
    CASH = "cash"
    BONUSES = "bonuses"


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


class Region(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="regions",
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
        constraints=[ormar.UniqueColumns("address", "region")],
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
    director = ormar.String(max_length=120, nullable=False)
    age_restriction = ormar.Enum(enum_class=AgeRestriction, nullable=False)
    duration_seconds = ormar.Integer(minimum=1, nullable=False)
    cover_url = ormar.String(max_length=255, nullable=False)
    price = ormar.Integer(minimum=1, nullable=False)
    active_date_from = ormar.DateTime(nullable=False, timezone=True)
    active_date_to = ormar.DateTime(nullable=False, timezone=True)


class FilmAttachment(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="attachments",
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
        related_name="seats",
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
        maximum=86_400,
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

    seats = ormar.ManyToMany(
        to=Seat,
        ondelete=ormar.ReferentialAction.RESTRICT,
        onupdate=ormar.ReferentialAction.CASCADE,
        nullable=True,
    )

    date_created = ormar.DateTime(
        nullable=False,
        timezone=True,
        default=get_current_time,
    )

    user = ormar.ForeignKey(
        to=User,
        nullable=True,
        ondelete=ormar.ReferentialAction.CASCADE,
        onupdate=ormar.ReferentialAction.CASCADE,
    )

    office = ormar.ForeignKey(
        to=Office,
        nullable=False,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
    )

    status = ormar.Enum(
        enum_class=OrderStatuses,
        default=OrderStatuses.NOT_PAID,
        nullable=False,
    )

    price = ormar.Integer(minimum=0, nullable=False, default=0)


class Announcements(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="announces",
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


class Payment(BaseOrmarModel):
    ormar_config = ormar_config.copy(tablename="payments")

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    amount: int = ormar.Integer(minimum=0, nullable=False)
    status: PaymentStatuses = ormar.Enum(
        enum_class=PaymentStatuses, default=PaymentStatuses.PENDING, nullable=False,
    )
    payment_method: str = ormar.Enum(enum_class=PaymentMethods, nullable=False)
    gateway_id: str = ormar.String(max_length=255, nullable=True)
    created_at: datetime = ormar.DateTime(
        timezone=True, default=get_current_time, nullable=False,
    )

    order: Order = ormar.ForeignKey(
        to=Order,
        related_name="payments",
        ondelete=ormar.ReferentialAction.SET_NULL,
        onupdate=ormar.ReferentialAction.SET_NULL,
        nullable=True,
    )

    async def mark_as_paid(self):
        if self.order.status in [
            OrderStatuses.PAID,
            OrderStatuses.REFUND,
            OrderStatuses.COMPLETE,
            OrderStatuses.CANCELED,
        ]:
            return

        if self.status in [
            PaymentStatuses.SUCCEEDED,
            PaymentStatuses.REFUNDED,
        ]:
            return

        await self.order.update(status=OrderStatuses.PAID)
        await self.update(status=PaymentStatuses.SUCCEEDED)

    @property
    def is_paid(self):
        return all(
            [
                self.status == PaymentStatuses.SUCCEEDED,
                self.order.status == OrderStatuses.PAID,
            ]
        )

    @property
    def success_url(self):
        match self.payment_method:
            case PaymentMethods.CARD:
                return "/success-payment/"
            case PaymentMethods.CASH:
                return "/cash-payment-instruction/"
            case PaymentMethods.BONUSES:
                return "/success-payment/"

        return "/"


class BonusLogs(BaseOrmarModel):
    ormar_config = ormar_config.copy(
        tablename="bonus_logs",
    )

    id = ormar.Integer(
        minimum=1,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    order = ormar.ForeignKey(
        to=Order,
        nullable=False,
        on_delete=ormar.ReferentialAction.SET_NULL,
        on_update=ormar.ReferentialAction.CASCADE,
    )

    bonuses = ormar.Integer(
        minimum=1,
        nullable=False,
    )

    type = ormar.Enum(enum_class=BonusLogType, default=BonusLogType.DEPOSIT)

    user = ormar.ForeignKey(
        to=User,
        nullable=False,
        on_delete=ormar.ReferentialAction.CASCADE,
        on_update=ormar.ReferentialAction.CASCADE,
    )

    date_created = ormar.DateTime(
        default=get_current_time,
    )


@database.transaction()
async def create_order(
    schedule: Schedule, seats: list[Seat], user: User, payment_method: PaymentMethods
):
    """
    Создание заказа на фильм, зал, время и место.
    """
    total_price = 0

    for seat in seats:
        seat_unavailable = await Order.objects.filter(
            seats__id=seat.id,
            schedule__id=schedule.id,
            status__in=[
                OrderStatuses.NOT_PAID,
                OrderStatuses.PAID,
                OrderStatuses.POSTPONED,
            ],
        ).exists()
        if seat_unavailable:
            raise exceptions.SEAT_UNAVAILABLE

        total_price += (
            schedule.film.price * schedule.hall.price_factor * seat.price_factor
        )

    order = await Order.objects.create(
        schedule=schedule,
        user=user,
        office=schedule.hall.office,
        status=OrderStatuses.NOT_PAID,
        price=total_price,
    )

    for seat in seats:
        await order.seats.add(seat)

    payment = await Payment.objects.create(
        amount=total_price,
        status=PaymentStatuses.PENDING,
        payment_method=payment_method,
        order=order,
    )

    return {"order": order, "payment": payment}


@database.transaction()
async def pay_order(payment: Payment, user: User):
    if (
        payment.status
        in [
            PaymentStatuses.SUCCEEDED,
            PaymentStatuses.REFUNDED,
        ]
        or payment.is_paid
    ):
        raise fastapi.HTTPException(
            detail="Платеж уже закрыт.",
            status_code=400,
        )

    if payment.order.status in [
        OrderStatuses.PAID,
        OrderStatuses.REFUND,
        OrderStatuses.COMPLETE,
        OrderStatuses.CANCELED,
    ]:
        raise fastapi.HTTPException(
            detail="Заказ уже оплачен или закрыт.",
            status_code=400,
        )

    if payment.payment_method == PaymentMethods.BONUSES:
        user_bonuses = await get_user_bonuses_info(user)
        if user_bonuses["current_bonuses"] < payment.amount:
            raise fastapi.HTTPException(
                detail="Недостаточно средств на бонусном балансе пользователя для проведения операции.",
                status_code=400,
            )

        await BonusLogs.objects.create(
            bonuses=payment.amount,
            type=BonusLogType.WITHDRAWAL,
            order=payment.order,
            user=user,
        )

        await payment.update(status=PaymentStatuses.SUCCEEDED, _columns=["status"])
        await payment.order.update(status=OrderStatuses.PAID, _columns=["status"])

    elif payment.payment_method == PaymentMethods.CARD:
        await BonusLogs.objects.create(
            bonuses=payment.amount // 100 * BONUS_LOG_PRICE_PERCENT,
            type=BonusLogType.DEPOSIT,
            order=payment.order,
            user=user,
        )

        await payment.update(status=PaymentStatuses.SUCCEEDED, _columns=["status"])
        await payment.order.update(status=OrderStatuses.PAID, _columns=["status"])

    return payment.success_url


@database.transaction()
async def refund_order(order: Order, user: User):
    if order.status not in [
        models.OrderStatuses.PAID,
        models.OrderStatuses.POSTPONED,
        models.OrderStatuses.COMPLETE,
    ]:
        raise exceptions.ORDER_REFUND_RESTRICTED

    await order.update(status=models.OrderStatuses.REFUND, _columns=["status"])
    await order.payments.update(
        status=PaymentStatuses.REFUNDED, _columns=["status"], each=True
    )

    payment = await order.payments.first()
    if payment.payment_method == PaymentMethods.BONUSES:
        await BonusLogs.objects.create(
            bonuses=payment.amount,
            type=BonusLogType.DEPOSIT,
            user=user,
            order=order,
        )

    return order


@database.transaction()
async def add_local_order(order_id: int, price: int, user: User):
    """
    Добавление офлайн-заказа в систему - обновление списка заказа пользователей
    """
    order = await Order.objects.get_or_none(
        id=order_id,
        price=price,
        user__isnull=True,
    )
    if not order:
        raise exceptions.ORDER_NOT_FOUND

    await order.update(
        user=user,
    )

    await BonusLogs.objects.create(
        order=order,
        user=user,
        bonuses=price // 100 * BONUS_LOG_PRICE_PERCENT,
        type=BonusLogType.DEPOSIT,
    )

    return order


async def get_user_bonuses_info(user: User):
    deposit_bonuses_sum = (
        await BonusLogs.objects.filter(type=BonusLogType.DEPOSIT, user__id=user.id).sum(
            "bonuses"
        )
        or 0
    )
    withdrawal_bonuses_sum = (
        await BonusLogs.objects.filter(
            type=BonusLogType.WITHDRAWAL, user__id=user.id
        ).sum("bonuses")
        or 0
    )
    current_bonuses = deposit_bonuses_sum - withdrawal_bonuses_sum

    logs = (
        await BonusLogs.objects.select_related(
            ["order", "order__schedule__film__genres", "order__seats"]
        )
        .filter(
            user__id=user.id,
        )
        .order_by("-date_created")
        .all()
    )

    total_xp = sum([log.bonuses // 100 * 2 for log in logs])

    data = {
        "logs": logs,
        "level_info": dates.get_level_info(total_xp),
        "current_bonuses": current_bonuses,
    }
    return data


async def get_active_schedule_by_id(schedule_id: int):
    """
    Получить активное расписание по его ID
    """
    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year
    time = dates.seconds_since_start_of_day(current_date)

    schedule = await Schedule.objects.select_related(
        ["hall", "film", "hall__office", "hall__office__region", "film__genres"]
    ).get_or_none(
        ormar.or_(
            ormar.and_(
                day_id__gt=day_id,
                year__gte=year,
            ),
            ormar.and_(
                day_id=day_id,
                year=year,
                time__gt=time,
            ),
        ),
        hall__active=True,
        id=schedule_id,
    )
    if not schedule:
        raise exceptions.SCHEDULE_NOT_FOUND

    return schedule


if __name__ != "__main__":
    metadata.create_all(bind=engine)
