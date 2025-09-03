from backend.db import supabase
import uuid
import os 
def save_prediction(user_email, style, image_url, timestamp, confidence, description, storage_path, image_hash):
    # Ensure user exists
    user = supabase.table("users").select("*").eq("email", user_email).execute()
    if not user.data:
        supabase.table("users").insert({"email": user_email}).execute()

    # Save prediction
    supabase.table("predictions").insert({
        "user_email": user_email,
        "style": style,
        "image_url": image_url,
        "timestamp": timestamp,
        "confidence": confidence,
        "description": description,
        "storage_path": storage_path,
        "image_hash": image_hash
    }).execute()

def upload_image_to_storage(file_bytes, filename):
    bucket = os.getenv("SUPABASE_BUCKET")
    unique_name = f"{uuid.uuid4()}_{filename}"
    supabase.storage.from_(bucket).upload(unique_name, file_bytes)
    public_url = supabase.storage.from_(bucket).get_public_url(unique_name)
    return public_url, unique_name  # ⬅️ return both

