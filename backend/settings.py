import os
import datetime
import pathlib

# Корневой каталог проекта
PROJECT_ROOT = pathlib.Path(__file__).parent

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

# Путь, куда будут сохраняться все загруженные файлы
MEDIA_ROOT = PROJECT_ROOT / 'media'

# Путь, куда будут сохраняться все аватары пользователей
AVATAR_ROOT = MEDIA_ROOT / 'avatars'
