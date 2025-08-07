import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)

# Split into art and non-art
ART_PROMPTS = [
    "modern paintings",
    "classical paintings",
    "abstract paintings",
    "watercolor artwork",
    "cartoons",
    "cartoon paintings",
    "caricature artwork",
    "anime",
    "sketches",
    "landscapes paintings",
    "portraits"
]

NON_ART_PROMPTS = [
    "a selfie",
    "a passport photo",
    "a photograph of a real person",
    "a mobile photo",
    "a professional headshot",
    "a real life scene",
    "a document",
    "photographs of objects"
]


@torch.no_grad()
def is_art_clip(image: Image.Image) -> bool:
    image_input = preprocess(image).unsqueeze(0).to(device)
    
    art_tokens = clip.tokenize(ART_PROMPTS).to(device)
    non_art_tokens = clip.tokenize(NON_ART_PROMPTS).to(device)

    image_features = clip_model.encode_image(image_input)
    image_features /= image_features.norm(dim=-1, keepdim=True)

    art_features = clip_model.encode_text(art_tokens)
    non_art_features = clip_model.encode_text(non_art_tokens)
    art_features /= art_features.norm(dim=-1, keepdim=True)
    non_art_features /= non_art_features.norm(dim=-1, keepdim=True)

    art_sim = (image_features @ art_features.T).squeeze(0).max().item()
    non_art_sim = (image_features @ non_art_features.T).squeeze(0).max().item()

    art_sim_round = round(art_sim, 2)
    non_art_sim_round = round(non_art_sim, 2)

    print(f"[CLIP DEBUG] Art: {art_sim_round:.2f}, Non-Art: {non_art_sim_round:.2f}")

    if art_sim_round >= non_art_sim_round:
        return True
    else:
        return False
