import requests
import os
import joblib
import pandas as pd
import google.generativeai as genai
from datetime import datetime, date
from dotenv import load_dotenv
from app.db.supabase_client import supabase

load_dotenv()

API_KEY     = os.getenv("AGRIM_API_KEY")
RESOURCE_ID = os.getenv("RESOURCE_ID")
GEMINI_KEY  = os.getenv("GEMINI_API_KEY")

BASE_URL = "https://api.data.gov.in/resource"

# Minimum records threshold — if today already has this many, skip API call
DAILY_RECORD_THRESHOLD = 50

# Crops that may have their own dedicated model file
SPECIAL_CROPS = {"wheat", "rice", "onion"}

dummy_crops = [
    {"name": "Wheat", "price": 2200, "trend": "up"},
    {"name": "Rice",  "price": 1800, "trend": "down"},
]


# ─────────────────────────────────────────────
# 🤖 ML MODEL REGISTRY  (loaded once at import)
# ─────────────────────────────────────────────
def _safe_load(path: str):
    """Load a joblib file if it exists, else return None."""
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            print(f"[ML] ✅ Loaded: {path}")
            return model
        except Exception as e:
            print(f"[ML] ❌ Failed to load {path}: {e}")
    else:
        print(f"[ML] ⚠️  Not found (skipping): {path}")
    return None


# General model + encoders — always needed
GENERAL_MODEL = _safe_load("xgb_model.joblib")
ENCODERS      = _safe_load("encoders.joblib")

# Crop-specific models — loaded only when the file exists
CROP_MODELS: dict = {}
for _crop in SPECIAL_CROPS:
    _path = f"{_crop}_model.joblib"
    _m    = _safe_load(_path)
    if _m is not None:
        CROP_MODELS[_crop] = _m

print(f"[ML] Registry ready — general: {'✅' if GENERAL_MODEL else '❌'} "
      f"| encoders: {'✅' if ENCODERS else '❌'} "
      f"| crop-specific: {list(CROP_MODELS.keys())}")


# ─────────────────────────────────────────────
# 📅 DATE PARSER
# ─────────────────────────────────────────────
def parse_date(date_str: str) -> str | None:
    """Convert DD/MM/YYYY → YYYY-MM-DD for PostgreSQL."""
    try:
        return datetime.strptime(date_str.strip(), "%d/%m/%Y").strftime("%Y-%m-%d")
    except ValueError:
        print(f"[DATE] ⚠️ Invalid date format: '{date_str}'")
        return None


# ─────────────────────────────────────────────
# 🧠 NORMALIZATION
# ─────────────────────────────────────────────
def normalize_crop_name(name: str) -> str:
    name = name.lower().strip()

    normalization_map = {
        "wheat":       "Wheat",
        "rice":        "Rice",
        "paddy":       "Rice",
        "onion":       "Onion",
        "tomato":      "Tomato",
        "potato":      "Potato",
        "maize":       "Maize",
        "soybean":     "Soybean",
        "soya bean":   "Soybean",
        "mustard":     "Mustard",
        "cotton":      "Cotton",
        "sugarcane":   "Sugarcane",
        "garlic":      "Garlic",
        "ginger":      "Ginger",
        "brinjal":     "Brinjal",
        "cauliflower": "Cauliflower",
        "cabbage":     "Cabbage",
        "banana":      "Banana",
        "mango":       "Mango",
        "groundnut":   "Groundnut",
        "sunflower":   "Sunflower",
    }

    for key, normalized in normalization_map.items():
        if key in name:
            return normalized

    return name.title()


# ─────────────────────────────────────────────
# 📊 SMART DAILY FETCH GATE
# ─────────────────────────────────────────────
def _today_data_sufficient() -> bool:
    """
    Returns True if today already has >= DAILY_RECORD_THRESHOLD rows
    in crop_prices, meaning we can skip the external API call.
    """
    today_str = date.today().isoformat()          # YYYY-MM-DD
    try:
        result = (
            supabase.table("crop_prices")
            .select("id", count="exact")
            .eq("arrival_date", today_str)
            .execute()
        )
        count = result.count if result.count is not None else 0
        print(f"[GATE] Today ({today_str}) has {count} records in DB. "
              f"Threshold = {DAILY_RECORD_THRESHOLD}.")
        return count >= DAILY_RECORD_THRESHOLD
    except Exception as e:
        # If we can't check, be conservative and allow fetch
        print(f"[GATE] ⚠️ Could not check today's record count: {e}. Will attempt API.")
        return False


