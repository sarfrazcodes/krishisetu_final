from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.voice_service import process_voice_intent

router = APIRouter(prefix="/voice", tags=["Voice AI"])

from typing import Optional

class VoiceRequest(BaseModel):
    text: str
    role: Optional[str] = "guest"
    pathname: Optional[str] = "/"
    page_content: Optional[str] = ""
    user_id: Optional[str] = None

class VoiceResponse(BaseModel):
    message: str
    action: str
    language: str
    route: Optional[str] = None

@router.post("", response_model=VoiceResponse)
@router.post("/", response_model=VoiceResponse)
def process_voice_command(request: VoiceRequest):
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    try:
        # 1-Shot Execution
        parsed = process_voice_intent(
            text=text, 
            role=request.role, 
            pathname=request.pathname, 
            page_content=request.page_content
        )
        
        # Real Database Execution Block
        if parsed.get("action") == "add_listing" and request.user_id:
            try:
                from app.db.supabase_client import supabase
                data_payload = {
                    "user_id": request.user_id,
                    "crop": parsed.get("crop", "Unknown"),
                    "quantity": str(parsed.get("quantity", "Unknown")),
                    "price": "To be discussed",
                    "location": "Farmer Network",
                    "status": "Available"
                }
                supabase.table("listings").insert(data_payload).execute()
            except Exception as db_e:
                print("Failed to save audio listing to DB:", db_e)
        
        return VoiceResponse(
            message=parsed.get("message", "Processing completed."),
            action=parsed.get("action", "unknown"),
            language=parsed.get("language", "Hindi"),
            route=parsed.get("route")
        )
        
    except Exception as e:
        print(f"[VOICE ROUTE] Exception: {e}")
        return VoiceResponse(
            message="Sorry, our AI is currently taking a moment. Please try again.",
            action="error",
            language="English",
            route=None
        )
