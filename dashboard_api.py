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
    # ... (existing CONTAINER_MAP content) ...
}

# Map app names to Python script paths (for Python scripts that run as services)
PYTHON_SERVICES = {
    'BarcodeScanner': {
        'script': 'inventory_script.py',
        'cwd': 'barcode_scanner/', # The directory where the script resides
        'port': 8443 # The port the Python script's server listens on
    },

}

# Dictionary to store Popen objects for Python services
PYTHON_PROCESSES = {}

def _start_python_service(app_name):
    """Starts a Python script as a background process."""
    service_info = PYTHON_SERVICES.get(app_name)
    if not service_info:
        return False, "Service not configured"

    script_path = service_info['script']
    cwd = os.path.join(app.root_path, service_info['cwd']) # Use Flask app's root path

    # Check if process is already running
    for p in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if script_path in ' '.join(p.info['cmdline'] or []) and p.cwd() == cwd:
                app.logger.info(f"Python service {app_name} already running.")
                PYTHON_PROCESSES[app_name] = p # Store existing process
                return True, "Service already running"
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    app.logger.info(f"Starting Python service {app_name} from {cwd}...")
    try:
        # Use subprocess.Popen to run in background
        # IMPORTANT: Redirect stdout/stderr to files to prevent blocking
        stdout_file = open(os.path.join(cwd, f'{app_name}_stdout.log'), 'a')
        stderr_file = open(os.path.join(cwd, f'{app_name}_stderr.log'), 'a')

        process = subprocess.Popen(
            ['python3', script_path],
            cwd=cwd,
            stdout=stdout_file,
            stderr=stderr_file,
            preexec_fn=os.setsid # Detach from parent process group
        )
        PYTHON_PROCESSES[app_name] = process
        app.logger.info(f"Python service {app_name} started with PID: {process.pid}")
        return True, "Service started"
    except Exception as e:
        app.logger.error(f"Failed to start Python service {app_name}: {e}")
        return False, str(e)

def _stop_python_service(app_name):
    """Stops a running Python script process."""
    if app_name in PYTHON_PROCESSES and PYTHON_PROCESSES[app_name].poll() is None:
        app.logger.info(f"Stopping Python service {app_name} with PID: {PYTHON_PROCESSES[app_name].pid}")
        try:
            # Terminate the process and its children
            pgid = os.getpgid(PYTHON_PROCESSES[app_name].pid)
            os.killpg(pgid, 15) # Send SIGTERM to process group
            PYTHON_PROCESSES[app_name].wait(timeout=5)
            app.logger.info(f"Python service {app_name} stopped.")
            del PYTHON_PROCESSES[app_name]
            return True, "Service stopped"
        except Exception as e:
            app.logger.error(f"Failed to stop Python service {app_name}: {e}")
            return False, str(e)
    elif app_name in PYTHON_PROCESSES:
        app.logger.info(f"Python service {app_name} was not running.")
        del PYTHON_PROCESSES[app_name]
        return True, "Service not running"
    else:
        app.logger.info(f"Python service {app_name} not found in tracked processes.")
        # Attempt to find and kill by name if not tracked (e.g., after restart)
        script_name = PYTHON_SERVICES[app_name]['script']
        cwd_target = os.path.join(app.root_path, PYTHON_SERVICES[app_name]['cwd'])

        for p in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if script_name in ' '.join(p.info['cmdline'] or []) and p.cwd() == cwd_target:
                    app.logger.warning(f"Found untracked Python service {app_name} with PID {p.pid}. Terminating.")
                    p.terminate()
                    p.wait(timeout=5)
                    return True, "Untracked service stopped"
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return False, "Service not running or failed to stop"


