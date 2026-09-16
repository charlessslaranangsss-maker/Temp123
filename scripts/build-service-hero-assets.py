"""Build responsive WebP derivatives for the verified service hero registry."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
METADATA_PATH = ROOT / "work" / "drive-asset-inventory" / "image-metadata.json"
NEW_IMAGE_ROOT = ROOT / "work" / "drive-asset-inventory" / "new"
OUTPUT_ROOT = ROOT / "public" / "images" / "service-heroes"

# Only exact-model, non-duplicate, non-ambiguous inventory rows are listed.
# Each tuple is (Drive inventory folder, visual index, output slug).
ASSETS = {
    "24ft-mobile-kitchen": ("24ft Mobile Kitchen", [4, 1, 5, 3, 2]),
    "28ft-mobile-kitchen": ("28ft Mobile Kitchen", [5, 2, 6, 4, 1, 3, 9]),
    "38ft-mobile-kitchen": ("38ft Mobile Kitchen", [2, 1]),
    "40ft-mobile-kitchen": ("40ft Mobile Kitchen", [5, 3, 4, 6, 7, 8, 9, 10, 1, 2]),
    "40ft-combination-kitchen": ("40ft Mobile Combo Kitchen", [9, 1, 2, 5, 4, 6, 7, 8, 10]),
    "40ft-bulk-kitchen": ("40ft Bulk Kitchen", [14, 5, 3, 12, 8, 13, 6, 9, 11, 10, 2, 1, 7, 4]),
    "40ft-bulk-combination-kitchen": ("40ft Bulk Combo Kitchen", [6, 3, 5, 1, 4, 7]),
    "22-26ft-low-temp-dish": ("22-26ft Low Temp Dish Trailer", [8, 1, 3, 6, 5, 2, 7, 4]),
    "38ft-low-temp-dish": ("38ft Low Temp Dish Trailer", [1, 4, 2, 3]),
    "38ft-high-temp-dish": ("38ft High Temp Conveyor Dishwashing Trailer", [10, 9, 8, 7, 3, 1, 2, 4, 5, 6]),
    "20ft-refrigerated-trailer": ("20ft Refrigerated Trailer", [1, 2, 4, 3]),
    "13ft-shower-restroom-combination": (
        "13ft Luxury Shower-Restroom Combination",
        [7, 1],
    ),
    "22ft-shower-restroom-combination": (
        "22ft Luxury Shower-Restroom Combination",
        [1, 6, 7, 5, 4],
    ),
    "30ft-shower-restroom-combination": (
        "30ft Luxury Shower-Restroom Combination",
        [1],
    ),
    "20ft-shower-container": ("20ft Shower Container", [4, 2, 1, 3]),
    "30ft-laundry-trailer": ("30ft Laundry Trailer", [1]),
    "26-27ft-laundry-trailer": ("26-27ft Laundry Trailer", [1]),
    "20ft-laundry-container": ("20ft Laundry Container (nested child)", [3, 1, 2]),
    "water-tank": ("Water Tank", [2, 1, 3, 4, 5]),
}

# Newly supplied folders were downloaded after the original 115-file audit.
# They remain explicit here so every source file is accounted for without
# mutating the original evidence inventory.
NEW_ASSETS = {
    "20ft-shower-trailer-sink": [
        ("02-1ZSLojSpLoJEV92yLEv9NayqUlipOeetu.png", "1ZSLojSpLoJEV92yLEv9NayqUlipOeetu"),
        ("05-1roGL7xG7Z17OexW0hy2MHbMR8tNXXA2Z.png", "1roGL7xG7Z17OexW0hy2MHbMR8tNXXA2Z"),
        ("01-11oNTsbQSHlZAzkL8InhiidCttgBmR1Ba.png", "11oNTsbQSHlZAzkL8InhiidCttgBmR1Ba"),
        ("03-1aPclhaNoLuCP8h7U8mzRngIhveigA113.png", "1aPclhaNoLuCP8h7U8mzRngIhveigA113"),
        ("04-1yrIfrp5t5s5wuL68SLz5L2YM-_uQn3wg.png", "1yrIfrp5t5s5wuL68SLz5L2YM-_uQn3wg"),
    ],
    "handwashing-sink-trailer": [
        ("08-1rImzuG71XXGALTGed9faoJ8dX5069wSV.png", "1rImzuG71XXGALTGed9faoJ8dX5069wSV"),
        ("06-1pS_NNVjF11EaD4BvbAkeNmK0kvORa83R.png", "1pS_NNVjF11EaD4BvbAkeNmK0kvORa83R"),
        ("07-1kXodyplA7NjFtiHz1JE_WGtPKFkM4G5n.png", "1kXodyplA7NjFtiHz1JE_WGtPKFkM4G5n"),
    ],
}


def resized_dimensions(width: int, height: int, target_width: int) -> tuple[int, int]:
    output_width = min(width, target_width)
    output_height = round(height * output_width / width)
    return output_width, output_height


def main() -> None:
    metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
    by_key = {(row["folder"], row["visual_index"]): row for row in metadata}
    built = []

    for slug, (folder, indexes) in ASSETS.items():
        output_dir = OUTPUT_ROOT / slug
        output_dir.mkdir(parents=True, exist_ok=True)

        for position, visual_index in enumerate(indexes, start=1):
            key = (folder, visual_index)
            if key not in by_key:
                raise KeyError(f"Missing inventory metadata for {key}")

            row = by_key[key]
            source_path = Path(row["path"])
            with Image.open(source_path) as opened:
                image = ImageOps.exif_transpose(opened).convert("RGB")
                generated = {}
                for target_width in (480, 960):
                    width, height = resized_dimensions(
                        image.width, image.height, target_width
                    )
                    derivative = image.resize(
                        (width, height), Image.Resampling.LANCZOS
                    )
                    destination = output_dir / f"{position:02d}-{target_width}.webp"
                    derivative.save(destination, "WEBP", quality=82, method=6)
                    generated[str(target_width)] = {
                        "path": destination.relative_to(ROOT).as_posix(),
                        "width": width,
                        "height": height,
                    }

            built.append(
                {
                    "slug": slug,
                    "position": position,
                    "folder": folder,
                    "visual_index": visual_index,
                    "file_id": row["file_id"],
                    "filename": row["filename"],
                    "generated": generated,
                }
            )

    for slug, sources in NEW_ASSETS.items():
        output_dir = OUTPUT_ROOT / slug
        output_dir.mkdir(parents=True, exist_ok=True)
        for position, (filename, file_id) in enumerate(sources, start=1):
            source_path = NEW_IMAGE_ROOT / filename
            with Image.open(source_path) as opened:
                image = ImageOps.exif_transpose(opened).convert("RGB")
                generated = {}
                for target_width in (480, 960):
                    width, height = resized_dimensions(image.width, image.height, target_width)
                    derivative = image.resize((width, height), Image.Resampling.LANCZOS)
                    destination = output_dir / f"{position:02d}-{target_width}.webp"
                    derivative.save(destination, "WEBP", quality=82, method=6)
                    generated[str(target_width)] = {
                        "path": destination.relative_to(ROOT).as_posix(),
                        "width": width,
                        "height": height,
                    }
            built.append({
                "slug": slug,
                "position": position,
                "folder": "new-supplied-folder",
                "visual_index": position,
                "file_id": file_id,
                "filename": filename,
                "generated": generated,
            })

    print(json.dumps(built, indent=2))


if __name__ == "__main__":
    main()
