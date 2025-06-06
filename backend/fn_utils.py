import math
from datetime import timedelta, datetime, time
import settings


BASE_XP = 100
RATIO = 1.5


def get_now() -> datetime:
    return datetime.now(tz=settings.TIMEZONE)

def get_day_start_end(date: datetime) -> tuple[datetime, datetime]:
    start_of_day = datetime.combine(date, time.min)
    end_of_day = datetime.combine(date, time.max)
    return start_of_day, end_of_day

def get_month_start_end(date: datetime) -> tuple[datetime, datetime]:
    start_of_month = datetime(date.year, date.month, 1)
    next_month = start_of_month.replace(day=28) + timedelta(days=4)
    end_of_month = next_month - timedelta(days=next_month.day)
    return start_of_month, end_of_month

def get_year_start_end(date: datetime) -> tuple[datetime, datetime]:
    start_of_year = datetime(date.year, 1, 1)
    end_of_year = datetime(date.year, 12, 31, 23, 59, 59, 999999)
    return start_of_year, end_of_year

def day_of_year(date: datetime) -> int:
    return date.timetuple().tm_yday

def seconds_since_start_of_day(date: datetime) -> int:
    return date.hour * 3600 + date.minute * 60 + date.second


def create_datetime(day_id: int, year: int, time_seconds: int) -> datetime:
    base_date = datetime(year, 1, 1)
    target_date = base_date + timedelta(days=day_id - 1)

    return (target_date + timedelta(seconds=time_seconds)).replace(tzinfo=settings.TIMEZONE)


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
