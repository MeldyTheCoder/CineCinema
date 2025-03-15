from datetime import timedelta, datetime, time
import settings


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