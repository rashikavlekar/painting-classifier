from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.db.supabase import supabase

router = APIRouter()

# -------------------- HISTORY ROUTE --------------------
@router.get("/history/")
async def get_history(user_email: str):
    try:
        response = supabase.table("predictions")\
                           .select("*")\
                           .eq("user_email", user_email)\
                           .order("timestamp", desc=True)\
                           .execute()
        
        print("History Data:", response.data)  # Log on backend

        return response.data
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)