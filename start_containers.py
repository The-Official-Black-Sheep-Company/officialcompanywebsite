#!/usr/bin/env python3
"""
Script to start all Docker containers via the Dashboard API
"""

import requests
import time
import sys

# Base URL for the API
API_BASE_URL = 'http://localhost:5004/api'

# List of app names to start (excluding VMs)
APPS_TO_START = [
    'Chatwoot', 'LeonAI', 'NodeRED', 'Jellyfin', 'HomeAssistant', 'N8N', 'Netdata', 'Glances',
    'Rasa', 'WazuhManager', 'Elasticsearch', 'Kibana', 'Huginn', 'Mautic',
    'SuiteCRM', 'TimeTrex', 'Odoo', 'Matrix', 'Synapse', 'SocioBoard', 'Motion', 'Snort',
    'Fail2Ban', 'Falco', 'Filebeat', 'Pcsx2', 'WireGuard', 'Dovecot', 'Postfix',
    'Audacity', 'BibleServer', 'Cakewalk', 'Emotion', 'GIMP', 'Inkscape',
    'BoxBilling', 'ERPNext', 'FireflyIII', 'Magento2', 'OrangeHRM', 'PartsKeeper', 'Spree',
    'BarcodeScanner', 'ScannerDisplay', 'WazuhAgent1', 'WazuhAgent2', 'GlancesAgent1', 'Kubernetes',
    'Cockpit', 'Grafana', 'Homepage', 'Jenkins'
]

def start_container(app_name):
    """Start a single container via API"""
    try:
        url = f"{API_BASE_URL}/toggle/{app_name}"
        response = requests.post(url, timeout=30)

        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'running':
                print(f"✓ Started {app_name}")
                return True
            else:
                print(f"✗ Failed to start {app_name}: {data}")
                return False
        else:
            print(f"✗ HTTP error for {app_name}: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error for {app_name}: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error for {app_name}: {e}")
        return False

def main():
    """Start all containers"""
    print("Starting all containers via Dashboard API...")
    print(f"API URL: {API_BASE_URL}")
    print("-" * 50)

    started_count = 0
    failed_count = 0

    for app_name in APPS_TO_START:
        if start_container(app_name):
            started_count += 1
        else:
            failed_count += 1

        # Small delay between requests to avoid overwhelming the API
        time.sleep(0.5)

    print("-" * 50)
    print(f"Summary: {started_count} started, {failed_count} failed")

    if failed_count > 0:
        print("Some containers failed to start. Check the API server and container names.")
        sys.exit(1)
    else:
        print("All containers started successfully!")

if __name__ == '__main__':
    main()