@app.route('/api/status/<app_name>', methods=['GET'])
def check_status(app_name):
    """Check if a service is running (Docker, Python, or system)."""
    # Check Python services first
    if app_name in PYTHON_SERVICES:
        service_info = PYTHON_SERVICES[app_name]
        script_path = service_info['script']
        cwd = os.path.join(app.root_path, service_info['cwd'])
        for p in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                # Check if the process is a Python interpreter running our script in the correct directory
                if 'python' in p.info['name'].lower() and script_path in ' '.join(p.info['cmdline'] or []) and p.cwd() == cwd:
                    PYTHON_PROCESSES[app_name] = p # Track it if found
                    return jsonify({'status': 'running', 'app': app_name, 'type': 'python'})
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return jsonify({'status': 'off', 'app': app_name, 'type': 'python'})

    # Fallback to system services
    if app_name in SYSTEM_SERVICES:
        # Existing logic for system services
        service_name = SYSTEM_SERVICES[app_name]
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if service_name.lower() in ' '.join(proc.info['cmdline'] or []).lower() or service_name.lower() in proc.info['name'].lower():
                    return jsonify({'status': 'running', 'app': app_name, 'type': 'system'})
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return jsonify({'status': 'off', 'app': app_name, 'type': 'system'})

    # Fallback to Docker containers
    container_name = CONTAINER_MAP.get(app_name, app_name.lower())
    if client:
        try:
            container = client.containers.get(container_name)
            status = 'running' if container.status == 'running' else 'off'
            return jsonify({'status': status, 'app': app_name, 'type': 'docker'})
        except docker.errors.NotFound:
            pass # Continue to VM check
        except Exception as e:
            app.logger.error(f"Error checking Docker container {app_name}: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    
    # Fallback to checking if it's a VM (last resort)
    if app_name in VM_MAP:
        return jsonify({'status': 'off', 'app': app_name, 'is_vm': True, 'type': 'vm'})
    
    return jsonify({'status': 'unknown', 'message': 'Service not found or configured'}), 404


@app.route('/api/toggle/<app_name>', methods=['POST'])
def toggle_service(app_name):
    """Toggle a service on/off (Python, Docker, or system)."""
    # Check Python services first
    if app_name in PYTHON_SERVICES:
        status_response = check_status(app_name) # Call the updated check_status
        current_status = status_response.json['status']

        if current_status == 'running':
            success, message = _stop_python_service(app_name)
            new_status = 'off' if success else current_status
        else:
            success, message = _start_python_service(app_name)
            new_status = 'running' if success else current_status

        return jsonify({'status': new_status, 'app': app_name, 'success': success, 'message': message, 'type': 'python'})

    # Fallback to system services (existing logic)
    if app_name in SYSTEM_SERVICES:
        # For system services, we can't easily start/stop them via API
        # Just return current status (they need to be managed manually)
        current_status = 'off'
        service_name = SYSTEM_SERVICES[app_name]
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if service_name.lower() in ' '.join(proc.info['cmdline'] or []).lower() or service_name.lower() in proc.info['name'].lower():
                    current_status = 'running'
                    break
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return jsonify({'status': current_status, 'app': app_name, 'success': True, 'message': 'System service status checked (manual management required)', 'type': 'system'})

    # Fallback to Docker containers (existing logic)
    container_name = CONTAINER_MAP.get(app_name, app_name.lower())
    if client:
        try:
            container = client.containers.get(container_name)
            if container.status == 'running':
                container.stop()
                new_status = 'off'
            else:
                container.start()
                new_status = 'running'
            return jsonify({'status': new_status, 'app': app_name, 'success': True, 'type': 'docker'})
        except docker.errors.NotFound:
            return jsonify({'error': 'Container not found', 'type': 'docker'}), 404
        except Exception as e:
            return jsonify({'error': str(e), 'type': 'docker'}), 500
    
    return jsonify({'status': 'error', 'message': 'Service type not supported or Docker client not available'}), 500

# Proxy endpoint for BarcodeScanner API
@app.route('/api/barcode_scanner/<path:subpath>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy_barcode_scanner_api(subpath):
    barcode_scanner_port = PYTHON_SERVICES['BarcodeScanner']['port']
    # Ensure BarcodeScanner is actually running
    status_response = check_status('BarcodeScanner')
    if status_response.json['status'] != 'running':
        return jsonify({'status': 'error', 'message': 'Barcode Scanner service is not running.'}), 503

    target_url = f"https://localhost:{barcode_scanner_port}/api/{subpath}"
    
    headers = {key: value for key, value in request.headers if key != 'Host'}
    
    try:
        if request.method == 'GET':
            resp = requests.get(target_url, params=request.args, headers=headers, verify=False)
        elif request.method == 'POST':
            resp = requests.post(target_url, data=request.get_data(), headers=headers, verify=False)
        elif request.method == 'PUT':
            resp = requests.put(target_url, data=request.get_data(), headers=headers, verify=False)
        elif request.method == 'DELETE':
            resp = requests.delete(target_url, data=request.get_data(), headers=headers, verify=False)
        else:
            return jsonify({'error': 'Method not allowed'}), 405
        
        # Forward response from the barcode scanner server
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        resp_headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]
        
        return Response(resp.content, resp.status_code, resp_headers)

    except requests.exceptions.ConnectionError:
        return jsonify({'status': 'error', 'message': f'Could not connect to Barcode Scanner service at {target_url}. It might not be running or is unreachable.'}), 503
    except Exception as e:
        app.logger.error(f"Error proxying request to Barcode Scanner: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products from products.json or proxy to BarcodeScanner API."""
    # First, try to proxy the request to the BarcodeScanner if it's running
    status_response = check_status('BarcodeScanner')
    if status_response.json['status'] == 'running':
        barcode_scanner_port = PYTHON_SERVICES['BarcodeScanner']['port']
        target_url = f"https://localhost:{barcode_scanner_port}/api/products"
        try:
            resp = requests.get(target_url, params=request.args, verify=False)
            # Forward response from the barcode scanner server
            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            resp_headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]
            return Response(resp.content, resp.status_code, resp_headers)
        except requests.exceptions.ConnectionError:
            app.logger.warning("Barcode Scanner is running but /api/products endpoint is unreachable. Falling back to local products.json.")
        except Exception as e:
            app.logger.error(f"Error proxying /api/products to Barcode Scanner: {e}. Falling back to local products.json.")

    # Fallback to existing products.json logic if BarcodeScanner is not running or proxy fails
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

@app.route('/api/ebay/notifications', methods=['GET'])
def get_ebay_notifications():
    # Proxy this request to the BarcodeScanner service
    status_response = check_status('BarcodeScanner')
    if status_response.json['status'] == 'running':
        barcode_scanner_port = PYTHON_SERVICES['BarcodeScanner']['port']
        target_url = f"https://localhost:{barcode_scanner_port}/api/ebay/notifications"
        try:
            resp = requests.get(target_url, params=request.args, verify=False)
            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            resp_headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]
            return Response(resp.content, resp.status_code, resp_headers)
        except requests.exceptions.ConnectionError:
            return jsonify({'status': 'error', 'message': 'Could not connect to Barcode Scanner service for eBay notifications.'}), 503
        except Exception as e:
            app.logger.error(f"Error proxying eBay notifications to Barcode Scanner: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    return jsonify({'status': 'error', 'message': 'Barcode Scanner service is not running.'}), 503

@app.route('/api/ebay/endpoint-status', methods=['GET'])
def get_ebay_endpoint_status():
    # Proxy this request to the BarcodeScanner service
    status_response = check_status('BarcodeScanner')
    if status_response.json['status'] == 'running':
        barcode_scanner_port = PYTHON_SERVICES['BarcodeScanner']['port']
        target_url = f"https://localhost:{barcode_scanner_port}/api/ebay/endpoint-status"
        try:
            resp = requests.get(target_url, params=request.args, verify=False)
            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            resp_headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]
            return Response(resp.content, resp.status_code, resp_headers)
        except requests.exceptions.ConnectionError:
            return jsonify({'status': 'error', 'message': 'Could not connect to Barcode Scanner service for eBay endpoint status.'}), 503
        except Exception as e:
            app.logger.error(f"Error proxying eBay endpoint status to Barcode Scanner: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    return jsonify({'status': 'error', 'message': 'Barcode Scanner service is not running.'}), 503

@app.route('/api/ebay/config', methods=['GET'])
def get_ebay_config():
    # Proxy this request to the BarcodeScanner service
    status_response = check_status('BarcodeScanner')
    if status_response.json['status'] == 'running':
        barcode_scanner_port = PYTHON_SERVICES['BarcodeScanner']['port']
        target_url = f"https://localhost:{barcode_scanner_port}/api/ebay/config"
        try:
            resp = requests.get(target_url, params=request.args, verify=False)
            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            resp_headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]
            return Response(resp.content, resp.status_code, resp_headers)
        except requests.exceptions.ConnectionError:
            return jsonify({'status': 'error', 'message': 'Could not connect to Barcode Scanner service for eBay config.'}), 503
        except Exception as e:
            app.logger.error(f"Error proxying eBay config to Barcode Scanner: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    return jsonify({'status': 'error', 'message': 'Barcode Scanner service is not running.'}), 503


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