# ─────────────────────────────────────────────
# 🌐 FETCH API DATA
# ─────────────────────────────────────────────
def fetch_from_agrim() -> list | None:
    print("[AGRIM] ▶ Starting API fetch...")

    if not API_KEY:
        print("[AGRIM] ❌ AGRIM_API_KEY is missing from .env")
        return None
    if not RESOURCE_ID:
        print("[AGRIM] ❌ RESOURCE_ID is missing from .env")
        return None

    try:
        url    = f"{BASE_URL}/{RESOURCE_ID}"
        params = {"api-key": API_KEY, "format": "json", "limit": 400}

        response = requests.get(url, params=params, timeout=10)
        print(f"[AGRIM] URL: {response.url}")
        print(f"[AGRIM] Status: {response.status_code}")

        if response.status_code != 200:
            print(f"[AGRIM] ❌ Non-200 response. Body: {response.text[:300]}")
            return None

        try:
            data = response.json()
        except Exception as e:
            print(f"[AGRIM] ❌ Failed to parse JSON: {e}")
            return None

        records = data.get("records", [])
        print(f"[AGRIM] ✅ Raw records fetched: {len(records)}")

        if not records:
            print("[AGRIM] ⚠️ API returned 0 records. Check RESOURCE_ID or quota.")
            return None

        crops   = []
        skipped = 0

        for record in records:
            try:
                raw_name     = record.get("commodity",    "").strip()
                raw_price    = record.get("modal_price",  None)
                market       = record.get("market",       "").strip()
                state        = record.get("state",        "").strip()
                district     = record.get("district",     "").strip()
                arrival_date = record.get("arrival_date", "").strip()

                parsed_date = parse_date(arrival_date)

                if not raw_name or not raw_price or not market or not parsed_date:
                    skipped += 1
                    continue

                crops.append({
                    "name":         normalize_crop_name(raw_name),
                    "price":        int(float(str(raw_price).replace(",", ""))),
                    "market":       market,
                    "state":        state    if state    else "Unknown",
                    "district":     district if district else "Unknown",
                    "arrival_date": parsed_date,
                })

            except (ValueError, TypeError) as e:
                print(f"[AGRIM] ⚠️ Skipping bad record: {record} | Error: {e}")
                skipped += 1

        print(f"[AGRIM] ✅ Clean records: {len(crops)} | Skipped: {skipped}")
        return crops if crops else None

    except requests.exceptions.Timeout:
        print("[AGRIM] ❌ Request timed out after 10 s.")
    except requests.exceptions.ConnectionError:
        print("[AGRIM] ❌ Connection error — cannot reach api.data.gov.in")
    except requests.exceptions.RequestException as e:
        print(f"[AGRIM] ❌ Request error: {e}")
    except Exception as e:
        print(f"[AGRIM] ❌ Unexpected error: {e}")

    return None


