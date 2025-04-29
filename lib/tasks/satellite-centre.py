#!/usr/bin/env python3
"""
Stitch a 25 × 25 grid of Apple-MapKit satellite tiles into one JPG.
Requires Pillow  (# pip install pillow) and requests  (# pip install requests)
Credit: o3
Instructions:
  Open https://maps.apple.com, zoom in to the desired location, and
  open devtools. Check the Network tab and filter for "tile". Click one
  and grab the `accessKey` from the URL. Paste it into the ACCESS_KEY variable.
  Adjust the START_X, START_Y etc as needed.
  The script will download a 25 × 25 grid of tiles, with the center tile
  at the specified coordinates. The tiles are stitched together and saved
  as a single JPG file.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
import requests
from PIL import Image

# --- CONFIG –-----------------------------------------------------------------
ACCESS_KEY = (
    "1745861421_2822378241441420508_%2F_r9UxesyZ%2FWVHApPXqreti1qLhshvow2gXJL%2B2xxVd6k%3D"
)
Z         = 19          # zoom
START_X   = 148822      # central tile x
START_Y   = 196914      # central tile y
STEP      = 1           # jump this many tile-indices per step
COUNT     = 25          # tiles per axis  →  total grid = COUNT × COUNT
TILE_PX   = 512         # Apple “size=2” → 512-px tiles
OUT_FILE  = Path("stitched.jpg")
THREADS   = 8           # parallel downloads; keep it polite
TIMEOUT   = 10

BASE = (
    "https://sat-cdn.apple-mapkit.com/tile?"
    "style=7&size=2&scale=1&z={z}&x={x}&y={y}&v=10061&accessKey={key}"
)
# -----------------------------------------------------------------------------

def url_for(x: int, y: int) -> str:
    return BASE.format(z=Z, x=x, y=y, key=ACCESS_KEY)

def fetch_tile(coord):
    """Download a single tile and return (row, col, Image)."""
    row, col, x, y = coord
    try:
        r = requests.get(url_for(x, y), timeout=TIMEOUT)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content)).convert("RGB")
        if img.size != (TILE_PX, TILE_PX):
            raise ValueError(f"Unexpected tile size {img.size} at {x=}, {y=}")
        return row, col, img
    except Exception as exc:
        raise RuntimeError(f"Failed on {x=}, {y=}: {exc}") from exc

def main():
    half = COUNT // 2
    coords = [
        (row, col,
         START_X + (col - half) * STEP,
         START_Y + (row - half) * STEP)
        for row in range(COUNT)
        for col in range(COUNT)
    ]

    stitched = Image.new("RGB", (TILE_PX * COUNT, TILE_PX * COUNT))
    with ThreadPoolExecutor(max_workers=THREADS) as pool:
        for fut in as_completed(pool.submit(fetch_tile, c) for c in coords):
            row, col, tile = fut.result()   # will raise if fetch failed
            stitched.paste(tile, (col * TILE_PX, row * TILE_PX))

    stitched.save(OUT_FILE, "JPEG", quality=92)
    print(f"✓ Saved {OUT_FILE.resolve()}  ({stitched.size[0]} × {stitched.size[1]} px)")

if __name__ == "__main__":
    main()
