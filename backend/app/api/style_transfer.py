# app/api/style_transfer.py
import os
import io
import uuid
import logging
from typing import Dict, Any

import torch
from torch import nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse



router = APIRouter()

# ------------------ Config ------------------
MODEL_DIR = "app/models/saved_models"  # Updated path to match your structure
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("style-transfer")

# ------------------ Net ------------------
class ConvLayer(nn.Module):
    def __init__(self, in_channels, out_channels, kernel_size, stride):
        super().__init__()
        pad = kernel_size // 2
        self.reflection_pad = nn.ReflectionPad2d(pad)
        self.conv2d = nn.Conv2d(in_channels, out_channels, kernel_size, stride)

    def forward(self, x):
        return self.conv2d(self.reflection_pad(x))

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = ConvLayer(channels, channels, 3, 1)
        self.in1 = nn.InstanceNorm2d(channels, affine=True, track_running_stats=False)
        self.conv2 = ConvLayer(channels, channels, 3, 1)
        self.in2 = nn.InstanceNorm2d(channels, affine=True, track_running_stats=False)

    def forward(self, x):
        residual = x
        y = F.relu(self.in1(self.conv1(x)))
        y = self.in2(self.conv2(y))
        return y + residual

class UpsampleConvLayer(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size, stride, upsample=None):
        super().__init__()
        self.upsample = upsample
        pad = kernel_size // 2
        self.reflection_pad = nn.ReflectionPad2d(pad)
        self.conv2d = nn.Conv2d(in_ch, out_ch, kernel_size, stride)

    def forward(self, x):
        if self.upsample:
            x = F.interpolate(x, scale_factor=self.upsample, mode="nearest")
        return self.conv2d(self.reflection_pad(x))

class TransformerNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = ConvLayer(3, 32, 9, 1)
        self.in1 = nn.InstanceNorm2d(32, affine=True, track_running_stats=False)
        self.conv2 = ConvLayer(32, 64, 3, 2)
        self.in2 = nn.InstanceNorm2d(64, affine=True, track_running_stats=False)
        self.conv3 = ConvLayer(64, 128, 3, 2)
        self.in3 = nn.InstanceNorm2d(128, affine=True, track_running_stats=False)
        self.res1 = ResidualBlock(128)
        self.res2 = ResidualBlock(128)
        self.res3 = ResidualBlock(128)
        self.res4 = ResidualBlock(128)
        self.res5 = ResidualBlock(128)
        self.deconv1 = UpsampleConvLayer(128, 64, 3, 1, upsample=2)
        self.in4 = nn.InstanceNorm2d(64, affine=True, track_running_stats=False)
        self.deconv2 = UpsampleConvLayer(64, 32, 3, 1, upsample=2)
        self.in5 = nn.InstanceNorm2d(32, affine=True, track_running_stats=False)
        self.deconv3 = ConvLayer(32, 3, 9, 1)

    def forward(self, x):
        y = F.relu(self.in1(self.conv1(x)))
        y = F.relu(self.in2(self.conv2(y)))
        y = F.relu(self.in3(self.conv3(y)))
        y = self.res1(y); y = self.res2(y); y = self.res3(y); y = self.res4(y); y = self.res5(y)
        y = F.relu(self.in4(self.deconv1(y)))
        y = F.relu(self.in5(self.deconv2(y)))
        y = self.deconv3(y)
        return y

# ------------------ Transforms ------------------
INPUT_TF = transforms.Compose([
    transforms.Resize(512),
    transforms.CenterCrop(512),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x * 255.0)
])

def tensor_to_pil(t: torch.Tensor) -> Image.Image:
    if t.dim() == 4:
        t = t[0]
    t = t.clamp(0.0, 255.0) / 255.0
    return transforms.ToPILImage()(t.cpu())

# ------------------ Model Loading ------------------
def _clean_state_dict(sd: Dict[str, Any]) -> Dict[str, Any]:
    for k in list(sd.keys()):
        if "running_mean" in k or "running_var" in k:
            sd.pop(k)
    return sd

def load_style_model(style_name: str) -> nn.Module:
    pth = os.path.join(MODEL_DIR, f"{style_name}.pth")
    if not os.path.exists(pth):
        raise FileNotFoundError(f"Model file not found: {pth}")
    sd = torch.load(pth, map_location=DEVICE)
    if isinstance(sd, dict) and "state_dict" in sd:
        sd = sd["state_dict"]
    sd = _clean_state_dict(sd)

    model = TransformerNet().to(DEVICE)
    model.load_state_dict(sd, strict=False)
    model.eval()
    return model

# ------------------ Cache ------------------
MODEL_CACHE: Dict[str, nn.Module] = {}

# ------------------ Endpoints ------------------
@router.get("/styles")
def list_styles():
    return [
        {
            "name": "candy",
            "display_name": "Candy",
            "description": "Vibrant candy-like colors",
        },
        {
            "name": "mosaic",
            "display_name": "Mosaic",
            "description": "Abstract mosaic patterns",
           
        },
        {
            "name": "udnie",
            "display_name": "Udnie",
            "description": "Cubist-inspired style",
         
        },
        {
            "name": "rain_princess",
            "display_name": "Rain Princess",
            "description": "Dreamy impressionist style",
          
        },
    ]


@router.post("/transfer-style/")
async def transfer_style(
    image: UploadFile = File(...),
    style_name: str = Form(...)
):
    try:
        # Load model (with caching)
        if style_name not in MODEL_CACHE:
            MODEL_CACHE[style_name] = load_style_model(style_name)
        model = MODEL_CACHE[style_name]

        # Process image
        img = Image.open(image.file).convert("RGB")
        content = INPUT_TF(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            output = model(content).clamp(0.0, 255.0)

        # Convert to PIL and return
        out_pil = tensor_to_pil(output)
        buf = io.BytesIO()
        out_pil.save(buf, format="JPEG", quality=95)
        buf.seek(0)
        
        filename = f"styled_{style_name}_{uuid.uuid4().hex[:8]}.jpg"
        return StreamingResponse(
            buf, 
            media_type="image/jpeg", 
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Style model not found: {style_name}")
    except Exception as e:
        log.exception("Style transfer failed")
        raise HTTPException(status_code=500, detail=f"Style transfer failed: {str(e)}")