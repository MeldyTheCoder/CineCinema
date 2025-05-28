import typing

import fastapi

import auth
import exceptions
import models
import serializers
import fn_utils as dates

router = fastapi.APIRouter(
    prefix="/orders",
    tags=["Офисы и регионы"],
)

@router.post('/', name="Создание заказа")
async def create_order(user: auth.UserType, form_data: serializers.CreateOrderRequest):
    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year

    schedule = await models.Schedule.object.get_or_none(
        id=form_data.schedule_id,
        day_id__gte=day_id,
        year__gte=year,
    )
    if not schedule:
        raise exceptions.SCHEDULE_NOT_FOUND

    schedule_date = dates.create_datetime(schedule.day_id, schedule.year, schedule.time)
    if schedule_date < current_date:
        raise exceptions.SCHEDULE_NOT_FOUND

    seat = await models.Seat.objects.get_or_none(
        id=form_data.seat_id,
        hall__id=schedule.hall.id,
    )
    if not seat:
        raise exceptions.SEAT_NOT_FOUND

    order = await models.create_order(
        schedule=schedule,
        seat=seat,
        user=user,
    )

    return order

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
            "seat",
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


