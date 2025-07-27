import google.generativeai as genai
import os
import base64
from PIL import Image
import io

# Set up API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")  # ✅ Vision model

def image_to_base64(image: Image.Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def generate_dynamic_description(image: Image.Image, style: str) -> str:
    image_b64 = image_to_base64(image)

    prompt = f"""
    You are an experienced art curator. Please analyze and describe the uploaded painting in a human, poetic tone.

    The painting is in the "{style}" style. Consider the color composition, emotional depth, and possible narrative.

    Your output should be thoughtful, elegant, and rich with interpretation. Limit to 200 words.
    """

    try:
        response = model.generate_content([
            {
                "mime_type": "image/jpeg",
                "data": image_b64
            },
            prompt
        ])
        return response.text.strip()
    except Exception as e:
        print("[Gemini Vision Error]", e)
        return f"This {style} painting showcases unique visual qualities that provoke emotion and insight."
