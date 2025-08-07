from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import os
from app.db.supabase import supabase

router = APIRouter()

# -------------------- DELETE PREDICTION ROUTE --------------------
@router.delete("/delete/")
async def delete_prediction(prediction_id: str = Query(...)):
    try:
        result = supabase.table("predictions")\
            .select("id, storage_path")\
            .eq("id", prediction_id)\
            .execute()

        if not result.data or len(result.data) == 0:
            return JSONResponse(content={"error": "Prediction not found"}, status_code=404)

        record = result.data[0]
        storage_path = record.get("storage_path")

        # Delete the image from storage if the path exists
        if storage_path:
            bucket = os.getenv("SUPABASE_BUCKET")
            supabase.storage.from_(bucket).remove(storage_path)

        # Delete the DB entry
        supabase.table("predictions").delete().eq("id", prediction_id).execute()

        return {"message": "Deleted from DB and storage ✅"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)