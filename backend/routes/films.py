import fastapi

import exceptions
import fn_utils as dates
import models
import serializers

router = fastapi.APIRouter(
    prefix="/films",
)

# FilmResponseModel = models.Film.get_pydantic(
#     include={
#         "id",
#         "title",
#         "age_restriction",
#         "genres",
#         "rating",
#         "description",
#         "duration_seconds",
#         "cover_url",
#         "price",
#         "active_date_from",
#         "active_date_to",
#     },
# )


@router.get(
    "/",
    name="Вывод списка фильмов в прокате",
)
async def get_films():
    current_date = dates.get_now()

    return await models.Film.objects.filter(
        active_date_from__lte=current_date,
        active_date_to__gte=current_date,
    ).select_related("genres").all()

@router.get('/{film_id}/', name="Вывод фильма по ID")
async def get_film(film_id: int):
    film = await models.Film.objects.select_related("genres").get_or_none(id=film_id)
    if not film:
        raise exceptions.FILM_NOT_FOUND

    return film

@router.get(
    "/search/",
    name="Поиск фильмов в прокате",
)
async def search_films(data: serializers.FimlsSearchRequest) -> list[models.Film]:
    current_date = dates.get_now()

    films_query = models.Film.objects.filter(
        active_date_from__gte=current_date,
        active_date_to__lte=current_date,
    )

    if data.search:
        films_query = films_query.filter(
            title__icontains=data.search,
        )
    if data.age_restriction:
        films_query = films_query.filter(
            age_restriction__gte=data.age_restriction,
        )

    if data.genres_id:
        films_query = films_query.filter(
            genres__id__contains=data.genres_id,
        )

    if data.rating_from:
        films_query = films_query.filter(
            rating__gte=data.rating_from,
        )

    if data.rating_to:
        films_query = films_query.filter(
            rating__lte=data.rating_to,
        )

    return await films_query.select_related("genres").all()
