#!/usr/bin/env python3
"""
fetch_study_images.py
Fetches relevant images for Bible study sections using the Wikimedia Commons API.
Outputs a mapping JSON file at public/media/bible/image-map.json.
"""

import json
import os
import requests

# Keywords extracted from the Bible study data per chapter
STUDY_KEYWORDS = {
    "genesis_1": [
        "Enuma Elish tablet",
        "Dead Sea Scrolls Genesis",
        "Ancient Near East creation",
        "Masoretic Text manuscript",
        "Nippur tablet cuneiform"
    ],
    "genesis_2": [
        "Sabbath ancient Israel",
        "Creation cosmology ancient",
        "Hebrew manuscript scroll",
        "Ancient Near East rest day"
    ],
    "genesis_3": [
        "Serpent ancient art",
        "Garden of Eden painting",
        "Fall of Man artwork",
        "Tree of Knowledge ancient"
    ],
    "proverbs_1": [
        "King Solomon illustration",
        "Ancient Hebrew manuscript",
        "Ancient Israel map Jerusalem",
        "Wisdom literature scroll"
    ]
}

WIKI_API = "https://commons.wikimedia.org/w/api.php"
OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "public", "media", "bible", "image-map.json"
)


def search_wikimedia(query: str, limit: int = 3) -> list[dict]:
    """Search Wikimedia Commons for images matching the query."""
    params = {
        "action": "query",
        "list": "search",
        "srsearch": f"{query} filetype:bitmap",
        "srnamespace": "6",  # File namespace
        "srlimit": limit,
        "format": "json"
    }

    try:
        resp = requests.get(WIKI_API, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in data.get("query", {}).get("search", []):
            title = item["title"]
            # Build a thumbnail URL from the file title
            filename = title.replace("File:", "").replace(" ", "_")
            thumb_url = (
                f"https://commons.wikimedia.org/wiki/Special:FilePath/{filename}"
                f"?width=800"
            )
            results.append({
                "title": item["title"],
                "url": thumb_url,
                "snippet": item.get("snippet", "")
            })
        return results
    except Exception as e:
        print(f"  [WARN] Search failed for '{query}': {e}")
        return []


def main():
    print("=== Bible Study Image Fetcher ===")
    image_map = {}

    for section_key, keywords in STUDY_KEYWORDS.items():
        print(f"\n📖 Processing: {section_key}")
        image_map[section_key] = []

        for keyword in keywords:
            print(f"  🔍 Searching: {keyword}")
            images = search_wikimedia(keyword, limit=2)
            for img in images:
                print(f"    ✅ Found: {img['title']}")
                image_map[section_key].append({
                    "keyword": keyword,
                    "title": img["title"],
                    "url": img["url"]
                })

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(image_map, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Image map saved to: {OUTPUT_PATH}")
    print(f"   Total images found: {sum(len(v) for v in image_map.values())}")


if __name__ == "__main__":
    main()
