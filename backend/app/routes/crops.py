from fastapi import APIRouter, HTTPException, Query
from app.services.crop_service import (
    get_all_crops,
    get_crop_by_name,
    get_crop_details,
    get_crop_history,
    build_ml_input,
    predict_crop_price,
    normalize_crop_name,
    SupabaseQueryError,
)

router = APIRouter()


# ─────────────────────────────────────────────
# GET /crops
# ─────────────────────────────────────────────
@router.get("/")
def get_crops():
    """
    Returns the full list of crops from DB.
    Smart gate: skips external API call if today's data is already sufficient.
    """
    return get_all_crops()


# ─────────────────────────────────────────────
# GET /crops/{name}
# ─────────────────────────────────────────────
@router.get("/{name}")
def get_crop(name: str):
    """
    Returns mandi list + best mandi for a given crop name.
    """
    normalized = normalize_crop_name(name)
    data = get_crop_details(normalized)
    if not data:
        raise HTTPException(status_code=404, detail=f"Crop '{normalized}' not found.")
    return data


# ─────────────────────────────────────────────
# GET /crops/{name}/history
# ─────────────────────────────────────────────
@router.get("/{name}/history")
def crop_history(name: str, mandi: str = Query(default=None, description="Optional mandi name for context")):
    """
    Returns time-series price history for a crop, optionally filtered by mandi, ordered by date ascending.
    """
    normalized = normalize_crop_name(name)
    try:
        data = get_crop_history(normalized, mandi_name=mandi)
    except SupabaseQueryError as e:
        raise HTTPException(status_code=503, detail="Database temporarily unavailable. Please retry in a moment.")

    if not data:
        raise HTTPException(status_code=404, detail=f"No history found for '{normalized}'.")
    return data


# ─────────────────────────────────────────────
# GET /crops/{name}/predict
# ─────────────────────────────────────────────
@router.get("/{name}/predict")
def predict_price(
    name: str,
    mandi: str = Query(default=None, description="Optional mandi name for context"),
):
    """
    Predicts the next modal price for a crop.

    Pipeline:
      1. Fetch price history from DB
      2. Build ML feature vector
      3. Encode + run XGBoost (crop-specific model if available, else general)
      4. On any failure → Gemini LLM fallback

    Response shape:
      {
        "crop":            "Wheat",
        "current_price":   2200,
        "predicted_price": 2350,
        "model_used":      "xgb"        # or "xgb_wheat" / "gemini" / "none"
      }
    """
    result = predict_crop_price(name, mandi_name=mandi)

    # Surface a 503 only when both ML and Gemini are unavailable
    if result.get("model_used") == "none":
        raise HTTPException(
            status_code=503,
            detail=result.get("error", "Prediction unavailable."),
        )

    return result


# ─────────────────────────────────────────────
# GET /crops/{name}/advisory
# ─────────────────────────────────────────────
@router.get("/{name}/advisory")
def crop_advisory(name: str, mandi: str, temp: float, rain: float, desc: str):
    from app.services.crop_service import generate_weather_advisory
    return generate_weather_advisory(name, mandi, temp, rain, desc)

# ─────────────────────────────────────────────
# GET /crops/test  (dev helper — keep for debugging)
# ─────────────────────────────────────────────
@router.get("/test")
def test():
    """Quick smoke-test for build_ml_input."""
    history = [
        {"date": "2026-03-24", "price": 2100},
        {"date": "2026-03-25", "price": 2200},
    ]
    return build_ml_input("Wheat", "Delhi", history)
