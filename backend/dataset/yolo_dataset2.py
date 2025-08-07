import os
import shutil
from sklearn.model_selection import train_test_split

# Paths
image_dir = "painting_dataset2/images"
label_dir = "labels_new"
output_base = "dataset_labelled"
os.makedirs(f"{output_base}/images/train", exist_ok=True)
os.makedirs(f"{output_base}/images/val", exist_ok=True)
os.makedirs(f"{output_base}/labels/train", exist_ok=True)
os.makedirs(f"{output_base}/labels/val", exist_ok=True)

# Collect only labeled images
labeled_images = []
for label_file in os.listdir(label_dir):
    if label_file.endswith(".txt"):
        base = os.path.splitext(label_file)[0]
        for ext in [".jpg", ".png", ".jpeg"]:
            image_path = os.path.join(image_dir, base + ext)
            if os.path.exists(image_path):
                labeled_images.append(base + ext)
                break

# Split into train and val
train_imgs, val_imgs = train_test_split(labeled_images, test_size=0.2, random_state=42)

# Copy files
def copy_files(image_list, split):
    for img in image_list:
        name = os.path.splitext(img)[0]
        # Copy image
        shutil.copy(os.path.join(image_dir, img), f"{output_base}/images/{split}/{img}")
        # Copy label
        shutil.copy(os.path.join(label_dir, name + ".txt"), f"{output_base}/labels/{split}/{name}.txt")

copy_files(train_imgs, "train")
copy_files(val_imgs, "val")

print(f"✅ {len(train_imgs)} training and {len(val_imgs)} validation images prepared.")
