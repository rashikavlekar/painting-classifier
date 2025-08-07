from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.db.supabase import supabase

router = APIRouter()

# -------------------- GALLERY ROUTE --------------------
@router.get("/gallery/")
async def gallery(user_email: str):
    try:
        data = (
            supabase.table("predictions")
            .select("style, image_url, image_hash")
            .eq("user_email", user_email)
            .order("timestamp", desc=True)
            .execute()
            .data
        )

        grouped = {}
        seen_hashes = set()

        for item in data:
            style = item["style"]
            url = item["image_url"]
            image_hash = item.get("image_hash")

            if image_hash in seen_hashes:
                continue  # ✅ skip duplicate content

            if style not in grouped:
                grouped[style] = []

            grouped[style].append(url)
            seen_hashes.add(image_hash)

        return grouped

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)