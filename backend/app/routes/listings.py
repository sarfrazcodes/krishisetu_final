from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db.supabase_client import supabase
from app.dependencies import get_current_user

router = APIRouter(prefix="/listings", tags=["Listings"])

class ListingCreate(BaseModel):
    crop: str
    quantity: str
    price: str
    location: str

@router.post("")
def create_listing(listing: ListingCreate, user=Depends(get_current_user)):
    try:
        data = {
            "user_id": user.id,
            "crop": listing.crop,
            "quantity": listing.quantity,
            "price": listing.price,
            "location": listing.location,
            "status": "Available" # Default status
        }
        res = supabase.table("listings").insert(data).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return {"message": "Listing created successfully", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def get_all_listings():
    try:
        # Join with users table to get farmer's name
        res = supabase.table("listings").select("*, users(name)").order("created_at", desc=True).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-listings")
def get_my_listings(user=Depends(get_current_user)):
    try:
        res = supabase.table("listings").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
