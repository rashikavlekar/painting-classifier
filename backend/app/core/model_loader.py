import torch
import torch.nn as nn
import timm
from torchvision import transforms
import json
from app.core.config import MODEL_PATH, CLASS_NAMES_PATH, device

# -------------------- LOAD CLASSES --------------------
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

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