from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import torch
from PIL import Image
import io
import base64
from datetime import datetime
from app.core.model_loader import model, transform, device, class_names
from app.utils.supabase_helpers import upload_image_to_storage, save_prediction
from app.utils.yolo_cropper import detect_and_crop_yolo
from app.utils.clip_filter import is_art_clip
from app.utils.image_helpers import get_image_hash
from app.utils.gemini_description import generate_dynamic_description

router = APIRouter()

# -------------------- INFERENCE ROUTE --------------------
@router.post("/predict/")
async def predict_image(
    file: UploadFile = File(...),
    user_email: str = Form(...)
):
    print("[DEBUG] Email received:", user_email)

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if image.mode != "RGB":
            image = image.convert("RGB")

        # ✅ Try YOLO cropping (optional fallback)
        try:
            image_before = image.copy()
            image = detect_and_crop_yolo(image)
            print("[YOLO] Cropping succeeded.")
        except Exception as e:
            print("[YOLO WARNING]", str(e))

        print("[CLIP] Running is_art_clip()")
        result = is_art_clip(image)
        print("[CLIP] Result:", result)

        # ✅ Check if the image is art using CLIP
        if not result:
            return JSONResponse(
                content={"message": "🚫 This image doesn't appear to be a painting or artwork."},
                status_code=400
            )

        # ✅ Model prediction
        input_tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1)[0]

        topk = torch.topk(probs, k=3)
        top_classes = [class_names[idx] for idx in topk.indices]
        top_scores = [round(score.item(), 4) for score in topk.values]

        prediction = top_classes[0]
        confidence = top_scores[0]

        # ✅ Description generation (with safe fallback)
        try:
            description = generate_dynamic_description(image, prediction)
        except Exception as e:
            print("[GEMINI ERROR]", str(e))
            description = "📝 Description generation failed. Showing basic classification only."

        # ✅ Upload and DB logging
        # Convert the (cropped) image to bytes for storage
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        cropped_bytes = buffered.getvalue()

        image_url, storage_path = upload_image_to_storage(cropped_bytes, file.filename)

        timestamp = datetime.utcnow().isoformat()
        image_hash = get_image_hash(image)

        save_prediction(
            user_email, prediction, image_url,
            timestamp, confidence, description,
            storage_path, image_hash
        )

        # ✅ Base64 for frontend preview
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # ✅ Construct full response
        response_data = {
            "filename": file.filename,
            "style": prediction,
            "confidence": confidence,
            "predictions": list(zip(top_classes, top_scores)),
            "image_url": image_url,
            "description": description,
            "base64_preview": img_str,
            "timestamp": timestamp
        }

        if confidence < 0.5:
            response_data["warning"] = "🤔 The style of this artwork couldn't be confidently identified."

        return JSONResponse(content=response_data)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)