# ─────────────────────────────────────────────
# 🗄 STORE DATA
# ─────────────────────────────────────────────
def store_crop_data(crops: list) -> None:
    print(f"[DB] ▶ Storing {len(crops)} records...")
    success_count = 0
    error_count   = 0

    for crop in crops:
        crop_name = crop.get("name", "?")

        try:
            # STEP 1 — upsert crop
            crop_res = supabase.table("crops").upsert(
                {"name": crop_name}, on_conflict="name"
            ).execute()

            if not crop_res.data:
                print(f"[DB] ❌ crops upsert returned no data for '{crop_name}'")
                error_count += 1
                continue

            crop_id = crop_res.data[0]["id"]

            # STEP 2 — upsert mandi
            mandi_res = supabase.table("mandis").upsert(
                {
                    "name":     crop["market"],
                    "state":    crop["state"],
                    "district": crop["district"],
                },
                on_conflict="name"
            ).execute()

            if not mandi_res.data:
                print(f"[DB] ❌ mandis upsert returned no data for '{crop['market']}'")
                error_count += 1
                continue

            mandi_id = mandi_res.data[0]["id"]

            # STEP 3 — upsert crop_prices
            supabase.table("crop_prices").upsert(
                {
                    "crop_id":      crop_id,
                    "mandi_id":     mandi_id,
                    "price":        crop["price"],
                    "arrival_date": crop["arrival_date"],
                },
                on_conflict="crop_id,mandi_id,arrival_date"
            ).execute()

            success_count += 1

        except Exception as e:
            print(f"[DB] ❌ Unexpected error for '{crop_name}': {e}")
            error_count += 1

    print(f"[DB] ✅ Done — Stored: {success_count} | Errors: {error_count}")


# ─────────────────────────────────────────────
# 📊 GET ALL CROPS
# ─────────────────────────────────────────────
def get_all_crops() -> list:
    print("[PIPELINE] ▶ get_all_crops() called")

    # --- Smart gate: skip API if today's data is already sufficient ---
    if _today_data_sufficient():
        print("[PIPELINE] ✅ Today's data already in DB — skipping API call.")
    else:
        fresh_data = fetch_from_agrim()
        if fresh_data:
            print(f"[PIPELINE] ▶ Storing {len(fresh_data)} fresh records...")
            store_crop_data(fresh_data)
        else:
            # API failed — log and continue with whatever is in DB
            print("[PIPELINE] ⚠️ API returned no data. Serving from existing DB.")

    # Always read from DB
    try:
        db_data = supabase.table("crops").select("*").execute()
    except Exception as e:
        print(f"[PIPELINE] ❌ Failed to read crops table: {e}")
        return dummy_crops

    if db_data.data:
        print(f"[PIPELINE] ✅ Returning {len(db_data.data)} crops from DB.")
        return db_data.data

    print("[PIPELINE] ⚠️ DB is empty — returning dummy fallback.")
    return dummy_crops


# ─────────────────────────────────────────────
# 📈 CROP HISTORY
# ─────────────────────────────────────────────
def get_crop_history(name: str) -> dict | None:
    crop_res = supabase.table("crops").select("*").eq("name", name).execute()
    if not crop_res.data:
        return None

    crop_id = crop_res.data[0]["id"]

    price_res = (
        supabase.table("crop_prices")
        .select("price, arrival_date")
        .eq("crop_id", crop_id)
        .order("arrival_date")
        .execute()
    )

    history = [{"date": r["arrival_date"], "price": r["price"]} for r in price_res.data]
    return {"crop": name, "history": history}


# ─────────────────────────────────────────────
# 🔧 ML INPUT BUILDER
# ─────────────────────────────────────────────
def build_ml_input(crop_name: str, mandi_name: str, history: list) -> dict | None:
    if not history or len(history) < 2:
        return None

    latest = history[-1]
    lag_7  = history[-2]["price"]          # best available lag proxy

    date_obj = datetime.strptime(latest["date"], "%Y-%m-%d")
    month    = date_obj.month

    return {
        "commodity":           crop_name,
        "market":              mandi_name,
        "district_name":       mandi_name,   # improve when district available
        "state":               "Unknown",

        "modal_price":         latest["price"],
        "price_lag_7":         lag_7,

        "year":                date_obj.year,
        "month":               month,
        "day":                 date_obj.day,

        "season_summer":       1 if month in [4, 5, 6]      else 0,
        "season_monsoon":      1 if month in [7, 8, 9]      else 0,
        "season_post_monsoon": 1 if month in [10, 11]       else 0,
        "season_winter":       1 if month in [12, 1, 2, 3]  else 0,
    }


