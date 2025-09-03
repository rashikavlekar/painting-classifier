# script: export_class_names.py
from torchvision import datasets
import json

DATASET_PATH = "models/art_dataset_preprocessed_new"  # <-- Same path used during training

# Extract classes
class_names = datasets.ImageFolder(DATASET_PATH).classes

# Save to JSON
with open("models/class_names.json", "w") as f:
    json.dump(class_names, f)

print("✅ Class names saved:", class_names)
