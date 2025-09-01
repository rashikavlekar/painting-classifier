# app/api/auth_proxy.py
from fastapi import APIRouter, Request, HTTPException
import os, base64, json, time
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from supabase import create_client

router = APIRouter()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE")  # Use a service role key on the backend
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# load private key once
PRIVATE_KEY_PEM = os.environ.get("AUTH_PRIVATE_KEY_PEM")  # store PEM string in env (secure store)
if not PRIVATE_KEY_PEM:
    raise Exception("Missing private key env var")

private_key = serialization.load_pem_private_key(
    PRIVATE_KEY_PEM.encode(), password=None
)

ALLOWED_DRIFT = 2 * 60 * 1000  # 2 minutes in ms

@router.post("/proxy-signin")
async def proxy_signin(payload: dict):
    ciphertext_b64 = payload.get("ciphertext")
    if not ciphertext_b64:
        raise HTTPException(status_code=400, detail="Missing ciphertext")

    try:
        ct = base64.b64decode(ciphertext_b64)
        plaintext = private_key.decrypt(
            ct,
            padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
        )
        data = json.loads(plaintext.decode())
        email = data["email"]
        password = data["password"]
        ts = int(data.get("ts", 0))
        nonce = data.get("nonce")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Decryption failed")

    # replay protection
    now_ms = int(time.time()*1000)
    if abs(now_ms - ts) > ALLOWED_DRIFT:
        raise HTTPException(status_code=400, detail="Timestamp drift too large")

    # TODO: track nonce server-side (Redis/db) to block reuse for reasonable TTL

    # Now call Supabase server-side (using service role or admin method)
    # Example: sign-in with email/password (server-side)
    try:
        # Supabase python client usage may vary; using REST via supabase.auth.admin or direct REST
        # Using REST approach to exchange credentials (or signIn endpoint)
        result = supabase.auth.sign_in_with_password({"email": email, "password": password})
        # result will contain session info if ok
        return result
    except Exception as e:
        # Map errors to HTTP responses
        raise HTTPException(status_code=400, detail=str(e))
