query_list = [


"Pastport sized photos and selfies"

    ]





import time
import random
import requests
import hashlib
from pathlib import Path
from io import BytesIO
from duckduckgo_search import DDGS
from PIL import Image

# Function to get unique image hash
def get_image_hash(img):
    return hashlib.md5(img.tobytes()).hexdigest()

# Image Scraper
def scrape_images(query_list, root_folder="Non_Painting_dataset", max_per_query=200):
    root = Path(root_folder)
    seen_hashes = set()
    total_saved = 0

    with DDGS() as ddgs:
        for query in query_list:
            subfolder = root / query.replace(" ", "_")
            subfolder.mkdir(parents=True, exist_ok=True)
            print(f"\n📥 Scraping: {query}")

            try:
                results = ddgs.images(query, max_results=max_per_query)
            except Exception as e:
                print(f"❌ Failed to get results for '{query}': {e}")
                continue

            count = 0
            for result in results:
                try:
                    url = result["image"]
                    response = requests.get(url, timeout=5)
                    img = Image.open(BytesIO(response.content)).convert("RGB")
                    img = img.resize((224, 224))
                    img_hash = get_image_hash(img)

                    if img_hash in seen_hashes:
                        continue
                    seen_hashes.add(img_hash)

                    img.save(subfolder / f"{query.replace(' ', '_')}_{count}.jpg")
                    count += 1
                    total_saved += 1

                    if count >= max_per_query:
                        break

                except Exception:
                    continue  # Skip errors silently

                time.sleep(random.uniform(0.1, 0.3))  # Be polite

            print(f"✅ Saved {count} images to {subfolder}")

    print(f"\n🎉 Total Unique Images Saved: {total_saved}")

# Call the function
scrape_images(query_list, root_folder="Non_Painting_dataset", max_per_query=200)
