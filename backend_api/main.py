"""
Main entry point for the FastAPI application.

This module initializes the FastAPI application, includes the API router,
and defines the startup command for the server.
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from contextlib import asynccontextmanager
from src.api.v1.router import router as api_router
from src.core.redis_connection import (
    init_redis_client,
    close_redis_client,
    get_redis_client,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Життєвий цикл додатку: ініціалізація та завершення роботи."""

    # 1. Ініціалізація Redis клієнта та підключення
    await init_redis_client()

    # 2. Ініціалізація FastAPILimiter
    # Використовуємо get_redis_client() для отримання активного клієнта
    try:
        await FastAPILimiter.init(get_redis_client())
        print("INFO: FastAPILimiter initialized. Startup complete.")
    except Exception as e:
        print(
            f"ПОПЕРЕДЖЕННЯ: FastAPILimiter не ініціалізовано. Перевірте Redis-з'єднання. {e}"
        )

    yield

    # 3. Закриття з'єднань при завершенні роботи
    await FastAPILimiter.close()
    await close_redis_client()
    print("INFO: Application shutting down. Resources closed.")


# Create the FastAPI application instance.
app = FastAPI(
    lifespan=lifespan,
    title="Chess API",
    description="Minimal FastAPi Backend for Chess Game using Redis.",
    version="1.0.0",  # API version
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router under the `/api` prefix.
# This keeps the main application logic separate from the API endpoints.
app.include_router(api_router, prefix="/api")


# The `if __name__ == "__main__":` block is for local development.
# In a production environment (e.g., in a Docker container), the `CMD`
# from the Dockerfile will be used to run the application, not this block.
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
