import redis.asyncio as redis
import os
from fastapi import HTTPException, status

# --- ГЛОБАЛЬНІ ОБ'ЄКТИ ---
# Змінні середовища (для Docker)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Глобальний клієнт Redis, доступний усім роутерам
redis_client: redis.Redis = None


async def init_redis_client():
    """Ініціалізує глобальний клієнт Redis та FastAPILimiter."""
    global redis_client

    print(f"INFO: Підключення до Redis: {REDIS_HOST}:{REDIS_PORT}")
    redis_url = f"redis://{REDIS_HOST}:{REDIS_PORT}"

    # Створення глобального з'єднання Redis
    try:
        redis_client = redis.from_url(
            redis_url, encoding="utf-8", decode_responses=True
        )
        await redis_client.ping()
        print("INFO: З'єднання з Redis успішно встановлено.")
    except Exception as e:
        print(f"ПОМИЛКА: Не вдалося підключитися до Redis. {e}")
        # Тут ти можеш обрати 'fail-fast'


async def close_redis_client():
    """Закриває підключення до Redis при завершенні роботи."""
    global redis_client
    if redis_client:
        await redis_client.close()
        print("INFO: З'єднання з Redis закрито.")


def get_redis_client() -> redis.Redis:
    """Залежність, що повертає глобальний клієнт Redis."""
    if redis_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Redis client is not initialized",
        )
    return redis_client
