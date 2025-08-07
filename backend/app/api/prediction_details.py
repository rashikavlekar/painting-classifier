from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from app.db.supabase import supabase

router = APIRouter()

@router.get("/prediction-details/")
async def get_prediction_details(
    prediction_id: str = Query(...),
    user_email: str = Query(...)
):
    try:
        # Fetch prediction and verify ownership
        response = supabase.table("predictions")\
            .select("*")\
            .eq("id", prediction_id)\
            .eq("user_email", user_email)\
            .single()\
            .execute()

        if not response.data:
            return JSONResponse(
                content={"error": "Prediction not found or access denied"},
                status_code=404
            )

        return response.data

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)