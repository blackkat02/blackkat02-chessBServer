import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException, status
import json
import uuid
from typing import Dict, Any

# Імпортуємо залежність Redis
from src.core.redis_connection import get_redis_client

# --- Ініціалізація Роутера ---
router = APIRouter(prefix="/games", tags=["games"])

# --- Тимчасова структура для відповіді ---
# Ми повертаємо простий словник, а не Pydantic-модель
# Хоча це менш чисто, це відповідає твоїй вимозі "без моделей"
GameResponse = Dict[str, Any]


# --- Ендпоінт: 1. СТВОРЕННЯ СЕСІЇ (Start Game) ---


@router.post("/start", status_code=201, response_model=GameResponse)
async def start_game(
    player_white_id: str = "PlayerA",  # Приймаємо як Query Params, щоб обійти Pydantic Models
    player_black_id: str = "PlayerB",  # Це максимально спрощує
    r: redis.Redis = Depends(get_redis_client),
):
    """Створює нову сесію у Redis з мінімальними даними."""

    game_id = str(uuid.uuid4())
    key = f"game:{game_id}:state"

    # Мінімальний стан, що включає лічильник для тесту
    initial_state_data = {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "w_clock": 600000,
        "b_clock": 600000,
        "players": {"white": player_white_id, "black": player_black_id},
        "move_count": 0,  # Додаємо лічильник для тестування оновлення
        "status": "active",
    }

    # 3. Запис у Redis
    await r.set(key, json.dumps(initial_state_data))
    await r.expire(key, 3600 * 24)  # TTL 24 години

    # 4. Відповідь
    return {
        "game_id": game_id,
        "state": initial_state_data,
        "message": "Minimal session created in Redis. Use GET and PING endpoints to test communication.",
    }


# --- Ендпоінт: 2. ОТРИМАННЯ СТАНУ (Get State) ---


@router.get("/{game_id}", response_model=GameResponse)
async def get_game_state(game_id: str, r: redis.Redis = Depends(get_redis_client)):
    """Повертає поточний стан гри з Redis (для перевірки зчитування)."""
    key = f"game:{game_id}:state"
    game_data_json = await r.get(key)

    if not game_data_json:
        raise HTTPException(
            status_code=404, detail="Гра не знайдена або час сесії вийшов."
        )

    # Повертаємо десеріалізований словник
    return json.loads(game_data_json)


# --- Ендпоінт: 3. СИМУЛЯЦІЯ ХОДУ (Ping/Update Test) ---


@router.post("/{game_id}/ping_move", response_model=GameResponse)
async def ping_move(game_id: str, r: redis.Redis = Depends(get_redis_client)):
    """
    Імітує хід, просто збільшуючи move_count у Redis.
    Це підтверджує, що ти можеш ЧИТАТИ -> МОДИФІКУВАТИ -> ЗАПИСУВАТИ у Redis.
    """
    key = f"game:{game_id}:state"

    # 1. Зчитування
    game_data_json = await r.get(key)
    if not game_data_json:
        raise HTTPException(status_code=404, detail="Гра не знайдена.")

    current_state = json.loads(game_data_json)

    # 2. Модифікація (імітація ходу)
    current_state["move_count"] += 1
    current_state["last_update"] = str(
        uuid.uuid4()
    )  # Унікальний ідентифікатор оновлення

    # 3. Запис
    await r.set(key, json.dumps(current_state))

    # 4. Відповідь
    return current_state
