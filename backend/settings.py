import os
import datetime

# Уникальный ключ проекта для хэширования
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "3roighjerugherokfierhguern3425234")

# Ссылка на подключение к БД
DATABASE_URL = os.getenv("DATABASE_URL", "mysql://root:1234@127.0.0.1:3307/cine")

# Ссылка на подключение Redis
REDIS_URL = os.getenv("REDIS_URL", "127.0.0.1:6380")

# Режим отладки
DEBUG = bool(os.getenv("DEBUG", "True"))

# Хост сервера
HOST = os.getenv("HOST", "0.0.0.0")  # noqa: S104

# Порт сервера
PORT = int(os.getenv("PORT", "8080"))

# Часовой пояс проекта
TIMEZONE = datetime.timezone(offset=datetime.timedelta(hours=3))
