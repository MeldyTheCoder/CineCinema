import datetime

import fastapi

import fn_utils as dates
import models
import serializers

router = fastapi.APIRouter(
    prefix="/schedule",
    tags=["Расписание"],
)


@router.get("/", name="Вывод расписания")
async def get_schedule(form_data: serializers.ScheduleRequest) -> list[models.Schedule]:
    """Вывод расписания по залу, фильму, дате начала и дате окончания фильма."""
    if not form_data.film_id and not form_data.hall_id:
        raise fastapi.HTTPException(detail="Фильм или зал не указаны.", status_code=400)

    schedule_query = models.Schedule.objects.filter(hall__active=True, hall__office__id=form_data.office_id)

    if form_data.hall_id:
        schedule_query = schedule_query.filter(hall__id=form_data.hall_id)

    if form_data.film_id:
        schedule_query = schedule_query.filter(film__id=form_data.film_id)

    if form_data.date_from:
        time = dates.seconds_since_start_of_day(form_data.date_from)
        day_id = dates.day_of_year(form_data.date_from)
        schedule_query = schedule_query.filter(
            dayid__gte=day_id,
            year=form_data.date_from.year,
            time__gte=time,
        )

    if form_data.date_to:
        time = dates.seconds_since_start_of_day(form_data.date_to)
        day_id = dates.day_of_year(form_data.date_to)
        schedule_query = schedule_query.filter(
            day_id__lte=day_id,
            year=form_data.date_to.year,
            time__lte=time,
        )

    return await schedule_query.all()
