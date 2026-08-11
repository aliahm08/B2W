#!/usr/bin/env python3
"""
Generate the public favicon stack, social share cards, and web manifest from
the checked-in B2W brand assets.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
BRAND_DIR = PUBLIC_DIR / "brand"
OFFICIAL_B2W_MARK_VECTOR = BRAND_DIR / "b2w-icon.svg"
OFFICIAL_B2W_MARK_SOURCE = BRAND_DIR / "verification" / "b2w-icon.png"
CLARA_SOURCE = BRAND_DIR / "clara-logo-solid.png"
ICON_SOURCE = OFFICIAL_B2W_MARK_SOURCE
MARKETING_ASSET_VERSION = "20260811.2"

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
    "description": "B2W practical AI products and JasonAI.",
    "background_color": "#f3f0e8",
    "theme_color": "#111315",
    "display": "standalone",
    "icons": [
        {
            "src": f"/web-app-manifest-192x192.png?v={MARKETING_ASSET_VERSION}",
            "sizes": "192x192",
            "type": "image/png",
        },
        {
            "src": f"/web-app-manifest-512x512.png?v={MARKETING_ASSET_VERSION}",
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
    path.write_text(OFFICIAL_B2W_MARK_VECTOR.read_text(encoding="utf-8"), encoding="utf-8")


def draw_card_frame(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((24, 24, 1176, 606), radius=30, outline="#d5d0c5", width=3)
    draw.line((56, 532, 1144, 532), fill="#ded8cc", width=2)


def compose_social_card(logo_path: Path, output_path: Path, max_size: tuple[int, int], background: str) -> None:
    canvas = Image.new("RGBA", (1200, 630), background)
    draw_card_frame(canvas)

    logo = open_rgba(logo_path)
    logo.thumbnail(max_size, Image.Resampling.LANCZOS)

    x = (canvas.width - logo.width) // 2
    y = (canvas.height - logo.height) // 2 - 18
    canvas.alpha_composite(logo, (x, y))

    save_png(canvas, output_path)


def load_brand_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size)
    except OSError:
        return ImageFont.load_default(size=size)


def compose_b2w_social_card(output_path: Path) -> None:
    canvas = Image.new("RGBA", (1200, 630), "#f3f0e8")
    draw = ImageDraw.Draw(canvas)
    draw_card_frame(canvas)
    draw.rounded_rectangle((58, 58, 1142, 506), radius=24, fill="#111315")

    mark = open_rgba(OFFICIAL_B2W_MARK_SOURCE)
    mark.thumbnail((240, 240), Image.Resampling.LANCZOS)
    mark_canvas = Image.new("RGBA", mark.size, (255, 255, 255, 0))
    white_mark = Image.new("RGBA", mark.size, "white")
    white_mark.putalpha(mark.getchannel("A"))
    mark_canvas.alpha_composite(white_mark)
    canvas.alpha_composite(mark_canvas, (155, 158))

    draw.text((455, 145), "B2W", font=load_brand_font(150), fill="white", stroke_width=0)
    draw.text((463, 330), "PRACTICAL AI FOR CONTRACTORS", font=load_brand_font(25), fill="#8fc2d7")
    draw.text((58, 552), "Turn business noise into work that moves.", font=load_brand_font(24), fill="#315f79")
    save_png(canvas, output_path)


def write_manifest(path: Path) -> None:
    path.write_text(json.dumps(SITE_MANIFEST, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    icon = open_rgba(ICON_SOURCE)
    write_vector_favicon(PUBLIC_DIR / "favicon.svg")

    save_png(contain_square(icon, 512), BRAND_DIR / "b2w-logo-512.png")

    for filename, size in FAVICON_OUTPUTS.items():
        save_png(contain_square(icon, size), PUBLIC_DIR / filename)

    save_ico(icon, PUBLIC_DIR / "favicon.ico")
    compose_b2w_social_card(BRAND_DIR / "b2w-social-card.png")

    if CLARA_SOURCE.exists():
        compose_social_card(CLARA_SOURCE, BRAND_DIR / "clara-social-card.png", (320, 320), "#f5f6fb")
    else:
        print(f"Skipped Clara social card; source is not active: {CLARA_SOURCE.relative_to(ROOT)}")

    write_manifest(PUBLIC_DIR / "site.webmanifest")

    print("Synced marketing assets:")
    print(" - public/favicon.svg")
    print(" - public/brand/b2w-logo-512.png")
    for filename in sorted(FAVICON_OUTPUTS):
        print(f" - public/{filename}")
    print(" - public/favicon.ico")
    print(" - public/site.webmanifest")
    print(" - public/brand/b2w-social-card.png")
    if CLARA_SOURCE.exists():
        print(" - public/brand/clara-social-card.png")


if __name__ == "__main__":
    main()
