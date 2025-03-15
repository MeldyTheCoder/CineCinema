import fastapi

import exceptions
import fn_utils as dates
import models

router = fastapi.APIRouter(
    prefix="/actors",
    tags=["Актеры"],
)



@router.get("/", name="Вывод всех актеров")
async def get_actors():
    return await models.Actor.objects.all()

@router.get('/for-film/{film_id}/', name="Вывод актеров фильма")
async def get_actors_for_film(film_id: int):
    film = await models.Film.objects.get_or_none(id=film_id)
    if not film:
        raise exceptions.FILM_NOT_FOUND

    return await models.FilmActor.objects.filter(film__id=film_id).select_related('actor').all()