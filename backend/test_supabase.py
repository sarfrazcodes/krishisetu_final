import asyncio
from app.db.supabase_client import supabase

def test():
    # Fetch latest prices for crops
    res = supabase.table("crop_prices").select("crop_id, price, arrival_date, crops(id, name)").order("arrival_date", desc=True).limit(1000).execute()
    
    latest_per_crop = {}
    for row in res.data:
        c_id = row["crop_id"]
        c_name = row["crops"]["name"] if row.get("crops") else "Unknown"
        # Since it's ordered by arrival_date desc, the first time we see a crop, it's its latest price
        if c_id not in latest_per_crop:
            latest_per_crop[c_id] = {
                "id": c_id,
                "name": c_name,
                "avg_price": row["price"], # Or we can aggregate
                "latest_date": row["arrival_date"]
            }
    
    print(list(latest_per_crop.values())[:5])

test()
