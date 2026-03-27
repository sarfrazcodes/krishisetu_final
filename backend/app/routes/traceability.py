from fastapi import APIRouter, HTTPException
from app.db.supabase_client import supabase

router = APIRouter(prefix="/traceability", tags=["Traceability"])

@router.get("")
def get_traceability():
    try:
        res = supabase.table("traceability").select("*").order("date", desc=True).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