# ─────────────────────────────────────────────
# 🤖 ML PREDICTION LOGIC
# ─────────────────────────────────────────────
def _pick_model(crop_name: str):
    """
    Returns (model, model_label).
    Prefers a crop-specific model when available; falls back to general.
    """
    key = crop_name.lower()
    if key in SPECIAL_CROPS and key in CROP_MODELS:
        return CROP_MODELS[key], f"xgb_{key}"
    if GENERAL_MODEL:
        return GENERAL_MODEL, "xgb"
    return None, None


def _encode_and_predict(ml_input: dict, model, encoders: dict) -> float:
    """
    Encode categorical features, build a DataFrame, and run model.predict().
    Raises on any failure — caller handles the exception.
    """
    row = ml_input.copy()

    # Encode categoricals if the encoder knows about them
    for col in ("commodity", "market", "district_name", "state"):
        if col in encoders:
            le  = encoders[col]
            val = row[col]
            if val in le.classes_:
                row[col] = int(le.transform([val])[0])
            else:
                # Unseen label — use -1 as OOV sentinel
                row[col] = -1

    feature_order = [
        "commodity", "market", "district_name", "state",
        "modal_price", "price_lag_7",
        "year", "month", "day",
        "season_summer", "season_monsoon",
        "season_post_monsoon", "season_winter",
    ]

    df = pd.DataFrame([{k: row[k] for k in feature_order}])
    prediction = float(model.predict(df)[0])
    return round(prediction, 2)


# ─────────────────────────────────────────────
# 🌟 GEMINI FALLBACK
# ─────────────────────────────────────────────
def _gemini_predict(crop_name: str, history: list) -> dict:
    """
    Use Gemini to estimate the next price from historical data.
    Returns {"predicted_price": float, "model_used": "gemini"} or raises.
    """
    if not GEMINI_KEY:
        raise ValueError("GEMINI_API_KEY not set in .env")

    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")   # adjust if needed

    price_series = [f"₹{h['price']} on {h['date']}" for h in history[-10:]]
    prompt = (
        f"You are an agricultural price analyst. "
        f"Given the following historical mandi prices for {crop_name}:\n"
        f"{', '.join(price_series)}\n\n"
        f"Predict the next realistic modal price in Indian Rupees (INR) per quintal. "
        f"Reply with ONLY a single integer number — no units, no explanation."
    )

    response   = model.generate_content(prompt)
    price_text = response.text.strip().replace(",", "").replace("₹", "")
    predicted  = float(price_text)

    return {"predicted_price": round(predicted, 2), "model_used": "gemini"}


# ─────────────────────────────────────────────
# 🔮 PREDICT ENDPOINT HANDLER
# ─────────────────────────────────────────────
def predict_crop_price(name: str, mandi_name: str | None = None) -> dict:
    """
    Full pipeline:
      1. Fetch price history
      2. Build ML input
      3. Encode + predict with XGBoost
      4. On any failure → Gemini fallback
    """
    normalized = normalize_crop_name(name)

    # --- 1. History ---
    history_data = get_crop_history(normalized)
    if not history_data or len(history_data.get("history", [])) < 2:
        print(f"[PREDICT] ⚠️ Insufficient history for '{normalized}'. Trying Gemini.")
        try:
            result = _gemini_predict(normalized, history_data["history"] if history_data else [])
            result["crop"] = normalized
            result["current_price"] = None
            return result
        except Exception as ge:
            print(f"[PREDICT] ❌ Gemini also failed: {ge}")
            return {
                "crop":            normalized,
                "current_price":   None,
                "predicted_price": None,
                "model_used":      "none",
                "error":           "Insufficient data and Gemini unavailable.",
            }

    history       = history_data["history"]
    current_price = history[-1]["price"]
    target_mandi  = mandi_name or normalized   # best-effort mandi name

    # --- 2. Build ML input ---
    ml_input = build_ml_input(normalized, target_mandi, history)
    if not ml_input:
        print(f"[PREDICT] ⚠️ Could not build ML input. Falling back to Gemini.")
        try:
            result = _gemini_predict(normalized, history)
            result.update({"crop": normalized, "current_price": current_price})
            return result
        except Exception as ge:
            print(f"[PREDICT] ❌ Gemini fallback failed: {ge}")
            return {
                "crop":            normalized,
                "current_price":   current_price,
                "predicted_price": None,
                "model_used":      "none",
                "error":           "ML input build failed and Gemini unavailable.",
            }

    # --- 3. Try XGBoost ---
    model, model_label = _pick_model(normalized)

    if model and ENCODERS:
        try:
            predicted = _encode_and_predict(ml_input, model, ENCODERS)
            print(f"[PREDICT] ✅ {model_label} predicted ₹{predicted} for '{normalized}'")
            return {
                "crop":            normalized,
                "current_price":   current_price,
                "predicted_price": predicted,
                "model_used":      model_label,
            }
        except Exception as me:
            print(f"[PREDICT] ⚠️ XGBoost failed ({me}). Falling back to Gemini.")
    else:
        print("[PREDICT] ⚠️ No ML model / encoders loaded. Falling back to Gemini.")

    # --- 4. Gemini fallback ---
    try:
        result = _gemini_predict(normalized, history)
        result.update({"crop": normalized, "current_price": current_price})
        return result
    except Exception as ge:
        print(f"[PREDICT] ❌ Gemini fallback also failed: {ge}")
        return {
            "crop":            normalized,
            "current_price":   current_price,
            "predicted_price": None,
            "model_used":      "none",
            "error":           f"ML failed and Gemini unavailable: {ge}",
        }


