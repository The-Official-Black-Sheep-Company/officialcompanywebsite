#!/usr/bin/env python3
"""
Dashboard API Backend
Checks service status and controls Docker containers
"""

import http.server
import json
import socket
import subprocess
import os
from urllib.parse import urlparse

HOST = '0.0.0.0'
PORT = 5004

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

# Map app names to their ports
PORT_MAP = {
    # Dashboards
    'Cockpit': 9090,
    'Glances': 61208,
    'Grafana': 3000,
    'Homepage': 7912,
    'Jenkins': 7234,
    'Kibana': 5601,
    'Kubernetes': 8001,
    'Netdata': 19999,
    'ProductScanner': 8082,

    # Security & Monitoring
    'Falco': 8765,
    'Motion': 8765,
    'WireGuard': 51820,
    'Elasticsearch': 9200,
    'Keycloak': 8090,
    'OpenVAS': 9392,
    'WazuhManager': 443,
    'pfSense': 443,

    # Communication
    'Chatwoot': 3000,
    'Matrix': 8448,
    'Rasa': 8000,
    'Synapse': 8008,
    'SocioBoard': 8085,

    # Business Software
    'ERPNext': 8100,
    'Huginn': 3001,
    'Magento2': 8070,
    'Mautic': 8071,
    'Odoo': 8069,
    'PartsKeeper': 8073,
    'Spree': 3002,
    'SuiteCRM': 8074,
    'TimeTrex': 8072,

    # Creative Apps
    'Audacity': 8088,
    'BibleServer': 8081,
    'Cakewalk': 8089,
    'Emotion': 8084,
    'GIMP': 8086,
    'Inkscape': 8087,

    # Home & Media
    'HomeAssistant': 8123,
    'Jellyfin': 8096,
    'LeonAI': 8080,
    'N8N': 5678,
    'NodeRED': 1880,
}


class DashboardAPIHandler(http.server.BaseHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip('/').split('/')

        # Handle /api/products
        if parsed.path == '/api/products':
            self.get_products()
        # Handle /api/status/{appName}
        elif len(path_parts) >= 3 and path_parts[0] == 'api' and path_parts[1] == 'status':
            app_name = path_parts[2]
            self.check_status(app_name)
        else:
            self.send_error(404, 'Not Found')

    def do_POST(self):
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip('/').split('/')

        # Handle /api/toggle/{appName}
        if len(path_parts) >= 3 and path_parts[0] == 'api' and path_parts[1] == 'toggle':
            app_name = path_parts[2]
            self.toggle_service(app_name)
        # Handle /api/vm/start/{vmName}
        elif len(path_parts) >= 4 and path_parts[0] == 'api' and path_parts[1] == 'vm' and path_parts[2] == 'start':
            vm_name = path_parts[3]
            self.start_vm(vm_name)
        else:
            self.send_error(404, 'Not Found')

    def check_status(self, app_name):
        """Check if a service is running by checking its port."""
        port = PORT_MAP.get(app_name, 0)
        container = CONTAINER_MAP.get(app_name, app_name.lower())

        # Try port first, then fallback to container check
        if port:
            is_running = self.is_port_in_use(port)
            # If port check fails, try container check as fallback
            if not is_running and container:
                is_running = self.is_container_running(container)
        else:
            # No port defined, check Docker container status
            is_running = self.is_container_running(container)

        status = 'running' if is_running else 'off'
        self.send_json({'status': status, 'app': app_name, 'port': port})

    def toggle_service(self, app_name):
        """Toggle a service on/off."""
        port = PORT_MAP.get(app_name, 0)
        container = CONTAINER_MAP.get(app_name, app_name.lower())

        # Check current status
        if port:
            is_running = self.is_port_in_use(port)
        else:
            is_running = self.is_container_running(container)

        if is_running:
            # Stop the service
            success = self.stop_container(container)
            new_status = 'off' if success else 'running'
        else:
            # Start the service
            success = self.start_container(container)
            new_status = 'running' if success else 'off'

        self.send_json({'status': new_status, 'app': app_name, 'success': success})

    def get_products(self):
        """Get products from products.json."""
        try:
            with open('products.json', 'r') as f:
                products = json.load(f)
            self.send_json(products)
        except FileNotFoundError:
            self.send_error(404, 'Products file not found')
        except json.JSONDecodeError:
            self.send_error(500, 'Error decoding products JSON')

    def is_port_in_use(self, port):
        """Check if a port is in use."""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            result = s.connect_ex(('127.0.0.1', port))
            return result == 0

    def is_container_running(self, container_name):
        """Check if a Docker container is running."""
        try:
            result = subprocess.run(
                ['docker', 'inspect', '-f', '{{.State.Running}}', container_name],
                capture_output=True, text=True, timeout=5
            )
            return result.stdout.strip() == 'true'
        except:
            return False

    def start_container(self, container_name):
        """Start a Docker container."""
        try:
            result = subprocess.run(
                ['docker', 'start', container_name],
                capture_output=True, text=True, timeout=30
            )
            return result.returncode == 0
        except:
            return False

    def stop_container(self, container_name):
        """Stop a Docker container."""
        try:
            result = subprocess.run(
                ['docker', 'stop', container_name],
                capture_output=True, text=True, timeout=30
            )
            return result.returncode == 0
        except:
            return False

    def is_vm_running(self, vm_name):
        """Check if a VirtualBox VM is running."""
        try:
            result = subprocess.run(
                ['vboxmanage', 'showvminfo', vm_name, '--machinereadable'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                for line in result.stdout.split('\n'):
                    if line.startswith('VMState='):
                        state = line.split('=')[1].strip('"')
                        return state == 'running'
            return False
        except:
            return False

    def start_vm(self, vm_button_name):
        """Start a VirtualBox VM."""
        vm_name = VM_MAP.get(vm_button_name)
        if not vm_name:
            self.send_json({'success': False, 'error': 'Unknown VM', 'vm': vm_button_name})
            return

        # Check if already running
        if self.is_vm_running(vm_name):
            self.send_json({'success': True, 'status': 'already_running', 'vm': vm_button_name})
            return

        try:
            # Start the VM headless
            result = subprocess.run(
                ['DISPLAY=:0', 'vboxmanage', 'startvm', vm_name, '--type', 'headless'],
                capture_output=True, text=True, timeout=30, shell=True
            )
            success = result.returncode == 0
            self.send_json({
                'success': success,
                'status': 'started' if success else 'failed',
                'vm': vm_button_name,
                'output': result.stdout if success else result.stderr
            })
        except Exception as e:
            self.send_json({'success': False, 'error': str(e), 'vm': vm_button_name})

    def send_json(self, data):
        """Send JSON response with CORS headers."""
        response = json.dumps(data).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        print(f"[DashboardAPI] {args[0]}")


def main():
    server = http.server.HTTPServer((HOST, PORT), DashboardAPIHandler)
    print(f"""
╔════════════════════════════════════════════╗
║       Dashboard API Server                 ║
╠════════════════════════════════════════════╣
║  Running on: http://0.0.0.0:{PORT}            ║
║  Endpoints:                                ║
║    GET  /api/status/{{app}}                 ║
║    POST /api/toggle/{{app}}                 ║
╚════════════════════════════════════════════╝
    """)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.shutdown()


if __name__ == '__main__':
    main()
