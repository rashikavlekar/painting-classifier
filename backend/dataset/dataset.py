import os
import shutil
from PIL import Image
from pathlib import Path
import torch
import clip
from tqdm import tqdm

# 🔍 Art style categories you want to classify
categories = {
    "classical": "a classical painting from the renaissance, baroque, or neoclassical period showing realistic human figures or historical themes",
    "modern": "a modern painting in the style of impressionism, cubism, surrealism, or expressionism with abstract or distorted forms",
    "portraits": "a portrait painting showing a human face or figure, either realistic or stylized",
    "landscapes": "a landscape painting of nature, mountains, rivers, gardens, or urban scenery",
    "abstract": "an abstract painting with no recognizable subject, using colors and shapes to express emotion"
}


# ✅ Define paths
dataset_paths = [
    r"C:\Users\gcf17\Downloads\Preprocessed wikiart",
    r"C:\Users\gcf17\Downloads\Painting Style Classification.v7i.folder",
    r"C:\Users\gcf17\Downloads\wiki art.v2i.folder"
]

TARGET_DIR = Path(r"C:\Users\gcf17\Downloads\art_dataset_combined_oil")
TARGET_DIR.mkdir(parents=True, exist_ok=True)
for cat in categories.keys():
    (TARGET_DIR / cat).mkdir(parents=True, exist_ok=True)

valid_ext = [".jpg", ".jpeg", ".png", ".webp"]

# Load CLIP
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"✅ Using device: {device.upper()} - {'GPU' if device == 'cuda' else 'CPU'}")

model, preprocess = clip.load("ViT-B/32", device=device)
text_prompts = torch.cat([clip.tokenize(desc) for desc in categories.values()]).to(device)

# Image classification and moving
def classify_and_move(image_path):
    try:
        image = preprocess(Image.open(image_path).convert("RGB")).unsqueeze(0).to(device)
        with torch.no_grad():
            image_features = model.encode_image(image)
            text_features = model.encode_text(text_prompts)
            probs = (image_features @ text_features.T).softmax(dim=-1)
            pred_idx = probs.argmax().item()

        predicted_label = list(categories.keys())[pred_idx]
        target_path = TARGET_DIR / predicted_label / os.path.basename(image_path)
        shutil.copy(image_path, target_path)
        return predicted_label
    except Exception as e:
        print(f" Failed to process: {image_path} | {e}")
        return None

# 🔄 Process all datasets
for base_path in dataset_paths:
    print(f"\n🔍 Scanning: {base_path}")
    for root, _, files in os.walk(base_path):
        for file in tqdm(files):
            if any(file.lower().endswith(ext) for ext in valid_ext):
                full_path = os.path.join(root, file)
                classify_and_move(full_path)

print("\n Done! All images categorized using CLIP and moved to:")
print(TARGET_DIR)
