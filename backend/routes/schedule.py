import datetime
import typing

import fastapi
import ormar
import exceptions
import fn_utils as dates
import models
import serializers

router = fastapi.APIRouter(
    prefix="/schedule",
    tags=["Расписание"],
)


@router.get(
    "/",
    name="Вывод расписания",
)
async def get_schedule(
    form_data: typing.Annotated[serializers.ScheduleRequest, fastapi.Query()],
):
    """Вывод расписания по залу, фильму, дате начала и дате окончания фильма."""
    if not form_data.film_id or not form_data.region_id:
        raise fastapi.HTTPException(
            detail="Фильм и регион не указаны.",
            status_code=400,
        )

    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year
    time = dates.seconds_since_start_of_day(current_date)

    schedule_query = models.Schedule.objects.select_related(
        ["hall", "film", "hall__office", "hall__office__region", "film__genres"]
    ).filter(
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
        film__id=form_data.film_id,
        hall__office__region__id=form_data.region_id,
    )
    if form_data.date_from:
        time = dates.seconds_since_start_of_day(form_data.date_from)
        day_id = dates.day_of_year(form_data.date_from)
        schedule_query = schedule_query.filter(
            ormar.or_(
                ormar.and_(
                    day_id__gt=day_id,
                    year__gte=form_data.date_from.year,
                ),
                ormar.and_(
                    day_id=day_id,
                    year=year,
                    time__gt=time,
                ),
            )
        )

    if form_data.date_to:
        time = dates.seconds_since_start_of_day(form_data.date_to)
        day_id = dates.day_of_year(form_data.date_to)
        schedule_query = schedule_query.filter(
            day_id__lte=day_id,
            year=form_data.date_to.year,
            time__lte=time,
        )

    return await schedule_query.limit(20).all()


@router.post("/seats/{schedule_id}/status/", name="Проверка статуса выбранных мест")
async def check_seats_status(schedule_id: int, data: serializers.SeatsStatusRequest):
    schedule = await models.Schedule.objects.select_related(["hall"]).get_or_none(
        id=schedule_id,
    )
    if not schedule:
        raise exceptions.SCHEDULE_NOT_FOUND

    seats_objects = await models.Seat.objects.filter(
        hall__id=schedule.hall.id,
        id__in=data.seats,
    ).all()

    if len(data.seats) > len(seats_objects):
        raise exceptions.SEAT_NOT_FOUND

    return await models.check_seats_available(schedule, seats_objects)


@router.get("/seats/{schedule_id}/", name="Вывод мест в зале под расписание")
async def get_seats_for_schedule(schedule_id: int):
    annotated_seats = []
    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year
    time = dates.seconds_since_start_of_day(current_date)

    schedule = await models.Schedule.objects.select_related(
        ["hall", "film", "hall__office", "hall__office__region", "film__genres"],
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

    seats = (
        await models.Seat.objects.filter(
            hall__id=schedule.hall.id,
        )
        .order_by("id")
        .all()
    )

    for seat in seats:
        not_available = await models.Order.objects.filter(
            seats__id=seat.id,
            schedule__id=schedule.id,
            status__in=[
                models.OrderStatuses.NOT_PAID,
                models.OrderStatuses.PAID,
                models.OrderStatuses.COMPLETE,
                models.OrderStatuses.POSTPONED,
            ],
        ).exists()

        annotated_seats.append(
            {
                **seat.model_dump(),
                "is_available": not not_available,
                "verbose_name": await seat.verbose_name(),
            },
        )
    return annotated_seats


@router.get("/by-id/{schedule_id}/", name="Вывод расписания по ID")
async def get_schedule_by_id(schedule_id: int):
    current_date = dates.get_now()
    day_id = dates.day_of_year(current_date)
    year = current_date.year
    time = dates.seconds_since_start_of_day(current_date)

    schedule = await models.Schedule.objects.select_related(
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
