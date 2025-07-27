#  File: utils/yolo_cropper.py

from ultralytics import YOLO
from PIL import Image
import numpy as np

# Load YOLO model once (tiny version for performance)
model = YOLO("yolov8n.pt")  # or yolov5s.pt if using v5

def detect_and_crop_yolo(pil_image):
    try:
        results = model(pil_image, conf=0.4)
        if results and results[0].boxes:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            # Take the largest box (you can also take all boxes if needed)
            areas = [(x2 - x1) * (y2 - y1) for (x1, y1, x2, y2) in boxes]
            largest_idx = int(np.argmax(areas))
            x1, y1, x2, y2 = boxes[largest_idx]
            cropped = pil_image.crop((x1, y1, x2, y2))
            return cropped
    except Exception as e:
        print("YOLO cropping failed:", e)
    return pil_image  # Fallback to original if detection fails
