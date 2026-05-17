"""
upload_images.py
Upload all PNG images in the current directory to Supabase Storage.

Requirements:
    pip install supabase python-dotenv

Environment variables (.env or shell):
    SUPABASE_URL
    SUPABASE_SERVICE_KEY
"""

import os
import glob
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
BUCKET = "question-images"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Create bucket if it doesn't exist, make it public
try:
    supabase.storage.create_bucket(BUCKET, options={"public": True})
except Exception:
    # Bucket already exists — ensure it's public
    supabase.storage.update_bucket(BUCKET, options={"public": True})

png_files = glob.glob("*.png")

if not png_files:
    print("No PNG files found in current directory.")
    raise SystemExit(0)

uploaded = 0

for filepath in sorted(png_files):
    filename = os.path.basename(filepath)
    with open(filepath, "rb") as f:
        data = f.read()

    supabase.storage.from_(BUCKET).upload(
        path=filename,
        file=data,
        file_options={"content-type": "image/png", "upsert": "true"},
    )

    print(f"Uploaded: {filename}")
    uploaded += 1

print(f"\n{uploaded} images uploaded")
