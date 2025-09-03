from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import torch
from PIL import Image
import io

app = FastAPI()

# ✅ Preload 3–4 style models at startup
style_models = {
    "mosaic": torch.hub.load('pytorch/examples', 'fast_neural_style', model_name='mosaic').eval(),
    "candy": torch.hub.load('pytorch/examples', 'fast_neural_style', model_name='candy').eval(),
    "udnie": torch.hub.load('pytorch/examples', 'fast_neural_style', model_name='udnie').eval(),
    "rain_princess": torch.hub.load('pytorch/examples', 'fast_neural_style', model_name='rain_princess').eval(),
}

@app.post("/style-transfer")
async def style_transfer(
    content_image: UploadFile = File(...),
    style: str = Form(...)
):
    if style not in style_models:
        return {"error": f"Invalid style. Available: {list(style_models.keys())}"}

    # Load content image
    content = Image.open(io.BytesIO(await content_image.read())).convert("RGB")

    # Transform to tensor
    import torchvision.transforms as transforms
    transform = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.ToTensor(),
        transforms.Lambda(lambda x: x.mul(255))
    ])
    content_tensor = transform(content).unsqueeze(0)

    # Apply style transfer
    with torch.no_grad():
        output_tensor = style_models[style](content_tensor).cpu()

    # Convert tensor back to image
    output_tensor = output_tensor.squeeze(0).clamp(0, 255) / 255
    to_pil = transforms.ToPILImage()
    output_image = to_pil(output_tensor)

    # Return as PNG
    buf = io.BytesIO()
    output_image.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
