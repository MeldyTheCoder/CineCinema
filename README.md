# CineCinema

Система онлайн-бронирования билетов для кинотеатра, состоящая из фронтенд-приложения (React) и бэкенд-сервера (Python FastAPI). Для работы требуется Docker, Node.js и Python 3.9+.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Effector](https://img.shields.io/badge/Effector-6D2E8C?style=for-the-badge&logo=)
![Ormar](https://img.shields.io/badge/Ormar-525252?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAEOSURBVEhL7ZX9DYIwEMXpJOIkwiTKJOIk4iSyiThJfY+0pi2FntLwF00uRo6+X++Dnio2WGoDRiGGaK1LHOgKq2ADrFFK8Te5foHoQM2C+hRFBEEUFwjdI2ItornlgjBNbUSsA6TJBWEdnhEx1qXLAqEIUhZGI4qCe72aGCE+f7ODcEqvqKbDGFUfdpbjO4zCTq1CyAv+0gmfHcQTzxbXHIyN4e4j5KudgljeBLbQceOefyAurMYftjPTNrvWQJZ0Pd8OEadqbeHFoL0m4lThRV5JR7thMk/MHUQ/P7YTjFdGavV4gfaITcvk0DLQMwTaCCnf0KK4gdnrZMCjOvuMd0CVZFC5USfTlSqGxP8BA1mAGujuO9oAAAAASUVORK5CYII=)
![Docker](https://img.shields.io/badge/MySQL-285e87?style=for-the-badge&logo=mysql&logoColor=white)
## Запуск тестовой среды

### Предварительные требования
1. Установите [Docker](https://docs.docker.com/get-docker/)
2. Установите [Node.js](https://nodejs.org/) (v16+)
3. Установите [Python](https://www.python.org/downloads/) (3.9+)

### Шаги запуска

#### 1. Запуск инфраструктуры
```bash
docker compose up -d mysql_service redis
```
#### 2. Запуск фронтенда
```bash
cd cinefrontend
npm install
npm start
```
Фронтенд будет доступен по адресу: http://localhost:3000

#### 3. Запуск бэкенда
```bash
cd ../backend
python -m venv venv

# Активация окружения для Windows
.\venv\Scripts\activate

# Активация окружения для Linux/MacOS
source venv/bin/activate // Linux/MacOS

pip install -r requirements.txt
python main.py
```

Бэкенд будет доступен по адресу: http://localhost:8000

## Важные примечания
Redis используется для хранения СМС-кодов авторизации и регистрации
Для остановки Docker-контейнеров выполните:

```bash
docker compose down
```

## Структура проекта
```
CineCinema/
├── cinefrontend/    # React-приложение
├── backend/         # FastAPI сервер
├── docker-compose.yml # Конфигурация Docker
└── ...              # Другие компоненты
```
