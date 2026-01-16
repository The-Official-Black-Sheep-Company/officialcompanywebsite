#!/usr/bin/env python3
"""
Complete Inventory Management System with Staging - UPDATED
- HTTPS Server for phone scanner with full API
- Back/Exit buttons on every prompt
- Full menu parity with phone app
- Amazon price search integration
"""

import mysql.connector
import logging
import requests
import time
import re
import ssl
import csv
from datetime import datetime
from bs4 import BeautifulSoup
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import threading
import sys
import socket
from urllib.parse import quote_plus
import os
import glob

# Configure logging to file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scanner_server.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
from db import (
    connect_to_database,
    create_staging_table,
    create_product_media_table,
    get_last_item_info,
    get_product_info_by_upc,
    insert_into_staging,
    view_staged_items,
    delete_staged_item,
    edit_staged_item,
    import_all_to_inventory,
    export_staged_to_csv,
    clear_all_staged,
    get_all_inventory_with_media,
)

# Define the port for the HTTPS server
HTTP_PORT = 8443  # Port for HTTPS API server

# Global queues and state
upc_queue = []
queue_lock = threading.Lock()
phone_scan_active = False


def search_barcode_lookup_api(upc):
    """Search Barcode Lookup API for UPC - free alternative to UPCitemdb"""
    try:
        logging.info(f"Searching Barcode Lookup API for UPC: {upc}")

        # Barcode Lookup API - free tier available
        api_url = f"https://api.barcodelookup.com/v3/products?barcode={upc}&formatted=y&key=YOUR_API_KEY_HERE"

        # Try without API key first (limited but works for testing)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        # Alternative free API that doesn't require key
        api_url = f"https://world.openfoodfacts.org/api/v0/product/{upc}.json"

        response = requests.get(api_url, headers=headers, timeout=5)

        if response.status_code == 200:
            data = response.json()

            # OpenFoodFacts format
            if data.get('status') == 1 and data.get('product'):
                product = data['product']
                product_name = product.get('product_name') or product.get('product_name_en')

                if product_name and len(product_name) > 3:
                    logging.info(f"  ✓ Barcode Lookup found product: {product_name}")

                    # Also try to get brand and combine
                    brand = product.get('brands', '')
                    if brand and brand not in product_name:
                        product_name = f"{brand} {product_name}"

                    return {
                        'product_name': product_name,
                        'brand': brand,
                        'category': product.get('categories', ''),
                        'images': product.get('image_url', ''),
                        'source': 'openfoodfacts'
                    }

        logging.info(f"  No product found via Barcode Lookup API for UPC: {upc}")
        return None

    except Exception as e:
        logging.error(f"Error with Barcode Lookup API for UPC {upc}: {e}")
        return None

