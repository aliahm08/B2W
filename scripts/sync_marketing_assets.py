#!/usr/bin/env python3
"""
Generate the public favicon stack, social share cards, and web manifest from
the checked-in B2W brand assets.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
BRAND_DIR = PUBLIC_DIR / "brand"
BRAND_VECTOR_SOURCE = ROOT / "src" / "components" / "BrandVectorMarks.tsx"

ICON_SOURCE = BRAND_DIR / "b2w-icon.png"
WORDMARK_SOURCE = BRAND_DIR / "b2w-full-logo.png"
CLARA_SOURCE = BRAND_DIR / "clara-logo-solid.png"

FAVICON_OUTPUTS = {
    "favicon.png": 32,
    "favicon-96x96.png": 96,
    "apple-touch-icon.png": 180,
    "web-app-manifest-192x192.png": 192,
    "web-app-manifest-512x512.png": 512,
}

SITE_MANIFEST = {
    "name": "B2W",
    "short_name": "B2W",
    "description": "B2W consulting, Clara, and JasonAI.",
    "background_color": "#ffffff",
    "theme_color": "#ffffff",
    "display": "standalone",
    "icons": [
        {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
        },
        {
            "src": "/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
        },
    ],
}


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def resize_square(image: Image.Image, size: int) -> Image.Image:
    return image.resize((size, size), Image.Resampling.LANCZOS)


def save_png(image: Image.Image, path: Path) -> None:
    image.save(path, format="PNG")


def save_ico(image: Image.Image, path: Path) -> None:
    icon = image.resize((256, 256), Image.Resampling.LANCZOS)
    icon.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def write_vector_favicon(path: Path) -> None:
    source = BRAND_VECTOR_SOURCE.read_text(encoding="utf-8")
    match = re.search(r"const b2wTracePath = `([^`]+)`;", source)
    if not match:
        raise RuntimeError(f"Could not find b2wTracePath in {BRAND_VECTOR_SOURCE}")

    vector_path = match.group(1)
    path.write_text(
        "\n".join(
            [
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 88.4925">',
                "  <title>B2W marketing mark</title>",
                "  <style>",
                "    .mark { fill: #111111; }",
                "    @media (prefers-color-scheme: dark) { .mark { fill: #ffffff; } }",
                "  </style>",
                f'  <path class="mark" d="{vector_path}" fill-rule="evenodd" clip-rule="evenodd"/>',
                "</svg>",
                "",
            ]
        ),
        encoding="utf-8",
    )


def draw_card_frame(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((24, 24, 1176, 606), radius=30, outline="#d9d3ca", width=3)
    draw.line((56, 532, 1144, 532), fill="#e8e2d8", width=2)


def compose_social_card(logo_path: Path, output_path: Path, max_size: tuple[int, int], background: str) -> None:
    canvas = Image.new("RGBA", (1200, 630), background)
    draw_card_frame(canvas)

    logo = open_rgba(logo_path)
    logo.thumbnail(max_size, Image.Resampling.LANCZOS)

    x = (canvas.width - logo.width) // 2
    y = (canvas.height - logo.height) // 2 - 18
    canvas.alpha_composite(logo, (x, y))

    save_png(canvas, output_path)


def write_manifest(path: Path) -> None:
    path.write_text(json.dumps(SITE_MANIFEST, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    icon = open_rgba(ICON_SOURCE)
    write_vector_favicon(PUBLIC_DIR / "favicon.svg")

    for filename, size in FAVICON_OUTPUTS.items():
        save_png(resize_square(icon, size), PUBLIC_DIR / filename)

    save_ico(icon, PUBLIC_DIR / "favicon.ico")
    compose_social_card(WORDMARK_SOURCE, BRAND_DIR / "b2w-social-card.png", (760, 280), "#f7f3ec")
    compose_social_card(CLARA_SOURCE, BRAND_DIR / "clara-social-card.png", (320, 320), "#f5f6fb")
    write_manifest(PUBLIC_DIR / "site.webmanifest")

    print("Synced marketing assets:")
    print(" - public/favicon.svg")
    for filename in sorted(FAVICON_OUTPUTS):
        print(f" - public/{filename}")
    print(" - public/favicon.ico")
    print(" - public/site.webmanifest")
    print(" - public/brand/b2w-social-card.png")
    print(" - public/brand/clara-social-card.png")


if __name__ == "__main__":
    main()
