
import fastapi

import models

router = fastapi.APIRouter(
    prefix="/regions",
    tags=["Офисы и регионы"],
)


@router.get("/", name="Вывод всех регионов")
async def get_regions() -> list[models.Region]:
    """Вывод расписания по залу, фильму, дате начала и дате окончания фильма."""
    return await models.Region.objects.select_related("offices").all()


@router.get("/{region_id}/offices/", name="Вывод всех офисов региона")
async def get_offices(region_id: int):
    return await models.Office.objects.filter(region__id=region_id).all()
