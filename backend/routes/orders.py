import typing

import fastapi
import ormar

import auth
import documents
import exceptions
import models
import serializers
import fn_utils as dates

router = fastapi.APIRouter(
    prefix="/orders",
    tags=["Офисы и регионы"],
)

@router.post('/create/', name="Создание заказа")
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

    return await models.create_order(
        schedule=schedule,
        seats=seats,
        user=user,
        payment_method=form_data.payment_data.payment_method
    )


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

@router.get('/pay/{payment_id}/', name="Оплата заказа")
async def add_local_order(user: auth.UserType, payment_id: int):
    payment = await models.Payment.objects.get_or_none(id=payment_id)
    if not payment:
        raise fastapi.HTTPException(
            detail="Платеж не найден.",
            status_code=404,
        )

    success_url = await models.pay_order(payment, user)
    return {'redirect_url': success_url}

@router.post('/add/', name="Добавление заказа из чека")
async def add_local_order(user: auth.UserType, form_data: serializers.AddLocalOrderRequest):
    order = await models.add_local_order(
        user=user,
        order_id=form_data.order_id,
        price=form_data.price * 100,
    )

    return order

@router.get('/ticket/{order_id}/', name="Печать билета на фильм")
async def print_order_ticket(user: auth.UserType, order_id: int):
    order = await models.Order.objects.select_related(
        ['schedule', 'seats', 'schedule__film', 'office', 'office__region']
    ).get_or_none(
        id=order_id,
        user__id=user.id,
    )
    if not order:
        raise exceptions.ORDER_NOT_FOUND

    if order.status in [
        models.OrderStatuses.NOT_PAID,
        models.OrderStatuses.COMPLETE,
        models.OrderStatuses.REFUND,
        models.OrderStatuses.CANCELED,
    ]:
        raise exceptions.TICKER_PRINT_RESTRICTED

    template = await documents.render_ticket_pdf(order)
    return fastapi.Response(
        content=template,
        media_type='text/html',
        headers={
            'Content-Disposition': 'attachment; filename=ticket.html'
        }
    )

@router.get("/receipt/{order_id}/", name="Печать чека заказа")
async def print_order_receipt(user: auth.UserType, order_id: int):
    order = await models.Order.objects.select_related(
        ['schedule', 'seats', 'schedule__film', 'office', 'office__region', 'schedule__hall']
    ).get_or_none(
        id=order_id,
        user__id=user.id,
    )
    if not order:
        raise exceptions.ORDER_NOT_FOUND

    if order.status in [
        models.OrderStatuses.NOT_PAID,
        models.OrderStatuses.CANCELED,
    ]:
        raise exceptions.RECEIPT_PRINT_RESTRICTED

    template = await documents.render_receipt(order)
    return fastapi.Response(
        content=template,
        media_type='text/html',
        headers={
            'Content-Disposition': 'attachment; filename=ticket.html'
        }
    )

@router.post('/cancel/{order_id}/', name="Отмена заказа")
async def cancel_order(user: auth.UserType, order_id: int):
    order = await models.Order.objects.select_related(['schedule', 'schedule__film', 'schedule__hall']).get_or_none(
        id=order_id,
        user__id=user.id,
    )
    if not order:
        raise exceptions.ORDER_NOT_FOUND

    if order.status in [
        models.OrderStatuses.CANCELED,
    ]:
        raise exceptions.ORDER_ALREADY_CANCELED

    if order.status != models.OrderStatuses.NOT_PAID:
        raise exceptions.ORDER_CANCEL_RESTRICTED

    await order.update(status=models.OrderStatuses.CANCELED, _columns={'status'})
    return order

@router.post('/refund/{order_id}/', name="Возврат заказа")
async def refund_order(user: auth.UserType, order_id: int):
    order = await models.Order.objects.select_related(['schedule', 'schedule__film', 'schedule__hall']).get_or_none(
        id=order_id,
        user__id=user.id,
    )
    if not order:
        raise exceptions.ORDER_NOT_FOUND

    if order.status not in [
        models.OrderStatuses.PAID,
        models.OrderStatuses.POSTPONED,
        models.OrderStatuses.COMPLETE,
    ]:
        raise exceptions.ORDER_REFUND_RESTRICTED

    return await models.refund_order(order, user)