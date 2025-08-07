# utils/image_helpers.py
from PIL import Image
import imagehash

def get_image_hash(image: Image.Image) -> str:
    """
    Returns a perceptual hash of the image as a string.
    """
    return str(imagehash.average_hash(image))  # You can also try phash or dhash
