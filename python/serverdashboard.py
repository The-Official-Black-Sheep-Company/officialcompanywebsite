# Conceptual Python Backend Script (app_manager.py)
# NOTE: Replace the values in CONTAINER_MAP with your actual Docker container names.

from flask import Flask, jsonify, request
import docker
from flask_cors import CORS # Required to allow your HTML on port 80 to talk to this app on port 5000

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
try:
    client = docker.from_env()
except Exception as e:
    # Use 'docker context use default' or similar if issues persist
    print(f"Error connecting to Docker: {e}. Check if Docker daemon is running.")
    client = None 

# MAPPING: The key is the 'data-app-name' from HTML, the value is your ACTUAL Docker container name.
CONTAINER_MAP = {
    "LeonAI": "leon-ai",
    "BibleServer": "bible-server",
    "ProductScanner": "product-scanner",
    "BarcodeScanner": "barcode-scanner",
    "UPCReceiver": "barcode-scanner",
    "InventoryScript": "barcode-scanner",
    "WazuhManager": "wazuh-manager",
    "WazuhAgent1": "wazuh-agent",
    "WazuhAgent2": "wazuh-agent",
    "Snort": "snort",
    "NodeRED": "mynodered",
    "Fail2Ban": "fail2ban",
    "Emotion": "emotion",
    "Jellyfin": "jellyfin",
    "HomeAssistant": "homeassistant",
    "Motion": "motion",
    "Postfix": "postfix",
    "Dovecot": "dovecot",
    "Matrix": "matrix",
    "Synapse": "synapse",
    "SocioBoard": "socioboard",
    "Elasticsearch": "wazuh-indexer",
    "Kibana": "wazuh-dashboard",
    "OpenVAS": "openvas",
    "Keycloak": "keycloak",
    "TimeTrex": "timetrex",
    "Netdata": "netdata",
    "Glances": "glances"
}

@app.route('/api/status/<app_name>', methods=['GET'])
def get_status(app_name):
    """Checks the status of a specific container."""
    container_name = CONTAINER_MAP.get(app_name)
    if not client or not container_name:
        # For VM-based apps, we assume they are always 'running' or handle their status elsewhere
        if app_name in ["OMV", "pfSense"]:
            return jsonify({"status": "running", "app_name": app_name})
        return jsonify({"status": "off", "message": "Container not mapped or Docker client error."}), 500

    try:
        container = client.containers.get(container_name)
        status = "running" if container.status == "running" else "off"
        return jsonify({"status": status, "app_name": app_name})
    except docker.errors.NotFound:
        return jsonify({"status": "off", "message": "Container not found on Docker host."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/toggle/<app_name>', methods=['POST'])
def toggle_container(app_name):
    """Starts a container if stopped, or stops it if running."""
    container_name = CONTAINER_MAP.get(app_name)
    if not client or not container_name:
        return jsonify({"status": "error", "message": "Backend configuration issue."}), 500

    try:
        container = client.containers.get(container_name)
        if container.status == "running":
            container.stop()
            new_status = "off"
        else:
            container.start()
            new_status = "running"

        return jsonify({"status": new_status, "app_name": app_name})
    except docker.errors.NotFound:
        return jsonify({"status": "error", "message": "Container not found (check name)."}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    # Use Gunicorn in a production setup: gunicorn -w 4 -b 0.0.0.0:5000 app_manager:app
    app.run(debug=True, host='0.0.0.0', port=5050)