from dotenv import load_dotenv
import torch

load_dotenv()

# -------------------- CONFIG --------------------
MODEL_PATH = "models/best_model (1).pth"
CLASS_NAMES_PATH = "app/core/class_names.json"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")