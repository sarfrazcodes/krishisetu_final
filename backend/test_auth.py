import asyncio
from app.db.supabase_client import supabase

async def test_auth():
    print("Testing signup...")
    try:
        auth_res = supabase.auth.sign_up({
            "email": "test99@krishi.com",
            "password": "password123"
        })
        print("Signup raw response:", auth_res)
        
        user_id = auth_res.user.id
        print("Signup user ID:", user_id)
        
        db_res = supabase.table("users").insert({
            "id": user_id,
            "name": "Test User",
            "role": "farmer"
        }).execute()
        print("DB Insert response:", db_res)
        
    except Exception as e:
        print("Signup Error:", str(e))

    print("\nTesting login...")
    try:
        login_res = supabase.auth.sign_in_with_password({
            "email": "test99@krishi.com",
            "password": "password123"
        })
        print("Login response user id:", login_res.user.id)
    except Exception as e:
        print("Login Error:", str(e))

if __name__ == "__main__":
    asyncio.run(test_auth())
