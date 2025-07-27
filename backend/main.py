from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms, datasets
import torch
import torch.nn as nn
from PIL import Image
import timm
import os
import io
import base64
from datetime import datetime
from fastapi import Query
from urllib.parse import urlparse
from utils.supabase_helpers import upload_image_to_storage, save_prediction
from db import supabase
from utils.yolo_cropper import detect_and_crop_yolo
from utils.clip_filter import is_art_clip  # New: CLIP-based filtering
from utils.image_helpers import get_image_hash
from utils.gemini_description import generate_dynamic_description
from dotenv import load_dotenv
load_dotenv()



# -------------------- CONFIG --------------------
MODEL_PATH = "models/best_model (1).pth"
DATASET_PATH = "models/art_dataset_preprocessed_new"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------- LOAD CLASSES --------------------
assert os.path.exists(DATASET_PATH), "Dataset path incorrect!"
class_names = datasets.ImageFolder(DATASET_PATH).classes
num_classes = len(class_names)

# -------------------- LOAD MODEL --------------------
model = timm.create_model('efficientnet_b3', pretrained=False)
model.classifier = nn.Linear(model.classifier.in_features, num_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# -------------------- TRANSFORMS --------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# -------------------- FASTAPI INIT --------------------
app = FastAPI(title="🎨 Painting Style Classifier API")

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STYLE DESCRIPTIONS --------------------



# -------------------- INFERENCE ROUTE --------------------
@app.post("/predict/")
async def predict(file: UploadFile = File(...), user_email: str = "guest@example.com"):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if image.mode != "RGB":
            image = image.convert("RGB")

        # ✅ Try YOLO cropping (optional fallback)
        try:
            image = detect_and_crop_yolo(image)
        except Exception as e:
            print("[YOLO WARNING]", e)

        # ✅ Check if the image is art using CLIP
        if not is_art_clip(image):
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
        image_url, storage_path = upload_image_to_storage(contents, file.filename)
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

# -------------------- HISTORY ROUTE --------------------
@app.get("/history/")
async def get_history(user_email: str):
    try:
        response = supabase.table("predictions").select("*").eq("user_email", user_email).order("timestamp", desc=True).execute()
        return response.data
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)









# -------------------- DELETE PREDICTION ROUTE --------------------
@app.delete("/delete/")
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




# -------------------- GALLERY ROUTE --------------------
@app.get("/gallery/")
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

