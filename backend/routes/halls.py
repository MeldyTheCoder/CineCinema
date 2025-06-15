import fastapi

import exceptions
import fn_utils as dates
import models
import serializers

router = fastapi.APIRouter(
    prefix="/halls",
    tags=["Залы"],
)


HallResponseModel = models.Hall.get_pydantic(
    include={
        "id",
        "title",
        "priceFactor",
        "columns",
        "rows",
        "active",
    },
)


@router.get("/{office_id}/", name="Вывод всех залов офиса")
async def get_halls(office_id: int) -> list[models.Hall]:
    office = await models.Office.objects.get_or_none(id=office_id)
    if not office:
        raise exceptions.OFFICE_NOT_FOUND

    return await models.Hall.objects.filter(active=True, office__id=office.id).all()


@router.get(
    "/for-film/{film_id}/",
    name="Вывод всех ближайших по расписанию залов, в которых идет указанный фильм",
    deprecated=True,
)
async def get_halls_for_film(
    data: serializers.HallsForFilmRequest,
    film_id: int,
) -> list[models.Hall]:
    now = dates.get_now()
    day_id = dates.day_of_year(now)
    time = dates.seconds_since_start_of_day(now)
    year = now.year

    office = await models.Office.objects.get_or_none(
        id=data.office_id,
    )

    if not office:
        raise exceptions.OFFICE_NOT_FOUND

    return await models.Hall.objects.filter(
        active=True,
        schedule__film__id=film_id,
        schedule__day_id__gte=day_id,
        schedule__year__gte=year,
        schedule__time__gt=time,
        office__id=office.id,
    ).all()


@router.get('/{hall_id}/seats/', name="Вывод доступных мест в зале.", deprecated=True)
async def get_hall_seats(hall_id: int):
    hall = await models.Hall.objects.get_or_none(
        id=hall_id
    )

    if not hall:
        raise exceptions.HALL_NOT_FOUND

    return await hall.seats.all()