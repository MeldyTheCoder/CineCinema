import io

import fastapi
import uvicorn
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

import exceptions
import models
import settings
from routes import actors, bonuses, films, halls, orders, regions, schedule, users

app = fastapi.FastAPI(
    title="CineVision Backend",
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    if not models.database.is_connected:
        await models.database.connect()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await models.database.disconnect()


@app.exception_handler(exceptions.ParseError)
async def handle_parse_error(
    _: fastapi.Request,
    exc: exceptions.ParseError,
) -> fastapi.responses.JSONResponse:
    return fastapi.responses.JSONResponse(
        status_code=422,
        content={"message": f"Ошибка валидации формы: {exc}"},
    )

@app.get('/media/{file_path:path}/', name="Вывод media-файлов")
async def get_media(file_path: str):
    file_path = settings.MEDIA_ROOT / file_path

    if not file_path.is_file() or not file_path.exists():
        raise fastapi.HTTPException(
            status_code=404,
            detail="Файл не найден.",
        )

    with open(file_path, 'rb') as file:
        image_stream = io.BytesIO(file.read())

    return StreamingResponse(content=image_stream, media_type="image")

app.include_router(users.router)
app.include_router(schedule.router)
app.include_router(halls.router)
app.include_router(films.router)
app.include_router(regions.router)
app.include_router(actors.router)
app.include_router(orders.router)
app.include_router(bonuses.router)

if __name__ == "__main__":
    uvicorn.run(
        host=settings.HOST,
        port=settings.PORT,
        app=app,
    )
