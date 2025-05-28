import fastapi

import auth
import models

router = fastapi.APIRouter(
    prefix="/bonuses",
)

import math

BASE_XP = 100
RATIO = 1.5


def calculate_level(total_bonuses: int) -> int:
    """Рассчитывает уровень на основе общего количества бонусов."""
    if total_bonuses < BASE_XP:
        return 1

    level = math.floor(math.log(total_bonuses / BASE_XP, RATIO)) + 1
    return level


def xp_for_level(level: int) -> int:
    """Возвращает необходимый опыт для достижения указанного уровня."""
    return math.ceil(BASE_XP * (RATIO ** (level - 1)))


def get_progress_percentage(total_xp: int) -> float:
    """Рассчитывает процент прогресса до следующего уровня"""
    current_level = calculate_level(total_xp)

    if current_level == 0:
        return (total_xp / BASE_XP) * 100  # Прогресс до 1 уровня

    current_level_xp = xp_for_level(current_level)
    next_level_xp = xp_for_level(current_level + 1)

    percentage = ((total_xp - current_level_xp) / (next_level_xp - current_level_xp)) * 100
    if percentage < 0:
        return 0

    return percentage

def get_level_info(total_bonuses: int) -> dict:
    """Возвращает полную информацию о прогрессе."""
    current_level = calculate_level(total_bonuses)
    next_level_xp = xp_for_level(current_level + 1)
    progress = get_progress_percentage(total_bonuses)

    return {
        "level": current_level,
        "current_xp": total_bonuses,
        "next_level_xp": next_level_xp,
        "progress": progress  # в процентах
    }

@router.get('/', name="Получить список зачислений/списаний бонусов")
async def get_bonus_logs(user: auth.UserType):
    deposit_bonuses_sum = await models.BonusLogs.objects.filter(type=models.BonusLogType.DEPOSIT).sum('bonuses') or 0
    withdrawal_bonuses_sum = await models.BonusLogs.objects.filter(type=models.BonusLogType.WITHDRAWAL).sum('bonuses') or 0
    current_bonuses = deposit_bonuses_sum - withdrawal_bonuses_sum
    logs = await models.BonusLogs.objects.select_related(['order', 'order__schedule__film__genres']).filter(user__id=user.id).all()
    total_xp = sum([log.bonuses // 100 * 2 for log in logs])

    data = {
        'logs': logs,
        "level_info": get_level_info(total_xp),
        "current_bonuses": current_bonuses,
    }
    return data
