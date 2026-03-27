from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db.supabase_client import supabase
from app.dependencies import get_current_user

router = APIRouter(prefix="/requests", tags=["Requests"])

class RequestCreate(BaseModel):
    crop: str
    quantity: str
    price: str
    location: str

@router.post("")
def create_request(req: RequestCreate, user=Depends(get_current_user)):
    try:
        data = {
            "user_id": user.id,
            "crop": req.crop,
            "quantity": req.quantity,
            "price": req.price,
            "location": req.location
        }
        res = supabase.table("requests").insert(data).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return {"message": "Request created successfully", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def get_all_requests():
    try:
        res = supabase.table("requests").select("*, users(name)").order("created_at", desc=True).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-requests")
def get_my_requests(user=Depends(get_current_user)):
    try:
        res = supabase.table("requests").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
