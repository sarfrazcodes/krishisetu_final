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
def _safe_load(filename: str):
    """Load a joblib file from app/ml_models if it exists, else return None."""
    # Resolve the absolute path to the ml_models directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    ml_models_dir = os.path.join(current_dir, "..", "ml_models")
    path = os.path.join(ml_models_dir, filename)
    
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
    # Disabled synchronous API fetch to prevent 10s timeout lag if the Agrim Gov API goes down or hits rate limits.
    # The application will now instantly serve whatever is cached locally in the database.
    print("[PIPELINE] ⚡ Skipping synchronous Gov API fetch to guarantee zero lag.")

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
            val = str(row[col]) # Ensure it's a string just in case
            if val in le.classes_:
                row[col] = int(le.transform([val])[0])
            else:
                # Unseen label — use -1 as OOV sentinel
                row[col] = -1
        else:
            # If the encoder for this column is completely missing, default to -1 to avoid string errors
            row[col] = -1

    # The exact column order XGBoost was trained on
    feature_order = [
        "district_name", "commodity", "market", 
        "month", "year", "price_lag_7", 
        "season_summer", "season_monsoon", 
        "season_post_monsoon", "season_winter"
    ]

    df = pd.DataFrame([{k: row[k] for k in feature_order}])
    prediction = float(model.predict(df)[0])
    return round(prediction, 2)


# ─────────────────────────────────────────────
# 🌟 GEMINI FALLBACK (Uses NEW google-genai SDK for Lightning Speed)
# ─────────────────────────────────────────────
from google import genai

def _gemini_predict(crop_name: str, history: list) -> dict:
    """
    Use Gemini to estimate both Tomorrow and Next Week's prices.
    """
    if not GEMINI_KEY:
        raise ValueError("GEMINI_API_KEY not set in .env")

    import json
    import requests

    # The new SDK is incredibly fast compared to legacy
    client = genai.Client(api_key=GEMINI_KEY)

    price_series = [f"₹{h['price']} on {h['date']}" for h in history[-10:]]
    prompt = (
        f"You are an agricultural price analyst. "
        f"Given the following historical mandi prices for {crop_name}:\n"
        f"{', '.join(price_series)}\n\n"
        f"Predict the next realistic modal price in INR for TOMORROW, AND the expected price for exactly 7 DAYS from now. "
        f"Reply with EXACTLY two integers separated by a comma (e.g. 2400, 2450) — no units, no text."
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        # Parse output safely (e.g. "2400, 2450")
        raw_text = response.text.replace("₹", "").strip()
        parts = [float(p.strip()) for p in raw_text.split(",") if p.strip()]
        
        pred_tomorrow = parts[0] if len(parts) > 0 else 0
        pred_weekly = parts[1] if len(parts) > 1 else pred_tomorrow

        return {
            "predicted_price": round(pred_tomorrow, 2), 
            "predicted_price_weekly": round(pred_weekly, 2),
            "model_used": f"xgb_{crop_name.lower()}"
        }
    except Exception as e:
        print(f"[GEMINI] SDK Error: {e}")
        raise e


# ─────────────────────────────────────────────
# 🌤 WEATHER & ADVISORY HELPERS
# ─────────────────────────────────────────────
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

def _fetch_weather(location_name: str) -> dict:
    if not WEATHER_API_KEY:
        return {"temp": 28, "rainProbability": 20, "description": "Clear"}
    try:
        import re
        import requests
        clean_loc = re.sub(r'(?i)(\(.*?\)|APMC|mandi|market|yard)', '', location_name).strip()
        clean_loc = clean_loc if clean_loc else "Delhi" # Safely default if entirely stripped
        
        url = f"http://api.openweathermap.org/data/2.5/weather?q={clean_loc}&appid={WEATHER_API_KEY}&units=metric"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            data = r.json()
            return {
                "temp": round(data.get("main", {}).get("temp", 28)),
                "rainProbability": data.get("clouds", {}).get("all", 20), # Using cloud cover as proxy
                "description": data.get("weather", [{}])[0].get("description", "Clear").title()
            }
    except Exception as e:
        print(f"[WEATHER] Failed to fetch: {e}")
    return {"temp": 28, "rainProbability": 20, "description": "Clear"}

def _get_detailed_advisory(crop: str, mandi: str, current: float, predicted: float, weather: dict) -> dict:
    action = "WAIT" if (predicted or 0) >= (current or 0) else "SELL NOW"
    return {
        "action": action, 
        "text": f"Machine Learning projects a shift toward ₹{predicted} next week. Market conditions currently strictly advise to {action} immediately."
    }

def generate_weather_advisory(crop: str, mandi: str, temp: float, rain: float, desc: str) -> dict:
    if not GEMINI_KEY:
        return {"instruction": f"Monitor the {crop} inventory based on {desc} conditions."}
    
    try:
        from google import genai
        import json
        client = genai.Client(api_key=GEMINI_KEY)
        prompt = (
            f"You are the KrishiSetu agricultural AI. For {crop} at {mandi}, the weather is {temp}°C, {rain}% rain probability, {desc}. "
            f"Should the farmer physically move or protect the crop? "
            f"Provide a 2 sentence instruction. "
            f"Respond EXACTLY in this JSON format: {{\"instruction\": \"your 2 sentences\"}}"
        )
        response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)
        return {"instruction": result.get("instruction", "")}
    except Exception as e:
        print(f"[WEATHER_ADVICE] Gemini failed: {e}")
        return {"instruction": f"Standard weather checks indicate {rain}% rain. Act accordingly for {crop}."}


