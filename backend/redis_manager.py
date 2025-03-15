import random

import redis

import settings

REDIS_HOST, REDIS_PORT = settings.REDIS_URL.split(":")

redis_client = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=0,
    decode_responses=True,
)


def generate_phone_code(phone: str) -> str:
    random_code = random.randint(100000, 999999)
    code_sent = redis_client.get(phone)
    if code_sent:
        return str(code_sent)

    redis_client.setex(phone, 300, random_code)
    return str(random_code)

def check_phone_code(phone: str, code_input: str) -> bool:
    code_exact = redis_client.get(phone)
    if not code_exact:
        return False

    code_valid = code_exact == code_input
    if code_valid:
        redis_client.delete(phone)

    return code_valid


