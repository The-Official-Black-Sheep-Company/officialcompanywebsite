#!/usr/bin/env python3
"""
Dashboard API Backend (Flask version)
Checks service status and controls Docker containers
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import docker
import json
import socket
import os
import subprocess
import psutil
import notification_utils


app = Flask(__name__)
CORS(app)

# Initialize Docker client
try:
    client = docker.from_env()
except Exception as e:
    print(f"Error connecting to Docker: {e}")
    client = None

# Map app names to their Docker container names (for containerized services)
CONTAINER_MAP = {
    # Home Server Main
    'Fail2Ban': 'fail2ban',
    'Falco': 'falco',
    'Filebeat': 'filebeat',
    'LeonAI': 'leon',
    'Motion': 'motion',
    'N8N': 'n8n',
    'Netdata': 'netdata',
    'NodeRED': 'nodered',
    'Pcsx2': 'pcsx2',
    'Snort': 'snort',
    'WireGuard': 'wireguard',

    # Mail Server
    'Chatwoot': 'chatwoot_rails',
    'Dovecot': 'dovecot',
    'Matrix': 'synapse',
    'Postfix': 'postfix',
    'Rasa': 'rasa-router',
    'SocioBoard': 'socioboard',
    'Synapse': 'synapse',

    # Cloud Server
    'Elasticsearch': 'elasticsearch',
    'Keycloak': 'keycloak',
    'Kibana': 'kibana',
    'OpenVAS': 'openvas',

    # Business Server
    'BoxBilling': 'boxbilling',
    'ERPNext': 'erpnext',
    'FireflyIII': 'fireflyiii',
    'Huginn': 'huginn',
    'Magento2': 'magento2',
    'Mautic': 'mautic',
    'Odoo': 'odoo',
    'OrangeHRM': 'orangehrm',
    'PartsKeeper': 'partskeeper',
    'Spree': 'spree',
    'SuiteCRM': 'suitecrm',
    'TimeTrex': 'timetrex',

    # Arts Server
    'Audacity': 'audacity',
    'BibleServer': 'bible-server',
    'Cakewalk': 'cakewalk',
    'Emotion': 'emotion',
    'GIMP': 'gimp',
    'Inkscape': 'inkscape',

    # Home Assistant Server
    'HomeAssistant': 'homeassistant',

    # pfSense Server
    'pfSense': 'pfsense',

    # OMV Server
    'OMV': 'omv',

    # Service Dashboard
    'BarcodeScanner': 'barcode-scanner',
    'ScannerDisplay': 'scanner-display',

    # Monitoring
    'WazuhManager': 'wazuh-manager',
    'WazuhAgent1': 'wazuh-agent1',
    'WazuhAgent2': 'wazuh-agent2',
    'GlancesAgent1': 'glances-agent1',
    'Kubernetes': 'kubernetes',

    # Dashboards
    'Cockpit': 'cockpit',
    'Grafana': 'grafana',
    'Homepage': 'homepage',
    'Jenkins': 'jenkins',
}

# System services that are installed on the host (not containers)
SYSTEM_SERVICES = {
    'Glances': 'glances',
    'Jellyfin': 'jellyfin',
    # Add other system services here as needed
}

# Map VM button names to VirtualBox VM names
VM_MAP = {
    'DebianServer': 'debian',
    'HomeAssistant': 'HomeAssistant',
    'OMV': 'OpenMediaVault',
    'pfSense': 'PFSense_',
}

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products from products.json."""
    try:
        # Check current dir first, then one level up (if running in container)
        paths = ['products.json', '../products.json']
        products_file = None
        for p in paths:
            if os.path.exists(p):
                products_file = p
                break
        
        if not products_file:
            return jsonify({'error': 'Products file not found'}), 404
            
        with open(products_file, 'r') as f:
            products = json.load(f)
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status/<app_name>', methods=['GET'])
def check_status(app_name):
    """Check if a service is running using Docker client."""
    container_name = CONTAINER_MAP.get(app_name, app_name.lower())
    
    if not client:
        return jsonify({'status': 'error', 'message': 'Docker client not available'}), 500

    try:
        container = client.containers.get(container_name)
        status = 'running' if container.status == 'running' else 'off'
        return jsonify({'status': status, 'app': app_name})
    except docker.errors.NotFound:
        # Fallback to checking if it's a VM
        if app_name in VM_MAP:
            return jsonify({'status': 'off', 'app': app_name, 'is_vm': True})
        return jsonify({'status': 'off', 'message': 'Container not found', 'app': app_name})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/toggle/<app_name>', methods=['POST'])
def toggle_service(app_name):
    """Toggle a service on/off."""
    # Check if it's a system service (installed on host)
    if app_name in SYSTEM_SERVICES:
        try:
            service_name = SYSTEM_SERVICES[app_name]
            # For system services, we can't easily start/stop them via API
            # Just return current status (they need to be managed manually)
            current_status = 'off'
            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                try:
                    if service_name.lower() in ' '.join(proc.info['cmdline'] or []).lower() or service_name.lower() in proc.info['name'].lower():
                        current_status = 'running'
                        break
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            return jsonify({'status': current_status, 'app': app_name, 'success': True, 'message': 'System service status checked (manual management required)'})
        except Exception as e:
            return jsonify({'error': f'Error checking system service: {str(e)}'}), 500

    # Handle containerized services
    container_name = CONTAINER_MAP.get(app_name, app_name.lower())

    if not client:
        return jsonify({'error': 'Docker client not available'}), 500

    try:
        container = client.containers.get(container_name)
        if container.status == 'running':
            container.stop()
            new_status = 'off'
        else:
            container.start()
            new_status = 'running'
        return jsonify({'status': new_status, 'app': app_name, 'success': True})
    except docker.errors.NotFound:
        return jsonify({'error': 'Container not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vm/start/<vm_name>', methods=['POST'])
def start_vm(vm_name):
    """Start a VirtualBox VM (requires host access)."""
    # NOTE: This might not work if backend is inside a container without special configuration
    vbox_name = VM_MAP.get(vm_name)
    if not vbox_name:
        return jsonify({'success': False, 'error': 'Unknown VM'}), 404

    try:
        # This will only work if vboxmanage is in the path and accessible
        result = subprocess.run(
            ['vboxmanage', 'startvm', vbox_name, '--type', 'headless'],
            capture_output=True, text=True, timeout=30
        )
        success = result.returncode == 0
        return jsonify({
            'success': success,
            'status': 'started' if success else 'failed',
            'vm': vm_name
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/notify/member_signup', methods=['POST'])
def notify_member_signup():
    """Trigger notifications for a new member."""
    try:
        data = request.json
        username = data.get('username', 'Unknown')
        email = data.get('email', 'Unknown')
        
        result = notification_utils.notify_new_member(email, username)
        
        return jsonify({
            'success': True,
            'result': result
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Retrieve all messages."""
    try:
        messages_file = 'messages.json'
        # Check parent dir if not found (simulating dev env checks)
        if not os.path.exists(messages_file) and os.path.exists('../messages.json'):
            messages_file = '../messages.json'
            
        if os.path.exists(messages_file):
            with open(messages_file, 'r') as f:
                messages = json.load(f)
            return jsonify(messages)
        else:
            return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Running on port 5004 as expected by the plan
    app.run(host='0.0.0.0', port=5004, debug=True)
