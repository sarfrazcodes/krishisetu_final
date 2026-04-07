import os
import sys
import requests
from datetime import datetime, timedelta

# Update python path to load app modules correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.crop_service import API_KEY, RESOURCE_ID, BASE_URL, parse_date, normalize_crop_name, store_crop_data

def fetch_agrim_for_date(target_date_str: str) -> list | None:
    print(f"[BACKFILL] ▶ Fetching data for {target_date_str}...")

    if not API_KEY or not RESOURCE_ID:
        print("[BACKFILL] ❌ Missing API credentials.")
        return None

    try:
        url = f"{BASE_URL}/{RESOURCE_ID}"
        # We try to use the filters mechanism of data.gov.in
        params = {
            "api-key": API_KEY,
            "format": "json",
            "limit": 1000,
            "filters[arrival_date]": target_date_str
        }

        response = requests.get(url, params=params, timeout=20)
        
        if response.status_code != 200:
            print(f"[BACKFILL] ❌ Non-200 response: {response.text[:300]}")
            return None

        data = response.json()
        records = data.get("records", [])
        
        if not records:
            print(f"[BACKFILL] ⚠️ No records found for {target_date_str}.")
            return None

        crops = []
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
                    continue

                crops.append({
                    "name":         normalize_crop_name(raw_name),
                    "price":        int(float(str(raw_price).replace(",", ""))),
                    "market":       market,
                    "state":        state if state else "Unknown",
                    "district":     district if district else "Unknown",
                    "arrival_date": parsed_date,
                })
            except Exception as e:
                pass
                
        print(f"[BACKFILL] ✅ Successfully parsed {len(crops)} crops for {target_date_str}.")
        return crops

    except Exception as e:
        print(f"[BACKFILL] ❌ Request failed: {e}")
        return None

def main():
    start_date = datetime(2025, 3, 26)
    end_date = datetime(2025, 4, 6)
    
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%d/%m/%Y")
        crops_data = fetch_agrim_for_date(date_str)
        if crops_data:
            store_crop_data(crops_data)
        current_date += timedelta(days=1)
        
if __name__ == "__main__":
    main()
