import fastapi
from src import settings

app = fastapi.FastAPI(
    debug=settings.DEBUG,
)

async def get_user():
    return await

UserType = fastapi.Depends()

@app.get('/bill/{order_id}', name="")
async def render_order_bill(user: ):
    return