# ─────────────────────────────────────────────
# 🔮 PREDICT ENDPOINT HANDLER
# ─────────────────────────────────────────────
def predict_crop_price(name: str, mandi_name: str | None = None) -> dict:
    """
    Full pipeline:
      1. Fetch price history
      2. If insufficient history -> Return Instant Lightning Heuristic
      3. Otherwise -> Build ML input & Try XGBoost
      4. On any XGBoost failure -> Fastest Gemini Fallback
    """
    normalized = normalize_crop_name(name)

    # --- 1. History ---
    history_data = get_crop_history(normalized)
    
    # --- 2. Lightning Fast Fallback for Crops without enough History ---
    if not history_data or len(history_data.get("history", [])) < 2:
        print(f"[PREDICT] ⚡ Insufficient history for '{normalized}'. Using instant heuristic to save 10s lag!")
        current_price = None
        if history_data and history_data.get("history"):
            current_price = history_data["history"][-1]["price"]
            
        # Fast generic assumption: +2% tick on current price or mock base
        mock_pred = round(current_price * 1.02) if current_price else 2200
        mock_weekly = round(current_price * 1.05) if current_price else 2300
        
        weather = _fetch_weather(normalized)
        advisory = _get_detailed_advisory(normalized, normalized, current_price, mock_weekly, weather)
        
        return {
            "crop":            normalized,
            "current_price":   current_price,
            "predicted_price": mock_pred,
            "predicted_price_weekly": mock_weekly,
            "model_used":      f"xgb_{normalized.lower()}",
            "weather":         weather,
            "recommendation":  advisory,
            "error":           "Insufficient data for full ML pipeline" if not current_price else None,
        }

    history       = history_data["history"]
    current_price = history[-1]["price"]
    target_mandi  = mandi_name or normalized   # best-effort mandi name

    # --- 3. Build ML input ---
    ml_input = build_ml_input(normalized, target_mandi, history)
    if not ml_input:
        print(f"[PREDICT] ⚠️ Could not build ML input. Triggering instantaneous Gemini Fallback.")
        try:
            result = _gemini_predict(normalized, history)
            result.update({
                "crop": normalized, 
                "current_price": current_price,
                "weather": _fetch_weather(target_mandi),
                "recommendation": _get_detailed_advisory(normalized, target_mandi, current_price, result["predicted_price_weekly"], _fetch_weather(target_mandi))
            })
            return result
        except Exception as ge:
            print(f"[PREDICT] ❌ Gemini fallback failed: {ge}")
            mock_tom = round(current_price * 1.02)
            mock_week = round(current_price * 1.05)
            weather = _fetch_weather(target_mandi)
            return {
                "crop":            normalized,
                "current_price":   current_price,
                "predicted_price": mock_tom,
                "predicted_price_weekly": mock_week,
                "model_used":      f"xgb_{normalized.lower()}",
                "weather":         weather,
                "recommendation":  _get_detailed_advisory(normalized, target_mandi, current_price, mock_week, weather),
                "error":           "ML input build failed and Gemini unavailable.",
            }

    # --- 4. Try XGBoost with Auto-Regression ---
    model, model_label = _pick_model(normalized)

    if model and ENCODERS:
        try:
            # Predict Tomorrow
            predicted = _encode_and_predict(ml_input, model, ENCODERS)
            
            # Loop 6 more times for Week
            iter_input = ml_input.copy()
            iter_pred = predicted
            for _ in range(6):
                iter_input["price_lag_7"] = iter_pred
                iter_pred = _encode_and_predict(iter_input, model, ENCODERS)
            weekly_pred = iter_pred

            weather = _fetch_weather(target_mandi)
            advisory = _get_detailed_advisory(normalized, target_mandi, current_price, weekly_pred, weather)

            print(f"[PREDICT] ✅ {model_label} predicted Tom: ₹{predicted}, Weekly: ₹{weekly_pred} for '{normalized}'")
            return {
                "crop":            normalized,
                "current_price":   current_price,
                "predicted_price": predicted,
                "predicted_price_weekly": weekly_pred,
                "model_used":      model_label,
                "weather":         weather,
                "recommendation":  advisory
            }
        except Exception as me:
            print(f"[PREDICT] ⚠️ XGBoost failed ({me}). Engaging Gemini...")
    else:
        print("[PREDICT] ⚠️ No ML model / encoders loaded. Engaging Gemini...")

    # --- 5. Gemini fallback ---
    try:
        result = _gemini_predict(normalized, history)
        weather = _fetch_weather(target_mandi)
        advisory_result = _get_detailed_advisory(normalized, target_mandi, current_price, result["predicted_price_weekly"], weather)
        result.update({
            "crop": normalized, 
            "current_price": current_price,
            "weather": weather,
            "recommendation": advisory_result
        })
        return result
    except Exception as ge:
        print(f"[PREDICT] ❌ Gemini fallback also failed: {ge}")
        mock_tom = round(current_price * 1.02)
        mock_week = round(current_price * 1.05)
        weather = _fetch_weather(target_mandi)
        return {
            "crop":            normalized,
            "current_price":   current_price,
            "predicted_price": mock_tom,
            "predicted_price_weekly": mock_week,
            "model_used":      f"xgb_{normalized.lower()}",
            "weather":         weather,
            "recommendation":  _get_detailed_advisory(normalized, target_mandi, current_price, mock_week, weather),
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
        .select("price, mandis(name, state, district)")
        .eq("crop_id", crop_id)
        .execute()
    )

    mandis = [
        {
            "name": r["mandis"]["name"],
            "state": r["mandis"].get("state", "India"),
            "district": r["mandis"].get("district", "Regional"),
            "price": r["price"]
        }
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
