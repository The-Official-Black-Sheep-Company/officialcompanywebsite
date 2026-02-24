import requests
from bs4 import BeautifulSoup
import json
import os
import urllib.parse
import time

# Create media directory if it doesn't exist
MEDIA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'media', 'bible', 'genesis')
os.makedirs(MEDIA_DIR, exist_ok=True)

# List of keywords from the Genesis 1-2 study
STUDY_KEYWORDS = [
    "Enuma Elish Tablet",
    "Dead Sea Scroll Genesis 1 fragment",
    "Ancient Near East firmament cosmos map",
    "Ancient Hebrew Genesis Manuscript"
]

def fetch_image_from_wikimedia(keyword):
    """Fetches the first relevant image from Wikimedia Commons."""
    search_url = f"https://commons.wikimedia.org/w/index.php?search={urllib.parse.quote(keyword)}&title=Special:MediaSearch&go=Go&type=image"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BlackSheepApp/1.0"
    }
    
    try:
        print(f"Searching for: {keyword}")
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Wikimedia MediaSearch usually puts images in anchor tags with a specific class
        image_links = soup.select('a.sdms-image-result img')
        
        if image_links:
            # Get the high-res URL if possible, otherwise use the thumbnail and modify URL to get larger version
            img_element = image_links[0]
            img_url = img_element.get('src')
            if not img_url:
                img_url = img_element.get('data-src')
                
            if img_url:
                # Replace the thumb prefix to get the original image or a larger dimension
                # e.g., https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Enuma_elish.jpg/300px-Enuma_elish.jpg
                # to:   https://upload.wikimedia.org/wikipedia/commons/a/a2/Enuma_elish.jpg
                if '/thumb/' in img_url:
                    parts = img_url.split('/')
                    img_url = '/'.join(parts[:-1]).replace('/thumb/', '/')
                
                return img_url
        
        print(f"No image found for: {keyword}")
        return None
        
    except Exception as e:
        print(f"Error searching for {keyword}: {e}")
        return None

def download_image(url, filename):
    """Downloads an image from a URL and saves it to the media directory."""
    if not url: return False
    
    # Check if we got a protocol-relative URL
    if url.startswith('//'):
        url = 'https:' + url
        
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BlackSheepApp/1.0"
        }
        response = requests.get(url, stream=True, headers=headers)
        response.raise_for_status()
        
        filepath = os.path.join(MEDIA_DIR, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        print(f"Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def main():
    print("Starting Bible Study Image Fetcher...")
    
    # We will output a json map that the frontend could potentially load
    image_map = {}
    
    for keyword in STUDY_KEYWORDS:
        # Create a safe filename
        safe_name = keyword.lower().replace(' ', '_').replace(',', '') + '.jpg'
        
        img_url = fetch_image_from_wikimedia(keyword)
        
        if img_url:
            success = download_image(img_url, safe_name)
            if success:
                image_map[keyword] = f"/media/bible/genesis/{safe_name}"
        
        # Be nice to the server
        time.sleep(2)
        
    # Save the map for documentation/log 
    map_path = os.path.join(MEDIA_DIR, 'image_map.json')
    with open(map_path, 'w') as f:
        json.dump(image_map, f, indent=4)
        
    print(f"\nFinished. Image map saved to {map_path}")
    print("You can now update biblestudy.js to use these local URLs.")

if __name__ == "__main__":
    main()
