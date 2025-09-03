import os
from PIL import Image
from pathlib import Path
import shutil

# Paths
SOURCE_DIR = Path(r"C:\Users\gcf17\Downloads\art_dataset_combined_oil")
DEST_DIR = Path(r"C:\Users\gcf17\Downloads\art_dataset_preprocessed_new")

# Create destination folder structure
DEST_DIR.mkdir(parents=True, exist_ok=True)
 
# Optional Resize
TARGET_SIZE = (224, 224)  # Change if needed

# Allowed image extensions
valid_ext = [".jpg", ".jpeg", ".png", ".webp"]

# Process images
for root, _, files in os.walk(SOURCE_DIR):
    rel_path = Path(root).relative_to(SOURCE_DIR)
    dest_subfolder = DEST_DIR / rel_path
    dest_subfolder.mkdir(parents=True, exist_ok=True)

    for file in files:
        if any(file.lower().endswith(ext) for ext in valid_ext):
            src_file = Path(root) / file
            dest_file = dest_subfolder / file

            try:
                img = Image.open(src_file).convert("RGB")
                img = img.resize(TARGET_SIZE)
                img.save(dest_file)
            except Exception as e:
                print(f" Failed: {src_file} | {e}")

print(" All images preprocessed and saved to:", DEST_DIR)
