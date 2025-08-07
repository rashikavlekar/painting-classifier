from ultralytics import YOLO
from PIL import Image
import numpy as np

# ✅ Load your custom-trained YOLOv8 painting detector
model = YOLO(r"C:\Users\gcf17\Desktop\Internships\PSL\painting-classifier\backend\models\best.pt")  # <-- Use your fine-tuned weights path here

def detect_and_crop_yolo(image: Image.Image) -> Image.Image:
    results = model(image, conf=0.05)
    print(results[0].boxes)

    if not results or not results[0].boxes:
        raise ValueError("No paintings detected.")

    # Get all bounding boxes
    boxes = results[0].boxes.xyxy.cpu().numpy()
    print(results[0].boxes)  # Check what’s being detected


    # Choose the largest box by area
    largest_box = max(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))

    x1, y1, x2, y2 = map(int, largest_box)
    cropped_image = image.crop((x1, y1, x2, y2))

    return cropped_image
