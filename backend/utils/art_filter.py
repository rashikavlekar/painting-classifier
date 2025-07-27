import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm

# ✅ Load model once
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = timm.create_model('resnet18', pretrained=False)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load("models/art_filter.pth", map_location=device))
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ✅ Main function
def is_art_image(image: Image.Image) -> bool:
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(img_tensor)
        probs = torch.softmax(output, dim=1)
        art_prob = probs[0][0].item()  # class 0 = art
    return art_prob > 0.6  # 🔧 Confidence threshold
