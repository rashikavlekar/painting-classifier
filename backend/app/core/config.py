import os
from dotenv import load_dotenv
import torch

load_dotenv()

# -------------------- CONFIG --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # /backend/app/core
MODEL_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", "models", "best_model.pth"))
CLASS_NAMES_PATH = os.path.normpath(os.path.join(BASE_DIR, "class_names.json"))

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
