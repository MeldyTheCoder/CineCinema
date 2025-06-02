import typing

import fastapi
import ormar

import auth
import exceptions
import models
import serializers
import fn_utils as dates

router = fastapi.APIRouter(
    prefix="/orders",
    tags=["Офисы и регионы"],
)

@router.post('/create', name="Создание заказа")
async def create_order(user: auth.UserType, form_data: serializers.CreateOrderRequest):
    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year
    time = dates.seconds_since_start_of_day(current_date)

    schedule = await models.Schedule.objects.select_related(['film', 'hall']).get_or_none(
        ormar.or_(
            ormar.and_(
                day_id__gt=day_id,
                year__gte=year,
            ),
            ormar.and_(
                day_id=day_id,
                year=year,
                time__gt=time,
            )
        ),
        hall__active=True,
        id=form_data.schedule,
    )

    if not schedule:
        raise exceptions.SCHEDULE_NOT_FOUND

    seats = await models.Seat.objects.filter(
        id__in=form_data.seats,
        hall__id=schedule.hall.id,
    ).all()
    if not seats:
        raise exceptions.SEAT_NOT_FOUND

    if len(seats) < len(form_data.seats):
        raise exceptions.SEAT_UNAVAILABLE

    return await models.create_order(schedule, seats, user)


@router.get("/", name="Вывод всех заказов авторизованного пользователя")
async def get_user_orders(user: auth.UserType, data: typing.Annotated[serializers.UserOrdersRequest, fastapi.Query()]):
    query = models.Order.objects.select_related(
        [
            "user",
            "schedule",
            "schedule__hall",
            "schedule__film",
            "schedule__hall__office",
            "schedule__hall__office__region",
            "schedule__film__genres",
            "seats",
        ],
    ).filter(
        user__id=user.id,
    )

    if data.status:
        query = query.filter(
            status=data.status,
        )

    if data.search:
        query = query.filter(
            schedule__film__title__icontains=data.search.lower(),
        )

    return await query.order_by('-date_created').all()

@router.post('/add/', name="Добавление заказа из чека")
async def add_local_order(user: auth.UserType, form_data: serializers.AddLocalOrderRequest):
    order = await models.add_local_order(
        user=user,
        order_id=form_data.order_id,
        price=form_data.price * 100,
    )

    return order


