from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output" / "gurge-jobsite-heroes-v2"
FRAMES = ROOT / "output" / "playwright" / "gurge-job-reporting-v2" / "frames"
BASES = ROOT / "output" / "gurge-jobsite-heroes"
PHONE_GENERATED = Path(
    "/Users/ali/.codex/generated_images/019ffbbb-bde3-7b11-838f-d0d763a071fd/"
    "exec-f3eb7247-355a-42b3-93b5-9b91f735594e.png"
)


def normalized_phone_base() -> Image.Image:
    """Center-crop the edited phone photograph to the 16:10 portfolio canvas."""
    image = Image.open(PHONE_GENERATED).convert("RGB")
    target_ratio = 1.6
    crop_h = round(image.width / target_ratio)
    top = (image.height - crop_h) // 2
    image = image.crop((0, top, image.width, top + crop_h))
    return image.resize((1600, 1000), Image.Resampling.LANCZOS)


def perspective_coefficients(dest, src):
    """Return PIL perspective coefficients that map destination pixels to source pixels."""
    matrix = []
    vector = []
    for (x, y), (u, v) in zip(dest, src):
        matrix.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        vector.append(u)
        matrix.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        vector.append(v)
    return np.linalg.solve(np.asarray(matrix, dtype=float), np.asarray(vector, dtype=float))


def screen_mask(size, quad, feather=1.2):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(quad, fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


def place_screen(base: Image.Image, screen: Image.Image, quad, reflection=0.045) -> Image.Image:
    screen = screen.convert("RGB")
    src = [(0, 0), (screen.width - 1, 0), (screen.width - 1, screen.height - 1), (0, screen.height - 1)]
    coeffs = perspective_coefficients(quad, src)
    warped = screen.transform(base.size, Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)
    # Let a trace of the original glass and ambient light remain for photographic integration.
    integrated = Image.blend(warped, base, reflection)
    mask = screen_mask(base.size, quad)
    result = Image.composite(integrated, base, mask)

    # Subtle diagonal glare clipped to the display. It keeps the UI legible while avoiding a pasted-on look.
    glare = Image.new("RGBA", base.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glare)
    w, h = base.size
    gd.polygon([(w * .37, 0), (w * .58, 0), (w * .82, h), (w * .68, h)], fill=(255, 255, 255, 10))
    glare.putalpha(Image.composite(glare.getchannel("A"), Image.new("L", base.size, 0), mask))
    return Image.alpha_composite(result.convert("RGBA"), glare).convert("RGB")


def make_transition(images, hold=7, tween=4):
    frames = []
    durations = []
    for index, current in enumerate(images):
        nxt = images[(index + 1) % len(images)]
        frames.extend([current] * hold)
        durations.extend([130] * hold)
        for step in range(1, tween + 1):
            frames.append(Image.blend(current, nxt, step / (tween + 1)))
            durations.append(85)
    return frames, durations


def save_gif(images, path):
    # Portfolio-friendly canvas and an adaptive palette keep motion crisp without huge downloads.
    resized = [im.resize((1200, 750), Image.Resampling.LANCZOS) for im in images]
    motion, durations = make_transition(resized)
    motion[0].save(
        path,
        save_all=True,
        append_images=motion[1:],
        duration=durations,
        loop=0,
        disposal=2,
        optimize=True,
        colors=128,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    phone_base = normalized_phone_base()
    phone_base.save(OUT / "source-phone-clear-screen.png", optimize=True)

    specs = [
        {
            "slug": "01-desktop-main-dashboard",
            "base": Image.open(BASES / "01-gurge-desktop-jobsite-reporting-hero.png").convert("RGB"),
            "quad": [(605, 115), (1490, 105), (1494, 793), (605, 765)],
            "states": ["desktop-01-base.png", "desktop-02-update.png", "desktop-03-attention.png"],
        },
        {
            "slug": "02-tablet-job-tracker",
            "base": Image.open(BASES / "02-gurge-tablet-field-walkthrough-hero.png").convert("RGB"),
            "quad": [(587, 116), (1172, 124), (1055, 971), (500, 873)],
            "states": ["tablet-01-base.png", "tablet-02-review.png", "tablet-03-updated.png"],
        },
        {
            "slug": "03-mobile-job-reporting",
            "base": phone_base,
            "quad": [(427, 171), (713, 155), (845, 810), (545, 852)],
            "states": ["mobile-01-base.png", "mobile-02-photo.png", "mobile-03-success.png"],
        },
    ]

    for spec in specs:
        composites = [
            place_screen(spec["base"], Image.open(FRAMES / state), spec["quad"])
            for state in spec["states"]
        ]
        static_path = OUT / f'{spec["slug"]}-hero.png'
        composites[0].save(static_path, optimize=True)
        composites[0].save(OUT / f'{spec["slug"]}-hero.webp', "WEBP", quality=91, method=6)
        save_gif(composites, OUT / f'{spec["slug"]}-animated.gif')


if __name__ == "__main__":
    main()
