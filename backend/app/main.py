from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.predict import router as predict_router
from app.api.history import router as history_router
from app.api.delete import router as delete_router
from app.api.gallery import router as gallery_router
from app.api.prediction_details import router as prediction_details_router

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

# Include all routers
app.include_router(predict_router)
app.include_router(history_router)
app.include_router(delete_router)
app.include_router(gallery_router)
app.include_router(prediction_details_router)