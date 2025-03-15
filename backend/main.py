import fastapi
import uvicorn
from starlette.middleware.cors import CORSMiddleware

import exceptions
import models
import settings
from routes import films, halls, schedule, users, regions, actors

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
    redis_host, redis_port = settings.REDIS_URL.split(":")
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


app.include_router(users.router)
app.include_router(schedule.router)
app.include_router(halls.router)
app.include_router(films.router)
app.include_router(regions.router)
app.include_router(actors.router)

if __name__ == "__main__":
    uvicorn.run(
        host=settings.HOST,
        port=settings.PORT,
        app=app,
    )
