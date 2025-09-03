import os
import shutil
from pathlib import Path

# 🔁 Update this path to the main folder containing all nested folders
BASE_DIR = Path(r"C:\Users\gcf17\Desktop\Internships\PSL\painting-classifier\backend\Non_Painting_dataset")  # <-- change this

# 🔍 Valid image extensions
valid_ext = [".jpg", ".jpeg", ".png", ".webp"]

# ✅ Create a flat folder if needed (optional)
FLAT_DIR = BASE_DIR / "flattened5"
FLAT_DIR.mkdir(exist_ok=True)

# 🔄 Walk through all subfolders and move images
moved_count = 0
for root, _, files in os.walk(BASE_DIR):
    for file in files:
        if any(file.lower().endswith(ext) for ext in valid_ext):
            src_path = Path(root) / file
            dst_path = FLAT_DIR / file

            # Handle duplicate filenames
            counter = 1
            while dst_path.exists():
                dst_path = FLAT_DIR / f"{dst_path.stem}_{counter}{dst_path.suffix}"
                counter += 1

            try:
                shutil.move(str(src_path), str(dst_path))
                moved_count += 1
            except Exception as e:
                print(f" Failed to move {src_path}: {e}")

print(f"\n Moved {moved_count} images to: {FLAT_DIR}")
