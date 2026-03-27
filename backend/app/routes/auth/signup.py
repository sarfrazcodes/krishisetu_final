from fastapi import APIRouter
from pydantic import BaseModel
from app.db.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["Auth"])

class SignupRequest(BaseModel):
    name: str
    phone: str
    password: str
    role: str  # farmer or buyer


@router.post("/signup")
def signup(data: SignupRequest):
    fake_email = f"{data.phone}@krishi.com"

    try:
        # 1. create user in auth
        auth_res = supabase.auth.sign_up({
            "email": fake_email,
            "password": data.password
        })

        if auth_res.user is None:
            return {"error": "Signup failed"}

        user_id = auth_res.user.id

        # 2. insert into users table
        try:
            supabase.table("users").insert({
                "id": user_id,
                "name": data.name,
                "role": data.role
            }).execute()
        except Exception as db_err:
            # Check for unique constraint violation
            error_msg = str(db_err).lower()
            if "duplicate key" in error_msg or "already exists" in error_msg:
                return {"error": "Phone number is already registered."}
            return {"error": str(db_err)}

        return {"message": "User created successfully"}

    except Exception as e:
        error_str = str(e)
        if "already registered" in error_str.lower() or "security purposes" in error_str.lower() or "duplicate key" in error_str.lower():
            return {"error": "User with this phone number already exists."}
        return {"error": error_str}