# ─────────────────────────────────────────────
# 🔍 CROP DETAILS (mandis + best mandi)
# ─────────────────────────────────────────────
def get_crop_details(name: str) -> dict | None:
    crop_res = supabase.table("crops").select("*").eq("name", name).execute()
    if not crop_res.data:
        return None

    crop_id = crop_res.data[0]["id"]

    price_res = (
        supabase.table("crop_prices")
        .select("price, mandis(name)")
        .eq("crop_id", crop_id)
        .execute()
    )

    mandis = [
        {"name": r["mandis"]["name"], "price": r["price"]}
        for r in price_res.data
    ]

    if not mandis:
        return None

    best = max(mandis, key=lambda x: x["price"])
    return {"crop": name, "mandis": mandis, "best_mandi": best}


# ─────────────────────────────────────────────
# 🔍 GET SINGLE CROP WITH PRICES & MANDIS
# ─────────────────────────────────────────────
def get_crop_by_name(name: str) -> dict | None:
    print(f"[CROP] ▶ Looking up crop: '{name}'")
    normalized_name = normalize_crop_name(name)
    print(f"[CROP] Normalized to: '{normalized_name}'")

    try:
        crop_res = (
            supabase.table("crops")
            .select("*")
            .ilike("name", f"%{normalized_name}%")
            .execute()
        )
    except Exception as e:
        print(f"[CROP] ❌ Failed to query crops table: {e}")
        return None

    if not crop_res.data:
        print(f"[CROP] ⚠️ No crop found matching '{normalized_name}'")
        return None

    crop    = crop_res.data[0]
    crop_id = crop["id"]

    try:
        prices_res = (
            supabase.table("crop_prices")
            .select("price, arrival_date, mandi_id, mandis(name, state, district)")
            .eq("crop_id", crop_id)
            .order("arrival_date", desc=True)
            .limit(100)
            .execute()
        )
    except Exception as e:
        print(f"[CROP] ❌ Failed to query crop_prices: {e}")
        return {"id": crop_id, "name": crop["name"], "prices": [], "best_mandi": None}

    prices     = prices_res.data or []
    best_mandi = None

    if prices:
        try:
            best_entry = max(prices, key=lambda x: x["price"])
            best_mandi = {
                "name":     best_entry["mandis"]["name"],
                "state":    best_entry["mandis"]["state"],
                "district": best_entry["mandis"]["district"],
                "price":    best_entry["price"],
            }
        except Exception as e:
            print(f"[CROP] ⚠️ Could not determine best mandi: {e}")

    return {
        "id":         crop_id,
        "name":       crop["name"],
        "prices":     prices,
        "best_mandi": best_mandi,
    }