def search_google_for_upc(upc):
    """Search Google for UPC to find product name when UPCitemdb fails"""
    try:
        logging.info(f"Searching Google for UPC: {upc}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }

        # Search Google for the UPC
        google_url = f"https://www.google.com/search?q={upc}"
        response = requests.get(google_url, headers=headers, timeout=5)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Try to find product name in different locations
            possible_names = []

            # Filter bad phrases
            bad_phrases = [
                'redirect', 'click here', 'please', 'cookies', 'privacy',
                'accept', 'settings', 'learn more', 'continue', 'about',
                'images', 'videos', 'news', 'shopping', 'maps', 'search'
            ]

            # Method 1: Look for search result titles (h3 tags are usually product names)
            for h3 in soup.find_all('h3', limit=10):
                text = h3.get_text().strip()
                # Must have reasonable length and contain some text
                if text and 10 < len(text) < 200:
                    # Check for bad phrases
                    text_lower = text.lower()
                    if not any(bad in text_lower for bad in bad_phrases):
                        possible_names.append(text)
                        logging.info(f"  Candidate from h3: {text[:80]}")

            # Method 2: Look for div class that typically contains product info
            for div in soup.find_all('div', class_=lambda x: x and ('BNeawe' in x or 'r025kc' in x), limit=10):
                text = div.get_text().strip()
                if text and 10 < len(text) < 200:
                    text_lower = text.lower()
                    if not any(bad in text_lower for bad in bad_phrases):
                        possible_names.append(text)
                        logging.info(f"  Candidate from div: {text[:80]}")

            # Take the first good result
            for name in possible_names:
                # Clean up
                name = name.replace(upc, '').strip()
                name = name.split('|')[0].strip()
                name = name.split(' - ')[0].strip()

                if len(name) > 10:
                    logging.info(f"  ✓ Selected product name from Google: {name}")
                    return name

        logging.info(f"  No product name found on Google for UPC: {upc}")
        return None

    except Exception as e:
        logging.error(f"Error searching Google for UPC {upc}: {e}")
        return None

def extract_price_from_offers(offers):
    """Extract price from UPCitemdb offers (from FIRST search)"""
    try:
        if not offers or len(offers) == 0:
            return None

        prices = []
        for offer in offers:
            if isinstance(offer, dict) and 'price' in offer:
                try:
                    # Price might be a string like "$19.99" or a number
                    price_str = str(offer['price']).replace('$', '').replace(',', '').strip()
                    price = float(price_str)
                    if 0.01 <= price <= 100000:  # Reasonable price range
                        prices.append(price)
                        logging.info(f"  Found price in offer: ${price:.2f} from {offer.get('merchant', 'unknown')}")
                except (ValueError, TypeError) as e:
                    logging.debug(f"  Could not parse price from offer: {offer.get('price')} - {e}")
                    continue

        if prices:
            # Return the median price from all offers
            median_price = sorted(prices)[len(prices)//2]
            logging.info(f"  Using median price from {len(prices)} offers: ${median_price:.2f}")
            return f"{median_price:.2f}"

        return None
    except Exception as e:
        logging.error(f"Error extracting price from offers: {e}")
        return None



# UPCitemdb API Configuration
# Load API key from config.json
try:
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)
        UPCITEMDB_API_KEY = config.get('upcitemdb_api_key')
except FileNotFoundError:
    logging.error("config.json not found. Please ensure it exists and contains 'upcitemdb_api_key'.")
    UPCITEMDB_API_KEY = None
except json.JSONDecodeError:
    logging.error("Error decoding config.json. Please check its format.")
    UPCITEMDB_API_KEY = None

UPCITEMDB_API_URL = "https://api.upcitemdb.com/prod/v1/lookup"

def get_product_info_from_upc(upc):
    """Look up product information from UPC using UPCitemdb API - FIRST SEARCH (DO NOT MODIFY)"""
    if not UPCITEMDB_API_KEY: # Check if key is None or empty
        logging.warning("UPCITEMDB_API_KEY is not set. Using placeholder product info.")
        return {
            'product_name': f'Unknown Product {upc}',
            'found': False
        }

    try:
        headers = {
            "Content-Type": "application/json",
            "user_key": UPCITEMDB_API_KEY
        }
        params = {"upc": upc}
        response = requests.get(UPCITEMDB_API_URL, headers=headers, params=params, timeout=5)
        response.raise_for_status() # Raise an exception for HTTP errors

        data = response.json()

        if data and data.get('items'):
            item = data['items'][0]

            # Return ALL product information from UPCitemdb (not just name)
            product_info = {
                'product_name': item.get('title', f'Product {upc}'),
                'brand': item.get('brand', ''),
                'model': item.get('model', ''),
                'category': item.get('category', ''),
                'manufacturer': item.get('manufacturer', ''),
                'publisher': item.get('publisher', ''),
                'upc': item.get('upc', upc),
                'ean': item.get('ean', ''),
                'asin': item.get('asin', ''),
                'description': item.get('description', ''),
                'images': item.get('images', []),
                'offers': item.get('offers', []),
                'found': True
            }

            # Log all the info we found from the FIRST search
            logging.info(f"FIRST SEARCH - UPC Lookup Results for {upc}:")
            logging.info(f"  Product: {product_info['product_name']}")
            if product_info['brand']:
                logging.info(f"  Brand: {product_info['brand']}")
            if product_info['category']:
                logging.info(f"  Category: {product_info['category']}")
            if product_info['offers']:
                logging.info(f"  Offers found: {len(product_info['offers'])}")

            return product_info
        else:
            logging.info(f"No product found for UPC: {upc} via UPCitemdb.")

            # FALLBACK 1: Try Barcode Lookup API (OpenFoodFacts)
            logging.info(f"Attempting Barcode Lookup API fallback for UPC: {upc}")
            barcode_result = search_barcode_lookup_api(upc)

            if barcode_result:
                logging.info(f"✓ Barcode Lookup API found product: {barcode_result['product_name']}")
                return {
                    'product_name': barcode_result['product_name'],
                    'brand': barcode_result.get('brand', ''),
                    'model': '',
                    'category': barcode_result.get('category', ''),
                    'manufacturer': '',
                    'description': '',
                    'images': [barcode_result.get('images', '')] if barcode_result.get('images') else [],
                    'offers': [],
                    'found': True,
                    'source': barcode_result.get('source', 'barcode_lookup')
                }

            # FALLBACK 2: Try Google search for the UPC
            logging.info(f"Attempting Google fallback search for UPC: {upc}")
            google_product_name = search_google_for_upc(upc)

            if google_product_name:
                logging.info(f"✓ Google found product: {google_product_name}")
                return {
                    'product_name': google_product_name,
                    'brand': '',
                    'model': '',
                    'category': '',
                    'manufacturer': '',
                    'description': '',
                    'images': [],
                    'offers': [],
                    'found': True,
                    'source': 'google'
                }
            else:
                logging.warning(f"All methods failed for UPC: {upc}")
                return {
                    'product_name': f'Unknown Product {upc}',
                    'found': False
                }

    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching product info from UPCitemdb for UPC {upc}: {e}")

        # FALLBACK 1: Try Barcode Lookup API even if UPCitemdb errors
        logging.info(f"UPCitemdb failed, trying Barcode Lookup API for UPC: {upc}")
        barcode_result = search_barcode_lookup_api(upc)

        if barcode_result:
            logging.info(f"✓ Barcode Lookup API found product: {barcode_result['product_name']}")
            return {
                'product_name': barcode_result['product_name'],
                'brand': barcode_result.get('brand', ''),
                'model': '',
                'category': barcode_result.get('category', ''),
                'manufacturer': '',
                'description': '',
                'images': [barcode_result.get('images', '')] if barcode_result.get('images') else [],
                'offers': [],
                'found': True,
                'source': barcode_result.get('source', 'barcode_lookup')
            }

        # FALLBACK 2: Try Google search
        logging.info(f"Trying Google fallback for UPC: {upc}")
        google_product_name = search_google_for_upc(upc)

        if google_product_name:
            logging.info(f"✓ Google found product: {google_product_name}")
            return {
                'product_name': google_product_name,
                'brand': '',
                'model': '',
                'category': '',
                'manufacturer': '',
                'description': '',
                'images': [],
                'offers': [],
                'found': True,
                'source': 'google'
            }
        else:
            logging.warning(f"All methods failed for UPC: {upc}")
            return {
                'product_name': f'Unknown Product {upc}',
                'found': False
            }



def get_product_details_for_staging(conn, upc):
    """Retrieves product details for staging without inserting into the database."""
    try:
        # FIRST SEARCH: Get product info from UPC (DO NOT MODIFY THIS)
        product_info = get_product_info_from_upc(upc)
        if not product_info.get('found'):
            product_name = f'Unknown Product {upc}'
        else:
            product_name = product_info.get('product_name', f'Product {upc}')

        # Import the function from db module
        from db import get_last_item_info

        # Get next available BlackSheep # (fills gaps, no suffixes)
        # EVERY scan gets a unique number, even for duplicate UPCs
        blacksheep_num, location = get_last_item_info(conn)

        # Extract price from offers found in FIRST search
        logging.info(f"Extracting price from offers found in FIRST search...")
        offers = product_info.get('offers', [])
        suggested_price = extract_price_from_offers(offers)

        # Prepare product data - Include ALL info from FIRST search including suggested price
        product_data = {
            'product_name': product_name,
            'upc': upc,
            'blacksheep_num': str(blacksheep_num),
            'location': location,
            'suggested_price': suggested_price,  # From offers in FIRST search
            'price_required': True,  # Flag indicating price is required
            'date_listed': datetime.now().strftime('%Y-%m-%d'),
            # Include ALL the extra info from FIRST search
            'brand': product_info.get('brand', ''),
            'model': product_info.get('model', ''),
            'category': product_info.get('category', ''),
            'manufacturer': product_info.get('manufacturer', ''),
            'description': product_info.get('description', ''),
            'images': product_info.get('images', []),
            'offers': product_info.get('offers', []),
        }
        return {'status': 'success', 'product': product_data}

    except Exception as e:
        logging.error(f"Error in get_product_details_for_staging: {e}")
        return {
            'status': 'error',
            'message': str(e)
        }

def find_product_media(upc, product_name):
    """Finds all media files (photos, videos) for a given UPC."""
    media_files = {
        "photos": [],
        "videos": []
    }

    # Sanitize product name for searching in filenames
    safe_product_name = "".join(c if c.isalnum() or c in " _-" else "_" for c in product_name).replace(" ", "_")

    # Search for photos
    photo_patterns = [
        f"media/{upc}*.jpg",
        f"media/{upc}*.png",
        f"media/{safe_product_name}*.jpg",
        f"media/{safe_product_name}*.png"
    ]
    for pattern in photo_patterns:
        found_files = glob.glob(pattern)
        # Convert to relative paths for web serving
        media_files["photos"].extend(found_files)

    # Search for videos
    video_patterns = [
        f"media/videos/{upc}*.webm",
        f"media/videos/{upc}*.mp4",
        f"media/videos/{safe_product_name}*.webm",
        f"media/videos/{safe_product_name}*.mp4"
    ]
    for pattern in video_patterns:
        found_files = glob.glob(pattern)
        media_files["videos"].extend(found_files)

    # Remove duplicate files
    media_files["photos"] = sorted(list(set(media_files["photos"])))
    media_files["videos"] = sorted(list(set(media_files["videos"])))

    logging.info(f"Found media for {product_name} (UPC: {upc}): {len(media_files['photos'])} photos, {len(media_files['videos'])} videos")
    if media_files["photos"]:
        logging.info(f"  Photo paths: {media_files['photos']}")
    if media_files["videos"]:
        logging.info(f"  Video paths: {media_files['videos']}")

    return media_files

def get_full_product_details(upc):
    """
    Fetches all details for a product from APIs, the database, and the filesystem.
    """
    conn = connect_to_database()
    if not conn:
        return {"error": "Failed to connect to the database."}

    # 1. Get information from external APIs (UPCitemdb, etc.)
    api_product_info = get_product_info_from_upc(upc)
    if not api_product_info or not api_product_info.get("found"):
        conn.close()
        return {"error": f"Product with UPC {upc} not found via external APIs."}

    # 2. Get internal information from our database (blacksheep #, location)
    db_product_info = get_product_info_by_upc(conn, upc)

    # 3. Find associated media files
    product_name = api_product_info.get("product_name", "Unknown Product")
    media_files = find_product_media(upc, product_name)

    # 4. Combine all information
    full_details = {
        "upc": upc,
        "product_name": product_name,
        "description": api_product_info.get("description", ""),
        "brand": api_product_info.get("brand", ""),
        "category": api_product_info.get("category", ""),
        "price_suggestions": api_product_info.get("offers", []),
        "api_source": api_product_info.get("source", "upcitemdb"),
        "internal_info": db_product_info,
        "media": media_files
    }
    
    conn.close()
    return full_details


def process_upc_auto(conn, upc):
    """Process UPC and return product details - DO NOT add to staging yet"""
    result = get_product_details_for_staging(conn, upc)
    if result['status'] == 'error':
        return result

    product_data = result['product']

    # IMPORTANT: DO NOT insert into staging here!
    # The product must be finalized with a price first
    return {
        'status': 'success',
        'message': 'Product information retrieved. Price required before saving.',
        'product': product_data,
        'requires_price': True  # Flag to frontend that price input is required
    }


def process_upc(conn, upc):
    """Process UPC in manual mode (interactive)"""
    result = process_upc_auto(conn, upc)
    if result['status'] == 'success':
        product = result['product']

        # Display ALL information from UPC search
        print("\n" + "="*60)
        print("📦 PRODUCT INFORMATION FROM UPC SEARCH")
        print("="*60)
        print(f"Product Name: {product['product_name']}")
        print(f"UPC: {product['upc']}")

        if product.get('brand'):
            print(f"Brand: {product['brand']}")
        if product.get('model'):
            print(f"Model: {product['model']}")
        if product.get('category'):
            print(f"Category: {product['category']}")
        if product.get('manufacturer'):
            print(f"Manufacturer: {product['manufacturer']}")
        if product.get('description'):
            print(f"Description: {product['description'][:200]}...")  # First 200 chars

        # Show pricing information from offers
        if product.get('offers') and len(product['offers']) > 0:
            print(f"\n💰 PRICING - Found {len(product['offers'])} price offer(s):")
            for i, offer in enumerate(product['offers'][:5], 1):  # Show first 5
                if isinstance(offer, dict):
                    merchant = offer.get('merchant', 'Unknown')
                    price = offer.get('price', 'N/A')
                    print(f"   {i}. {merchant}: ${price}")

        # ALWAYS show suggested price prominently
        suggested_price = product.get('suggested_price')
        if suggested_price:
            print("\n" + "="*60)
            print(f"💡 SUGGESTED MEDIAN PRICE: ${suggested_price}")
            print("="*60)
            item_price = safe_input(f"Enter final price (default: {suggested_price}):") or suggested_price
        else:
            print("\n" + "="*60)
            print("⚠️  NO PRICE FOUND - You will need to enter price manually")
            print("="*60)
            item_price = safe_input("Enter final price:")

        # --- Prompt for Weight ---
        print("\n" + "="*60)
        print("⚖️ WEIGHT INFORMATION")
        print("="*60)
        weight = safe_input("Enter weight (e.g., 1.5):")
        weight_unit = ""
        if weight.strip():
            print("\nSelect unit:")
            print("1. lbs")
            print("2. oz")
            print("3. floz")
            print("4. pt")
            print("5. qt")
            print("6. grams")
            unit_choice = safe_input("Unit (1-6):")
            units = {
                '1': 'lbs', '2': 'oz', '3': 'floz',
                '4': 'pt', '5': 'qt', '6': 'grams'
            }
            weight_unit = units.get(unit_choice, '')

        print(f"\nBlackSheep #: {product['blacksheep_num']}")
        print(f"Location: {product['location']}")
        print("="*60)

        # Confirm and insert into staging
        confirm_save = safe_input("\nAdd to staging? (y/n):")
        if confirm_save.lower() == 'y':
            # Re-establish connection, as previous one might have been closed by API calls
            conn_for_insert = connect_to_database() 
            if conn_for_insert:
                product_data_for_insert = {
                    'product_name': product['product_name'],
                    'upc': product['upc'],
                    'blacksheep_num': product['blacksheep_num'],
                    'location': product['location'],
                    'item_price': item_price,
                    'date_listed': datetime.now().strftime('%Y-%m-%d'),
                    'weight': weight,
                    'weight_unit': weight_unit,
                    'weight_lbs': None # Will be calculated by insert_into_staging if needed
                }
                if insert_into_staging(conn_for_insert, product_data_for_insert):
                    print(f"\n✅ Product '{product['product_name']}' added to staging.")
                else:
                    print("\n❌ Failed to add product to staging.")
                conn_for_insert.close()
            else:
                print("\n❌ Database connection failed for insert.")
    else:
        print(f"\n❌ Error: {result['message']}")


def review_staging_menu(conn):
    """Review staging menu"""
    while True:
        print("\n" + "="*60)
        print("📋 REVIEW STAGED ITEMS")
        print("="*60)
        print("  1. View all staged items")
        print("  2. Delete specific item")
        print("  3. Edit specific item")
        print("  4. Import all to Inventory")
        print("  5. Keep in staging")
        print("  6. Export staged items to CSV")
        print("  7. Clear all staged items")
        print("  8. Back to main menu")

        print_help_text()
        print("💡 Tip: Type 'q'/'quit' or 'e'/'exit' to quit program.")
        choice = safe_input("\nSelect option (1-8):")

        # Handle back command
        if choice.upper() == 'BACK' or choice.lower() == 'b' or choice == '8':
            break

        # Handle quit/exit commands
        if choice.lower() in ['q', 'quit', 'e', 'exit']:
            print("\n👋 Shutting down...")
            sys.exit(0)

        if choice == '1':
            view_staged_items(conn)
        elif choice == '2':
            delete_staged_item(conn)
        elif choice == '3':
            edit_staged_item(conn)
        elif choice == '4':
            import_all_to_inventory(conn)
        elif choice == '5':
            print("\n✅ Items will remain in staging.")
        elif choice == '6':
            export_staged_to_csv(conn)
        elif choice == '7':
            clear_all_staged(conn)
        else:
            print("Invalid option.")

def check_queue():
    """Check for UPCs from phone app"""
    with queue_lock:
        if upc_queue:
            return upc_queue.pop(0)
    return None

def manual_mode(conn):
    """Manual UPC entry mode"""
    print("\n🔍 Manual Mode")
    print("   Commands: 'b'/'back' = main menu, 'view' = see staged items")
    print("   Commands: 'q'/'quit' or 'e'/'exit' = quit program\n")

    while True:
        print_help_text()
        upc = safe_input("\nEnter UPC:")

        # Handle back command
        if upc.upper() == 'BACK' or upc.lower() == 'b':
            return

        # Handle quit/exit commands
        if upc.lower() in ['q', 'quit', 'e', 'exit']:
            print("\n👋 Shutting down...")
            sys.exit(0)

        # Handle view command
        elif upc.lower() == 'view':
            view_staged_items(conn)
            continue

        # Process UPC
        elif upc:
            process_upc(conn, upc)

def phone_scan_mode(conn):
    """Phone scan mode - waits for scans from phone app"""
    global phone_scan_active
    phone_scan_active = True
    
    print("\n📱 Phone Scan Mode")
    print("   Type 'b' to return, 'q' or 'e' to quit")
    print("   ⏳ Waiting for phone scans...\n")
    
    import select
    
    while phone_scan_active:
        # Check for keyboard input
        if sys.platform != 'win32':
            if sys.stdin in select.select([sys.stdin], [], [], 0)[0]:
                line = sys.stdin.readline().strip().lower()
                if line in ['b', 'back']:
                    phone_scan_active = False
                    print("\n   Returning to menu...")
                    return
                elif line in ['q', 'quit', 'e', 'exit']:
                    print("\n👋 Shutting down...")
                    sys.exit(0)
        
        # Check queue for phone scans
        item = check_queue()
        if item:
            print(f"\n📦 Received UPC from phone: {item['upc']}")
            process_upc_auto(conn, item['upc'])
            print("\n   ⏳ Ready for next scan...")
        
        time.sleep(0.5)
class UPCHandler(BaseHTTPRequestHandler):
    """HTTP request handler for receiving UPCs from phone app"""
    
    def do_GET(self):
        """Serve the HTML scanner page or API endpoints"""
        if self.path == '/' or self.path == '/dashboard':
            try:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()

                with open('services_dashboard.html', 'r') as f:
                    html_content = f.read()
                self.wfile.write(html_content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'services_dashboard.html not found')

        elif self.path == '/scanner':
            try:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()

                with open('scanner.html', 'r') as f:
                    html_content = f.read()
                self.wfile.write(html_content.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'scanner.html not found')
        
        elif self.path == '/api/staging/list':
            self.handle_list_staging()
        
        elif self.path == '/api/staging/export':
            self.handle_export_csv()
        
        elif self.path.startswith('/api/amazon/search?'):
            self.handle_amazon_search()
        
        elif self.path == '/api/inventory/list':
            self.handle_list_inventory()
        
        elif self.path == '/api/phone/status':
            self.handle_phone_status()
        
        elif self.path.startswith('/api/product/info?'):
            self.handle_get_product_info()

        elif self.path.startswith('/api/product_details?'):
            self.handle_get_full_product_details()

        elif self.path == '/api/inventory/all':
            self.handle_get_all_inventory()

        elif self.path == '/api/products':
            self.handle_get_products()

        elif self.path == '/api/ebay/notifications':
            self.handle_get_ebay_notifications()

        elif self.path == '/api/ebay/endpoint-status':
            self.handle_ebay_endpoint_status()

        elif self.path == '/api/ebay/config':
            self.handle_get_ebay_config()

        elif self.path.startswith('/media/'):
            # Serve static media files (images, videos)
            self.serve_media_file()

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'

        if self.path == '/api/staging/manual':
            self.handle_manual_upc(post_data)
        elif self.path == '/api/staging/finalize':
            self.handle_finalize_staging(post_data)
        elif self.path == '/api/staging/update':
            self.handle_update_staging(post_data)
        elif self.path == '/api/staging/delete':
            self.handle_delete_staging(post_data)
        elif self.path == '/api/staging/import':
            self.handle_import_all(post_data)
        elif self.path == '/api/staging/clear':
            self.handle_clear_all(post_data)
        elif self.path == '/api/inventory/move':
            self.handle_move_to_staging(post_data)
        elif self.path == '/api/phone/command':
            self.handle_phone_command(post_data)
        elif self.path == '/api/amazon/search':
            self.handle_amazon_search_post(post_data)
        elif self.path == '/api/upc/scan':
            self.handle_upc_scan(post_data)
        elif self.path == '/api/media/upload':
            self.handle_media_upload(post_data)
        elif self.path == '/api/video/generate':
            self.handle_generate_marketing_video(post_data)
        else:
            self.send_response(404)
            self.end_headers()

    def handle_get_all_inventory(self):
        """Handle GET request for all inventory items with media."""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'error': 'Database error'}, 500)
                return

            items = get_all_inventory_with_media(conn)
            conn.close()
            self.send_json_response({"items": items})

        except Exception as e:
            logging.error(f"Error getting all inventory: {e}")
            self.send_json_response({'error': str(e)}, 500)

    def handle_get_products(self):
        """Handle GET request for products to display in shopping tab - formats data for index.html"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'error': 'Database error'}, 500)
                return

            items = get_all_inventory_with_media(conn)
            conn.close()

            # Format products for the shopping tab in index.html
            products = []
            for item in items:
                # Use first available photo, or placeholder if none
                image = item.get('photo1_path') or item.get('photo2_path') or item.get('photo3_path') or 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'

                # If image is a local path, convert it to a URL
                if image and not image.startswith('http'):
                    # This logic is to clean up messy paths that might be in the database
                    # due to folder restructuring. It finds the last 'media' and takes everything after it.
                    if 'media/' in image:
                        image = 'media/' + image.split('media/')[-1]
                    image = f'https://10.0.0.249:8443/{image}'

                video = item.get('video_path')
                if video and not video.startswith('http'):
                    if 'media/' in video:
                        video = 'media/' + video.split('media/')[-1]
                    video = f'https://10.0.0.249:8443/{video}'

                products.append({
                    'id': item.get('upc', 'N/A'),
                    'name': item.get('product_name', 'Unknown Product'),
                    'price': float(item.get('price', 0)) if item.get('price') else 0.0,
                    'image': image,
                    'video': video
                })

            self.send_json_response(products)

        except Exception as e:
            logging.error(f"Error getting products: {e}")
            self.send_json_response({'error': str(e)}, 500)

    def handle_get_ebay_notifications(self):
        """Handle GET request for eBay notifications"""
        try:
            import os
            notifications_file = '/home/swoopg111/scripts/barcode_scanner/ebay_notifications.json'

            if os.path.exists(notifications_file):
                with open(notifications_file, 'r') as f:
                    notifications = json.load(f)
                self.send_json_response({'notifications': notifications})
            else:
                self.send_json_response({'notifications': []})

        except Exception as e:
            logging.error(f"Error getting eBay notifications: {e}")
            self.send_json_response({'error': str(e), 'notifications': []}, 500)

    def handle_ebay_endpoint_status(self):
        """Handle GET request for eBay endpoint status"""
        try:
            # Check if upc_receiver.py is running on port 1522
            import subprocess
            result = subprocess.run(['lsof', '-i', ':1522'], capture_output=True, text=True)

            if result.returncode == 0 and 'python' in result.stdout.lower():
                status = 'Active - Listening on port 1522'
            else:
                status = 'Inactive - Service not running'

            self.send_json_response({'status': status})

        except Exception as e:
            logging.error(f"Error checking endpoint status: {e}")
            self.send_json_response({'status': 'Unknown', 'error': str(e)}, 500)

    def handle_get_ebay_config(self):
        """Handle GET request for eBay configuration"""
        try:
            # Read the eBay configuration from upc_receiver.py
            import re
            config = {}

            with open('upc_receiver.py', 'r') as f:
                content = f.read()

                # Extract EBAY_VERIFICATION_TOKEN
                token_match = re.search(r'EBAY_VERIFICATION_TOKEN\s*=\s*["\']([^"\']+)["\']', content)
                if token_match:
                    token = token_match.group(1)
                    config['verification_token'] = token if token != 'your-ebay-verification-token-here' else 'Not configured'
                    config['is_configured'] = token != 'your-ebay-verification-token-here'
                else:
                    config['verification_token'] = 'Not found'
                    config['is_configured'] = False

                # Extract EBAY_ENDPOINT_ID
                endpoint_match = re.search(r'EBAY_ENDPOINT_ID\s*=\s*["\']([^"\']+)["\']', content)
                if endpoint_match:
                    endpoint_id = endpoint_match.group(1)
                    config['endpoint_id'] = endpoint_id if endpoint_id != 'your-endpoint-id-here' else 'Not configured'
                else:
                    config['endpoint_id'] = 'Not found'

                # Extract PORT
                port_match = re.search(r'PORT\s*=\s*(\d+)', content)
                if port_match:
                    config['port'] = int(port_match.group(1))
                else:
                    config['port'] = 1522

            self.send_json_response(config)

        except Exception as e:
            logging.error(f"Error getting eBay config: {e}")
            self.send_json_response({'error': str(e)}, 500)

    def handle_get_product_info(self):
        """Handle GET request for initial product info by UPC"""
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            upc = params.get('upc', [''])[0]

            if not upc:
                self.send_json_response({'status': 'error', 'message': 'UPC required'}, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            result = get_product_details_for_staging(conn, upc)
            conn.close()
            self.send_json_response(result)

        except Exception as e:
            logging.error(f"Error getting product info: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)

    def handle_get_full_product_details(self):
        """Handle GET request for full product details including media"""
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            upc = params.get('upc', [''])[0]

            if not upc:
                self.send_json_response({'error': 'UPC required'}, 400)
                return

            details = get_full_product_details(upc)
            self.send_json_response(details)

        except Exception as e:
            logging.error(f"Error getting full product details: {e}")
            self.send_json_response({'error': str(e)}, 500)

    def handle_finalize_staging(self, post_data):
        """Handle final insertion of collected product data into staging"""
        try:
            data = json.loads(post_data.decode('utf-8'))

            # Extract all necessary fields
            upc = data.get('upc')
            product_name = data.get('product_name')
            blacksheep_num = data.get('blacksheep_num')
            location = data.get('location')
            item_price = data.get('item_price')
            weight = data.get('weight')
            weight_unit = data.get('weight_unit')
            photo1_path = data.get('photo1_path')
            photo2_path = data.get('photo2_path')
            photo3_path = data.get('photo3_path')
            video_path = data.get('video_path')

            # CRITICAL: Validate that price is provided and not empty/zero
            if not all([upc, product_name, blacksheep_num, location]):
                self.send_json_response({'status': 'error', 'message': 'Missing essential product details'}, 400)
                return

            # MANDATORY PRICE CHECK
            if not item_price or item_price == '' or item_price == '0' or item_price == '0.00':
                self.send_json_response({
                    'status': 'error',
                    'message': 'PRICE IS REQUIRED! No products can be saved without a price.'
                }, 400)
                return

            # Validate price is a valid number
            try:
                price_float = float(item_price)
                if price_float <= 0:
                    self.send_json_response({
                        'status': 'error',
                        'message': 'Price must be greater than 0'
                    }, 400)
                    return
            except ValueError:
                self.send_json_response({
                    'status': 'error',
                    'message': 'Invalid price format'
                }, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            # Perform weight conversion to LBS
            weight_lbs = None
            if weight is not None and weight_unit:
                try:
                    weight_val = float(weight)
                    
                    # Constants for conversion (Olive Oil density)
                    OLIVE_OIL_DENSITY_G_PER_ML = 0.916 # grams per milliliter
                    ML_PER_FL_OZ = 29.5735
                    GRAMS_PER_LB = 453.592

                    if weight_unit == 'lbs':
                        weight_lbs = weight_val
                    elif weight_unit == 'oz':
                        weight_lbs = weight_val / 16.0
                    elif weight_unit == 'grams':
                        weight_lbs = weight_val / GRAMS_PER_LB
                    elif weight_unit == 'floz':
                        volume_ml = weight_val * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                    elif weight_unit == 'pt':
                        volume_fl_oz = weight_val * 16 # 1 pint = 16 fl oz
                        volume_ml = volume_fl_oz * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                    elif weight_unit == 'qt':
                        volume_fl_oz = weight_val * 32 # 1 quart = 32 fl oz
                        volume_ml = volume_fl_oz * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                except ValueError:
                    logging.warning(f"Could not convert weight '{weight}' to float during finalization.")

            # Prepare product data for insertion
            product_data_for_insert = {
                'product_name': product_name,
                'upc': upc,
                'blacksheep_num': blacksheep_num,
                'location': location,
                'item_price': item_price,
                'date_listed': datetime.now().strftime('%Y-%m-%d'),
                'weight': str(weight) if weight is not None else 'N/A',
                'weight_unit': weight_unit,
                'weight_lbs': weight_lbs
            }

            # Insert into staging
            if insert_into_staging(conn, product_data_for_insert):
                # Get the staging_id that was just inserted
                cursor = conn.cursor()
                cursor.execute("SELECT LAST_INSERT_ID()")
                staging_id = cursor.fetchone()[0]
                cursor.close()

                # Update Product_Media table with paths
                if any([photo1_path, photo2_path, photo3_path, video_path]):
                    media_update_query = """
                        INSERT INTO Product_Media (staging_id, upc, photo1_path, photo2_path, photo3_path, video_path)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE
                            photo1_path = VALUES(photo1_path),
                            photo2_path = VALUES(photo2_path),
                            photo3_path = VALUES(photo3_path),
                            video_path = VALUES(video_path)
                    """
                    cursor = conn.cursor()
                    cursor.execute(media_update_query, (staging_id, upc, photo1_path, photo2_path, photo3_path, video_path))
                    conn.commit()
                    cursor.close()

                conn.close()

                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                print(f"\n[{timestamp}] 📱 Phone Scan - Item finalized and added to staging:")
                print(f"    UPC: {upc}")
                print(f"    Product Name: {product_name}")
                print(f"    BlackSheep #: {blacksheep_num}")
                print(f"    Location: {location}")
                print(f"    Price: ${item_price}")
                if weight is not None:
                    print(f"    Original Weight: {weight} {weight_unit}")
                if weight_lbs is not None:
                    print(f"    Converted Weight (LBS): {weight_lbs:.3f} lbs")
                if photo1_path: print(f"    Photo 1: {photo1_path}")
                if video_path: print(f"    Video: {video_path}")
                print(f"    Staging ID: {staging_id}")

                self.send_json_response({
                    'status': 'success',
                    'message': 'Product finalized and added to staging',
                    'staging_id': staging_id,
                    'product': {
                        'product_name': product_name,
                        'upc': upc,
                        'blacksheep_num': blacksheep_num,
                        'location': location,
                        'item_price': item_price
                    }
                })
            else:
                conn.close()
                self.send_json_response({
                    'status': 'error',
                    'message': 'Failed to finalize and add product to staging'
                }, 500)

        except Exception as e:
            logging.error(f"Error finalizing staging item: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
            
    def handle_update_staging(self, post_data):
        """Update specific staged item"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            item_id = data.get('id')
            
            if not item_id:
                self.send_json_response({'status': 'error', 'message': 'ID required'}, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            # Build update query dynamically based on provided fields
            updates = []
            values = []
            
            if 'product_name' in data:
                updates.append("`Product Name` = %s")
                values.append(data['product_name'])
            if 'upc' in data:
                updates.append("`Upc#` = %s")
                values.append(data['upc'])
            if 'blacksheep' in data:
                updates.append("`blacksheep #` = %s")
                values.append(data['blacksheep'])
            if 'location' in data:
                updates.append("`location` = %s")
                values.append(data['location'])
            if 'price' in data:
                updates.append("`Item Price subtotal` = %s")
                values.append(data['price'])
            if 'weight' in data: # Add weight update
                updates.append("`Weight` = %s")
                values.append(data['weight'])
            if 'weight_unit' in data: # Add weight unit update
                updates.append("`Weight_Unit` = %s")
                values.append(data['weight_unit'])
            
            # Convert weight to LBS if weight and unit are provided
            weight_lbs = None
            if 'weight' in data and 'weight_unit' in data:
                try:
                    weight_val = float(data['weight'])
                    unit = data['weight_unit']

                    # Constants for conversion (Olive Oil density)
                    OLIVE_OIL_DENSITY_G_PER_ML = 0.916 # grams per milliliter
                    ML_PER_FL_OZ = 29.5735
                    GRAMS_PER_LB = 453.592

                    if unit == 'lbs':
                        weight_lbs = weight_val
                    elif unit == 'oz':
                        weight_lbs = weight_val / 16.0
                    elif unit == 'grams':
                        weight_lbs = weight_val / GRAMS_PER_LB
                    elif unit == 'floz':
                        # Convert fl oz to mL, then to grams, then to lbs
                        volume_ml = weight_val * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                    elif unit == 'pt':
                        # Convert pints to fl oz, then to mL, then to grams, then to lbs
                        volume_fl_oz = weight_val * 16 # 1 pint = 16 fl oz
                        volume_ml = volume_fl_oz * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                    elif unit == 'qt':
                        # Convert quarts to fl oz, then to mL, then to grams, then to lbs
                        volume_fl_oz = weight_val * 32 # 1 quart = 32 fl oz
                        volume_ml = volume_fl_oz * ML_PER_FL_OZ
                        mass_g = volume_ml * OLIVE_OIL_DENSITY_G_PER_ML
                        weight_lbs = mass_g / GRAMS_PER_LB
                    
                    if weight_lbs is not None:
                        updates.append("`Weight_LBS` = %s")
                        values.append(weight_lbs)
                except ValueError:
                    logging.warning(f"Could not convert weight '{data['weight']}' to float.")

            if not updates:
                self.send_json_response({'status': 'error', 'message': 'No fields to update'}, 400)
                conn.close()
                return
            
            values.append(item_id)
            query = f"UPDATE Inventory_Staging SET {', '.join(updates)} WHERE staging_id = %s"
            
            cursor = conn.cursor()
            cursor.execute(query, values)
            conn.commit()
            
            success = cursor.rowcount > 0
            cursor.close()
            conn.close()
            
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if success:
                print(f"\n[{timestamp}] 📱 Phone Scan - Staged item updated:")
                print(f"    Staging ID: {item_id}")
                print(f"    Updated fields: {', '.join(data.keys())}")
                if 'weight' in data:
                    print(f"    Original Weight: {data['weight']} {data.get('weight_unit', '')}")
                if weight_lbs is not None:
                    print(f"    Converted Weight (LBS): {weight_lbs:.3f} lbs")
                self.send_json_response({'status': 'success', 'message': 'Item updated'})
            else:
                print(f"\n[{timestamp}] 📱 Phone Scan - Error: Item {item_id} not found for update.")
                self.send_json_response({'status': 'error', 'message': 'Item not found'}, 404)
            
        except Exception as e:
            logging.error(f"Error updating staged item: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500) 
    def handle_phone_command(self, post_data):
        """Handle B/Q/E commands from phone"""
        global phone_scan_active
        try:
            data = json.loads(post_data.decode('utf-8'))
            command = data.get('command', '').lower()
            
            if command in ['b', 'back']:
                phone_scan_active = False
                self.send_json_response({'status': 'success', 'message': 'Returning to menu'})
            elif command in ['q', 'quit', 'e', 'exit']:
                self.send_json_response({'status': 'success', 'message': 'Shutting down'})
                threading.Timer(1.0, lambda: sys.exit(0)).start()
            else:
                self.send_json_response({'status': 'error', 'message': 'Invalid command'}, 400)
            
        except Exception as e:
            logging.error(f"Error processing phone command: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_phone_status(self):
        """Return current phone scan mode status"""
        global phone_scan_active
        try:
            status_msg = 'Phone Scan Mode Active' if phone_scan_active else 'Not in Phone Scan Mode'
            self.send_json_response({
                'status': 'success',
                'active': phone_scan_active,
                'message': status_msg
            })
        except Exception as e:
            logging.error(f"Error getting phone status: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_amazon_search(self):
        """Handle Amazon search via GET request"""
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            product_name = params.get('q', [''])[0]
            
            if not product_name:
                self.send_json_response({'status': 'error', 'message': 'Query required'}, 400)
                return
            
            price = get_price_from_amazon(product_name)
            self.send_json_response({'status': 'success', 'price': price})
            
        except Exception as e:
            logging.error(f"Error in Amazon search: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_amazon_search_post(self, post_data):
        """Handle Amazon search via POST request"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            product_name = data.get('product_name', '')
            
            if not product_name:
                self.send_json_response({'status': 'error', 'message': 'Product name required'}, 400)
                return
            
            price = get_price_from_amazon(product_name)
            self.send_json_response({'status': 'success', 'price': price})
            
        except Exception as e:
            logging.error(f"Error in Amazon search: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_upc_scan(self, post_data):
        """Handle UPC scan from phone"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            upc = data.get('upc', 'Unknown')
            
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            logging.info(f"[{timestamp}] Received UPC from phone: {upc}")
            
            with queue_lock:
                upc_queue.append({
                    'upc': upc,
                    'timestamp': timestamp
                })
            
            self.send_json_response({'status': 'success'})
            
        except Exception as e:
            logging.error(f"Error processing UPC scan: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 400)
    
    def handle_manual_upc(self, post_data):
        """Handle manual UPC entry from phone"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            upc = data.get('upc', '')
            
            if not upc or not upc.strip():
                self.send_json_response({'status': 'error', 'message': 'UPC required'}, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            # Process UPC - get product info (doesn't save to staging yet)
            result = process_upc_auto(conn, upc)
            conn.close()

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if result['status'] == 'success':
                product = result['product']
                print(f"\n[{timestamp}] 📱 Phone Scan - Product found:")
                print(f"    UPC: {product['upc']}")
                print(f"    Product Name: {product['product_name']}")
                if product.get('brand'):
                    print(f"    Brand: {product['brand']}")
                print(f"    BlackSheep #: {product['blacksheep_num']}")
                print(f"    Location: {product['location']}")
                if product.get('suggested_price'):
                    print(f"    Suggested Price: ${product['suggested_price']}")
                else:
                    print(f"    ⚠️  No price found - user must enter price")
            else:
                print(f"\n[{timestamp}] 📱 Phone Scan - Error: {result['message']}")

            self.send_json_response(result)
            
        except Exception as e:
            logging.error(f"Error processing manual UPC: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_list_staging(self):
        """Return list of all staged items WITH PHOTO INFO"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return

            cursor = conn.cursor()
            query = """
                SELECT s.staging_id, s.`Product Name`, s.`Upc#`, s.`blacksheep #`,
                       s.`location`, s.`Item Price subtotal`, s.`Date Listed`, s.`scanned_at`,
                       pm.photo1_path, pm.photo2_path, pm.photo3_path, pm.video_path
                FROM Inventory_Staging s
                LEFT JOIN Product_Media pm ON s.staging_id = pm.staging_id
                ORDER BY s.staging_id DESC
            """
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()

            items = []
            for row in results:
                # Count how many photos exist
                photo_count = 0
                if row[8]: photo_count += 1  # photo1
                if row[9]: photo_count += 1  # photo2
                if row[10]: photo_count += 1  # photo3

                has_video = bool(row[11])

                # Convert photo paths to URLs
                photo1_url = f'https://10.0.0.249:8443/{row[8]}' if row[8] else None
                photo2_url = f'https://10.0.0.249:8443/{row[9]}' if row[9] else None
                photo3_url = f'https://10.0.0.249:8443/{row[10]}' if row[10] else None
                video_url = f'https://10.0.0.249:8443/{row[11]}' if row[11] else None

                items.append({
                    'id': row[0],
                    'product_name': row[1],
                    'upc': row[2],
                    'blacksheep': row[3],
                    'location': row[4],
                    'price': str(row[5]),
                    'date_listed': str(row[6]),
                    'scanned_at': str(row[7]),
                    'photo_count': photo_count,
                    'has_video': has_video,
                    'photo1': photo1_url,
                    'photo2': photo2_url,
                    'photo3': photo3_url,
                    'video': video_url
                })

            self.send_json_response({'status': 'success', 'items': items})

        except Exception as e:
            logging.error(f"Error listing staging: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_list_inventory(self):
        """Return list of main inventory items with photos"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return

            cursor = conn.cursor()
            query = """
                SELECT i.`Product Name`, i.`Upc#`, i.`blacksheep #`,
                       i.`location`, i.`Item Price subtotal`, i.`Date Listed`,
                       pm.photo1_path, pm.photo2_path, pm.photo3_path
                FROM Inventory i
                LEFT JOIN Product_Media pm ON BINARY i.`Upc#` = BINARY pm.upc
                ORDER BY i.`Date Listed` DESC
                LIMIT 100
            """
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()

            items = []
            for row in results:
                # Get first available photo or use placeholder
                photo = row[6] or row[7] or row[8]

                # Convert local path to URL or use placeholder
                if photo and not photo.startswith('http'):
                    # Remove duplicate 'media/' prefix if present
                    if photo.startswith('media/media/'):
                        photo = photo[6:]
                    # Use HTTPS and correct port
                    photo = f'https://10.0.0.249:8443/{photo}'
                elif not photo:
                    photo = 'https://via.placeholder.com/100x100/000000/00ff88?text=No+Image'

                items.append({
                    'product_name': row[0],
                    'upc': row[1],
                    'blacksheep': row[2],
                    'location': row[3],
                    'price': str(row[4]),
                    'date_listed': str(row[5]),
                    'image': photo
                })

            self.send_json_response({'status': 'success', 'items': items})

        except Exception as e:
            logging.error(f"Error listing inventory: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_move_to_staging(self, post_data):
        """Move items from inventory back to staging"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            upcs = data.get('upcs', [])
            
            if not upcs:
                self.send_json_response({'status': 'error', 'message': 'No UPCs provided'}, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            cursor = conn.cursor()
            moved_count = 0
            
            for upc in upcs:
                # Copy from Inventory to Inventory_Staging
                insert_query = """
                    INSERT INTO Inventory_Staging (
                        `Product Name`, `Upc#`, `blacksheep #`, `location`,
                        `Product Number`, `Order Number`, `Dimmensions`, `Weight`,
                        `Buyer Name`, `Buyer Phone Number`, `Buyer Address`, `Buyer Email`,
                        `Buyer Paid`, `Item Price subtotal`, `Date Listed`, `Date Sold`,
                        `Shipping Order Total`, `Selling Costs`, `Sales  Tax`,
                        `Ad Fee General`, `Order Earnings`
                    )
                    SELECT 
                        `Product Name`, `Upc#`, `blacksheep #`, `location`,
                        `Product Number`, `Order Number`, `Dimmensions`, `Weight`,
                        `Buyer Name`, `Buyer Phone Number`, `Buyer Address`, `Buyer Email`,
                        `Buyer Paid`, `Item Price subtotal`, `Date Listed`, `Date Sold`,
                        `Shipping Order Total`, `Selling Costs`, `Sales  Tax`,
                        `Ad Fee General`, `Order Earnings`
                    FROM Inventory
                    WHERE `Upc#` = %s
                    LIMIT 1
                """
                cursor.execute(insert_query, (upc,))
                
                # Delete from Inventory
                delete_query = "DELETE FROM Inventory WHERE `Upc#` = %s"
                cursor.execute(delete_query, (upc,))
                
                if cursor.rowcount > 0:
                    moved_count += 1
            
            conn.commit()
            cursor.close()
            conn.close()
            
            self.send_json_response({
                'status': 'success',
                'message': f'Moved {moved_count} items to staging'
            })
            
        except Exception as e:
            logging.error(f"Error moving to staging: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_delete_staging(self, post_data):
        """Delete specific staged item"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            item_id = data.get('id')
            
            if not item_id:
                self.send_json_response({'status': 'error', 'message': 'ID required'}, 400)
                return
            
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Inventory_Staging WHERE staging_id = %s", (item_id,))
            conn.commit()
            
            success = cursor.rowcount > 0
            cursor.close()
            conn.close()
            
            if success:
                self.send_json_response({'status': 'success', 'message': f'Deleted item {item_id}'})
            else:
                self.send_json_response({'status': 'error', 'message': 'Item not found'}, 404)
            
        except Exception as e:
            logging.error(f"Error deleting staged item: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_import_all(self, post_data):
        """Import all staged items to main inventory"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            cursor = conn.cursor()
            
            # Count items
            cursor.execute("SELECT COUNT(*) FROM Inventory_Staging")
            count = cursor.fetchone()[0]
            
            if count == 0:
                self.send_json_response({'status': 'error', 'message': 'No items in staging'}, 400)
                cursor.close()
                conn.close()
                return
            
            # Import
            insert_query = """
                INSERT INTO Inventory (
                    `Product Name`, `Upc#`, `blacksheep #`, `location`,
                    `Product Number`, `Order Number`, `Dimmensions`, `Weight`,
                    `Buyer Name`, `Buyer Phone Number`, `Buyer Address`, `Buyer Email`,
                    `Buyer Paid`, `Item Price subtotal`, `Date Listed`, `Date Sold`,
                    `Shipping Order Total`, `Selling Costs`, `Sales  Tax`,
                    `Ad Fee General`, `Order Earnings`
                )
                SELECT 
                    `Product Name`, `Upc#`, `blacksheep #`, `location`,
                    `Product Number`, `Order Number`, `Dimmensions`, `Weight`,
                    `Buyer Name`, `Buyer Phone Number`, `Buyer Address`, `Buyer Email`,
                    `Buyer Paid`, `Item Price subtotal`, `Date Listed`, `Date Sold`,
                    `Shipping Order Total`, `Selling Costs`, `Sales  Tax`,
                    `Ad Fee General`, `Order Earnings`
                FROM Inventory_Staging
            """
            cursor.execute(insert_query)
            
            # Clear staging
            cursor.execute("DELETE FROM Inventory_Staging")
            conn.commit()
            cursor.close()
            conn.close()
            
            self.send_json_response({'status': 'success', 'message': f'Imported {count} items'})
            
        except Exception as e:
            logging.error(f"Error importing to inventory: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_clear_all(self, post_data):
        """Clear all staged items"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM Inventory_Staging")
            count = cursor.fetchone()[0]
            
            cursor.execute("DELETE FROM Inventory_Staging")
            conn.commit()
            cursor.close()
            conn.close()
            
            self.send_json_response({'status': 'success', 'message': f'Cleared {count} items'})
            
        except Exception as e:
            logging.error(f"Error clearing staging: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_export_csv(self):
        """Export staged items to CSV"""
        try:
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return
            
            cursor = conn.cursor()
            query = "SELECT * FROM Inventory_Staging"
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            cursor.close()
            conn.close()
            
            # Generate CSV
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(columns)
            writer.writerows(results)
            csv_data = output.getvalue()
            
            self.send_response(200)
            self.send_header('Content-Type', 'text/csv')
            self.send_header('Content-Disposition', 'attachment; filename="staged_items.csv"')
            self.end_headers()
            self.wfile.write(csv_data.encode())
            
        except Exception as e:
            logging.error(f"Error exporting CSV: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)
    
    def handle_media_upload(self, post_data):
        """Handle media file upload (photos and videos)"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            staging_id = data.get('staging_id')
            upc = data.get('upc')
            media_type = data.get('media_type')  # photo1, photo2, photo3, video
            file_data = data.get('file_data')  # base64 encoded

            if not all([staging_id, upc, media_type, file_data]):
                self.send_json_response({'status': 'error', 'message': 'Missing required fields'}, 400)
                return

            # Validate media_type
            valid_types = ['photo1', 'photo2', 'photo3', 'video']
            if media_type not in valid_types:
                self.send_json_response({'status': 'error', 'message': 'Invalid media type'}, 400)
                return

            # Get product name from staging table
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return

            cursor = conn.cursor()
            cursor.execute("SELECT `Product Name` FROM Inventory_Staging WHERE staging_id = %s", (staging_id,))
            result = cursor.fetchone()
            cursor.close()

            if not result:
                conn.close()
                self.send_json_response({'status': 'error', 'message': 'Product not found in staging'}, 404)
                return

            product_name = result[0]

            # Sanitize product name for filename (remove special characters, limit length)
            import re
            safe_product_name = re.sub(r'[^a-zA-Z0-9\s-]', '', product_name)
            safe_product_name = re.sub(r'\s+', '_', safe_product_name)[:50]  # Limit to 50 chars

            # Decode base64 data
            import base64
            try:
                file_bytes = base64.b64decode(file_data.split(',')[1] if ',' in file_data else file_data)
            except Exception as e:
                conn.close()
                self.send_json_response({'status': 'error', 'message': f'Invalid file data: {str(e)}'}, 400)
                return

            # Determine file extension and directory
            if media_type == 'video':
                extension = 'webm'  # or 'mp4' depending on what the frontend sends
                media_dir = 'media/videos'
            else:
                extension = 'jpg'
                media_dir = 'media'

            # Create media directories if they don't exist
            os.makedirs(media_dir, exist_ok=True)

            # Generate filename using product name
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{safe_product_name}_{media_type}_{timestamp}.{extension}"
            filepath = os.path.join(media_dir, filename)

            # Save file
            with open(filepath, 'wb') as f:
                f.write(file_bytes)

            # Update database (conn is already open from earlier)
            cursor = conn.cursor()

            # Check if record exists for this staging_id
            cursor.execute("SELECT media_id FROM Product_Media WHERE staging_id = %s", (staging_id,))
            result = cursor.fetchone()

            column_map = {
                'photo1': 'photo1_path',
                'photo2': 'photo2_path',
                'photo3': 'photo3_path',
                'video': 'video_path'
            }

            column_name = column_map[media_type]

            if result:
                # Update existing record
                query = f"UPDATE Product_Media SET {column_name} = %s WHERE staging_id = %s"
                cursor.execute(query, (filepath, staging_id))
            else:
                # Insert new record
                query = f"INSERT INTO Product_Media (staging_id, upc, {column_name}) VALUES (%s, %s, %s)"
                cursor.execute(query, (staging_id, upc, filepath))

            conn.commit()
            cursor.close()
            conn.close()

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n[{timestamp}] 📱 Phone Scan - Media uploaded:")
            print(f"    Product: {product_name}")
            print(f"    Staging ID: {staging_id}")
            print(f"    UPC: {upc}")
            print(f"    Media Type: {media_type}")
            print(f"    Filepath: {filepath}")

            self.send_json_response({
                'status': 'success',
                'message': f'{media_type} uploaded successfully',
                'filepath': filepath
            })

        except Exception as e:
            logging.error(f"Error uploading media: {e}")
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)

    def handle_generate_marketing_video(self, post_data):
        """Generate AI-edited marketing video from product video"""
        try:
            data = json.loads(post_data.decode('utf-8'))
            staging_id = data.get('staging_id')
            upc = data.get('upc')

            if not all([staging_id, upc]):
                self.send_json_response({'status': 'error', 'message': 'Missing required fields'}, 400)
                return

            # Get product info and video path from database
            conn = connect_to_database()
            if not conn:
                self.send_json_response({'status': 'error', 'message': 'Database error'}, 500)
                return

            cursor = conn.cursor()

            # Get product details from staging
            cursor.execute("SELECT `Product Name`, `Item Price subtotal` FROM Inventory_Staging WHERE staging_id = %s", (staging_id,))
            product_result = cursor.fetchone()

            if not product_result:
                cursor.close()
                conn.close()
                self.send_json_response({'status': 'error', 'message': 'Product not found'}, 404)
                return

            product_name = product_result[0]
            price = product_result[1]

            # Get video path
            cursor.execute("SELECT video_path FROM Product_Media WHERE staging_id = %s", (staging_id,))
            media_result = cursor.fetchone()

            cursor.close()
            conn.close()

            if not media_result or not media_result[0]:
                self.send_json_response({'status': 'error', 'message': 'No video found for this product'}, 404)
                return

            video_path = media_result[0]

            # Check if video file exists
            if not os.path.exists(video_path):
                self.send_json_response({'status': 'error', 'message': 'Video file not found on disk'}, 404)
                return

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n[{timestamp}] 🎬 AI Marketing Video Generation Started:")
            print(f"    Product: {product_name}")
            print(f"    Price: ${price}")
            print(f"    Input Video: {video_path}")

            # Import and run AI video editor
            from ai_video_editor import create_marketing_video

            result = create_marketing_video(video_path, product_name, str(price))

            if result['status'] == 'success':
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                print(f"\n[{timestamp}] ✅ AI Marketing Video Complete:")
                print(f"    Marketing Video: {result['video_path']}")
                print(f"    Thumbnail: {result['thumbnail_path']}")

                self.send_json_response({
                    'status': 'success',
                    'message': 'Marketing video generated successfully',
                    'video_path': result['video_path'],
                    'thumbnail_path': result['thumbnail_path']
                })
            else:
                self.send_json_response(result, 500)

        except Exception as e:
            logging.error(f"Error generating marketing video: {e}")
            import traceback
            traceback.print_exc()
            self.send_json_response({'status': 'error', 'message': str(e)}, 500)

    def serve_media_file(self):
        """Serve static media files (images, videos)"""
        import os
        import mimetypes

        # Remove leading slash and decode URL
        file_path = self.path[1:]  # Remove leading /

        if not os.path.exists(file_path):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')
            return

        # Get mime type
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = 'application/octet-stream'

        try:
            with open(file_path, 'rb') as f:
                content = f.read()

            self.send_response(200)
            self.send_header('Content-type', mime_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f'Error serving file: {str(e)}'.encode())

    def send_json_response(self, data, status=200):
        """Send JSON response with CORS headers"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass

def get_local_ip():
    """Get the local IP address of the server"""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def start_http_server():
    """Start HTTPS server in background thread"""
    try:
        server = HTTPServer(('0.0.0.0', HTTP_PORT), UPCHandler)
        server.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Wrap with SSL for HTTPS
        try:
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            context.load_cert_chain('cert.pem', 'key.pem')
            server.socket = context.wrap_socket(server.socket, server_side=True)
        except FileNotFoundError:
            logging.error("SSL certificates not found!")
            logging.error("Generate with: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes")
            sys.exit(1)
        
        server_ip = get_local_ip()
        
        print("\n" + "="*60)
        print(f"📱 HTTPS Server Started")
        print(f"   Listening on: https://{server_ip}:{HTTP_PORT}")
        print(f"   Open on phone: https://{server_ip}:{HTTP_PORT}")
        print(f"   (Accept security warning on first visit)")
        print("="*60 + "\n")
        
        server.serve_forever()
    except Exception as e:
        logging.error(f"Failed to start HTTPS server: {e}")

def safe_input(prompt):
    """Wrapper for input() that handles EOFError and KeyboardInterrupt"""
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        print("\n\n👋 Shutting down...")
        sys.exit(0)

def print_help_text():
    """Prints a standardized help message"""
    print("\n💡 Tip: Type 'b' or 'back' to return to the previous menu.")

def main():
    """Main function"""
    print("\n" + "="*60)
    print("🐑 BLACK SHEEP INVENTORY MANAGEMENT SYSTEM")
    print("="*60)
    
    # Start HTTPS server
    server_thread = threading.Thread(target=start_http_server, daemon=True)
    server_thread.start()
    time.sleep(1)
    
    # Connect to database
    conn = connect_to_database()
    if conn is None:
        logging.error("Failed to connect to database. Exiting.")
        return
    
    # Create staging table
    create_staging_table(conn)

    # Create product media table
    create_product_media_table(conn)
    
    # Main menu loop
    while True:
        print("\n" + "="*60)
        print("MAIN MENU")
        print("="*60)
        print("  1. Manual Mode - Enter UPCs manually")
        print("  2. Phone Scan Mode - Wait for phone scans")
        print("  3. Review Staged Items")
        print("  4. Quit")

        print("\n💡 Tip: Type 'q', 'quit', or 'e', 'exit' to quit anytime.")
        choice = safe_input("\nSelect option (1-4):")

        # Handle quit/exit commands
        if choice.lower() in ['q', 'quit', 'e', 'exit', '4']:
            print("\n👋 Shutting down...")
            break

        # BACK doesn't make sense at main menu, but handle it gracefully
        if choice.upper() == 'BACK' or choice.lower() == 'b':
            print("\n💡 You're already at the main menu. Use 'q' or '4' to quit.")
            continue

        try:
            if choice == '1':
                manual_mode(conn)
            elif choice == '2':
                phone_scan_mode(conn)
            elif choice == '3':
                review_staging_menu(conn)
            else:
                print("Invalid option.")

        except KeyboardInterrupt:
            print("\n\n👋 Shutting down...")
            break
    
    conn.close()
    logging.info("Database connection closed.")

if __name__ == "__main__":
    main()
