import datetime

import fastapi

import fn_utils as dates
import models
import serializers

router = fastapi.APIRouter(
    prefix="/regions",
    tags=["Офисы и регионы"],
)


@router.get("/", name="Вывод всех регионов")
async def get_regions(form_data: serializers.ScheduleRequest) -> list[models.Schedule]:
    """Вывод расписания по залу, фильму, дате начала и дате окончания фильма."""

    return await models.Region.objects.filter(offices__length__gt=0).all()

@router.get('/{region_id}/offices', name="Вывод всех офисов региона")
async def get_offices(region_id: int):
    return await models.Office.objects.filter(region__id=region_id).all()
