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

app = Flask(__name__)
CORS(app)

# Initialize Docker client
try:
    client = docker.from_env()
except Exception as e:
    print(f"Error connecting to Docker: {e}")
    client = None

# Map app names to their Docker container names
CONTAINER_MAP = {
    'Chatwoot': 'chatwoot_rails',
    'LeonAI': 'leon',
    'NodeRED': 'nodered',
    'Jellyfin': 'jellyfin',
    'HomeAssistant': 'homeassistant',
    'N8N': 'n8n',
    'Netdata': 'netdata',
    'Glances': 'glances',
    'Rasa': 'rasa-router',
    'WazuhManager': 'wazuh-manager',
    'Elasticsearch': 'elasticsearch',
    'Kibana': 'kibana',
    'Keycloak': 'keycloak',
    'Huginn': 'huginn',
    'Mautic': 'mautic',
    'SuiteCRM': 'suitecrm',
    'TimeTrex': 'timetrex',
    'Odoo': 'odoo',
    'Matrix': 'synapse',
    'Synapse': 'synapse',
    'SocioBoard': 'socioboard',
    'Motion': 'motion',
    'Snort': 'snort',
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

if __name__ == '__main__':
    # Running on port 5004 as expected by the plan
    app.run(host='0.0.0.0', port=5004, debug=True)
