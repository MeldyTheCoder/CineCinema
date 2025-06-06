import fastapi

import auth
import models

router = fastapi.APIRouter(
    prefix="/bonuses",
)

@router.get('/', name="Получить список зачислений/списаний бонусов")
async def get_bonus_logs(user: auth.UserType):
    return await models.get_user_bonuses_info(user)
