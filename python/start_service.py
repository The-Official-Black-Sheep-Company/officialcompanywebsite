#!/usr/bin/env python3
"""
Script to start a specific service via the Dashboard API and open it in browser
"""

import requests
import time
import sys
import webbrowser
import argparse

# Base URL for the API
API_BASE_URL = 'http://localhost:5004/api'

# Port mappings for services
PORT_MAP = {
    'Jellyfin': '8096',
    'Glances': '61208',
    'LeonAI': '8080',
    'NodeRED': '1880',
    'HomeAssistant': '8123',
    'N8N': '5678',
    'Netdata': '19999',
    'Chatwoot': '3000',
    'Rasa': '8000',
    'SocioBoard': '8085',
    'Synapse': '8008',
    'Elasticsearch': '9200',
    'Kibana': '5601',
    'Keycloak': '8090',
    'Huginn': '3000',
    'Mautic': '8071',
    'Odoo': '8069',
    'OrangeHRM': '8899',
    'SuiteCRM': '8074',
    'TimeTrex': '8072',
    'BibleServer': '8081',
    'Emotion': '8084',
    'GIMP': '8086',
    'Inkscape': '8087',
    'pfSense': '443',
    'OMV': '80',
    'BarcodeScanner': '8444',
    'ScannerDisplay': '8443',
    'WazuhManager': '443',
    'Kubernetes': '8001',
    'Cockpit': '9090',
    'Grafana': '3000',
    'Homepage': '7912',
    'Jenkins': '7234',
    # Add more as needed
}

def start_service(app_name):
    """Start a service via API"""
    try:
        url = f"{API_BASE_URL}/toggle/{app_name}"
        response = requests.post(url, timeout=30)

        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'running':
                print(f"✓ Service {app_name} is now running")
                return True, data.get('message', '')
            else:
                print(f"✗ Failed to start {app_name}: {data}")
                return False, data.get('message', 'Failed to start')
        else:
            print(f"✗ HTTP error for {app_name}: {response.status_code}")
            return False, f"HTTP {response.status_code}"
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error for {app_name}: {e}")
        return False, str(e)
    except Exception as e:
        print(f"✗ Unexpected error for {app_name}: {e}")
        return False, str(e)

def open_service_in_browser(app_name):
    """Open the service in a new browser tab"""
    port = PORT_MAP.get(app_name)
    if not port:
        print(f"⚠ No port mapping found for {app_name}")
        return

    # Assume localhost for now, adjust if needed
    url = f"http://localhost:{port}"
    print(f"Opening {app_name} at {url}")
    webbrowser.open_new_tab(url)

def main():
    parser = argparse.ArgumentParser(description='Start a service and open it in browser')
    parser.add_argument('app_name', help='Name of the app to start')
    parser.add_argument('--no-browser', action='store_true', help='Do not open browser after starting')

    args = parser.parse_args()

    print(f"Starting service: {args.app_name}")
    print("-" * 40)

    success, message = start_service(args.app_name)

    if success:
        print(f"Service started successfully: {message}")
        if not args.no_browser:
            time.sleep(2)  # Wait a bit for service to be ready
            open_service_in_browser(args.app_name)
        print("✓ Done!")
        sys.exit(0)
    else:
        print(f"✗ Failed to start service: {message}")
        sys.exit(1)

if __name__ == '__main__':
    main()
