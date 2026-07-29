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
BRAND_VECTOR_SOURCE = BRAND_DIR / "b2w-icon.svg"

ICON_SOURCE = BRAND_DIR / "verification" / "b2w-icon.png"
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


def contain_square(image: Image.Image, size: int) -> Image.Image:
    scale = min(size / image.width, size / image.height)
    contained_width = max(1, round(image.width * scale))
    contained_height = max(1, round(image.height * scale))
    contained = image.resize((contained_width, contained_height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - contained.width) // 2
    y = (size - contained.height) // 2
    canvas.alpha_composite(contained, (x, y))
    return canvas


def save_png(image: Image.Image, path: Path) -> None:
    image.save(path, format="PNG")


def save_ico(image: Image.Image, path: Path) -> None:
    icon = contain_square(image, 256)
    icon.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def write_vector_favicon(path: Path) -> None:
    source = BRAND_VECTOR_SOURCE.read_text(encoding="utf-8")
    view_box_match = re.search(r'viewBox="([^"]+)"', source)
    path_match = re.search(r'<path\b[^>]*\bd="([^"]+)"', source)
    if not view_box_match or not path_match:
        raise RuntimeError(f"Could not read canonical SVG geometry from {BRAND_VECTOR_SOURCE}")

    view_box = view_box_match.group(1)
    vector_path = path_match.group(1)
    path.write_text(
        "\n".join(
            [
                f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}">',
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
        save_png(contain_square(icon, size), PUBLIC_DIR / filename)

    save_ico(icon, PUBLIC_DIR / "favicon.ico")
    if WORDMARK_SOURCE.exists():
        compose_social_card(WORDMARK_SOURCE, BRAND_DIR / "b2w-social-card.png", (760, 280), "#f7f3ec")
    else:
        print(f"Skipped B2W social card; source is not active: {WORDMARK_SOURCE.relative_to(ROOT)}")

    if CLARA_SOURCE.exists():
        compose_social_card(CLARA_SOURCE, BRAND_DIR / "clara-social-card.png", (320, 320), "#f5f6fb")
    else:
        print(f"Skipped Clara social card; source is not active: {CLARA_SOURCE.relative_to(ROOT)}")

    write_manifest(PUBLIC_DIR / "site.webmanifest")

    print("Synced marketing assets:")
    print(" - public/favicon.svg")
    for filename in sorted(FAVICON_OUTPUTS):
        print(f" - public/{filename}")
    print(" - public/favicon.ico")
    print(" - public/site.webmanifest")
    if WORDMARK_SOURCE.exists():
        print(" - public/brand/b2w-social-card.png")
    if CLARA_SOURCE.exists():
        print(" - public/brand/clara-social-card.png")


if __name__ == "__main__":
    main()
