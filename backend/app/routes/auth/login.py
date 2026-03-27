from fastapi import APIRouter
from pydantic import BaseModel
from app.db.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    phone: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    fake_email = f"{data.phone}@krishi.com"

    try:
        res = supabase.auth.sign_in_with_password({
            "email": fake_email,
            "password": data.password
        })

        if res.user is None:
            return {"error": "Invalid credentials"}

        user_id = res.user.id

        # Fetch their role and name from the users table
        user_data = {}
        try:
            db_res = supabase.table("users").select("name, role").eq("id", user_id).execute()
            if db_res.data:
                user_data = db_res.data[0]
        except Exception as db_err:
            print(f"Error fetching user role: {db_err}")

        return {
            "access_token": res.session.access_token if res.session else None,
            "user": {
                "id": user_id,
                "phone": data.phone,
                "name": user_data.get("name"),
                "role": user_data.get("role")
            }
        }
    except Exception as e:
        error_str = str(e).lower()
        if "invalid" in error_str or "login credentials" in error_str:
            return {"error": "Invalid phone number or password."}
        return {"error": str(e)}