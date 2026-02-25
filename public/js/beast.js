/**
 * THE BEAST - Control Plane Logic
 * Connects the frontend interface to the Hands API.
 */

class BeastControl {
    constructor() {
        this.apiEndpoint = localStorage.getItem('beast_api_endpoint') || 'https://beast-hands.fly.dev';
        this.terminal = document.getElementById('terminal-output');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.nodeToggle = document.getElementById('node-toggle');
        this.nodeLabel = document.getElementById('node-label');
        
        this.init();
    }
    
    updateNodeUI() {
        if (this.nodeLabel) {
            this.nodeLabel.textContent = this.apiEndpoint.includes('localhost') ? 'Local' : 'Cloud';
            this.nodeToggle.classList.toggle('border-emerald-500', this.apiEndpoint.includes('localhost'));
            this.nodeToggle.classList.toggle('text-emerald-500', this.apiEndpoint.includes('localhost'));
        }
    }

    init() {
        this.updateNodeUI();
        
        if (this.nodeToggle) {
            this.nodeToggle.addEventListener('click', () => {
                const isLocal = this.apiEndpoint.includes('localhost');
                this.apiEndpoint = isLocal ? 'https://beast-hands.fly.dev' : 'http://localhost:8000';
                localStorage.setItem('beast_api_endpoint', this.apiEndpoint);
                this.updateNodeUI();
                this.log(`Switched to ${isLocal ? 'CLOUD' : 'LOCAL'} node.`, 'system');
                this.refreshStats();
            });
        }

        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendChat());
        }
        if (this.chatInput) {
            this.chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.sendChat();
            });
        }

        // Auto-refresh stats on load
        this.refreshStats();
        setInterval(() => this.refreshStats(), 30000); // Every 30s

        // Load Slack config from localStorage
        this.loadSlackConfig();
    }

    log(message, type = 'system') {
        const p = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        let colorClass = 'text-zinc-400';
        let prefix = '> ';

        if (type === 'user') {
            colorClass = 'text-blue-400 font-bold';
            prefix = 'USER@BEAST:~$ ';
        } else if (type === 'leon') {
            colorClass = 'text-orange-400';
            prefix = 'LEON: ';
        } else if (type === 'error') {
            colorClass = 'text-red-500';
            prefix = 'ERROR: ';
        } else if (type === 'success') {
            colorClass = 'text-emerald-500';
        }

        p.className = colorClass;
        p.innerHTML = `<span class="text-zinc-600 mr-2">[${timestamp}]</span><span>${prefix}${message}</span>`;
        
        this.terminal.appendChild(p);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    async sendChat() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.chatInput.value = '';
        this.log(text, 'user');

        try {
            const response = await fetch(`${this.apiEndpoint}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('API node unreachable');

            const data = await response.json();
            this.log(data.reply, data.mode === 'system' ? 'system' : 'leon');
        } catch (err) {
            this.log(err.message, 'error');
        }
    }

    async execute(action) {
        this.log(`Initiating ${action.toUpperCase()} strike...`, 'system');
        
        try {
            const response = await fetch(`${this.apiEndpoint}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ execute: true, save: true })
            });

            if (!response.ok) throw new Error(`${action.toUpperCase()} attempt failed.`);

            const data = await response.json();
            this.log(data.message || `${action.toUpperCase()} protocol engaged.`, 'success');
        } catch (err) {
            this.log(err.message, 'error');
        }
    }

    async refreshStats() {
        try {
            const response = await fetch(`${this.apiEndpoint}/health`);
            if (!response.ok) return;

            const data = await response.json();
            
            // Update UI elements if they exist
            const meshEl = document.getElementById('mesh-count');
            if (meshEl) meshEl.textContent = data.diagnostics?.container_count || '53';

            const storageEl = document.getElementById('storage-status');
            if (storageEl) {
                const disk = data.diagnostics?.disk_usage || 0;
                storageEl.textContent = disk > 85 ? 'PRESSURE' : 'STABLE';
                storageEl.className = `stat-value text-xl ${disk > 85 ? 'text-red-500' : 'text-emerald-500'}`;
            }
        } catch (err) {
            console.error('Stats refresh failed:', err);
        }
    }

    // === SLACK CONFIGURATION ===

    loadSlackConfig() {
        const fields = {
            'slack-bot-token': localStorage.getItem('slack_bot_token') || '',
            'slack-team-id': localStorage.getItem('slack_team_id') || '',
            'slack-webhook-url': localStorage.getItem('slack_webhook_url') || '',
            'slack-channel': localStorage.getItem('slack_default_channel') || ''
        };

        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }

        // Update status indicator
        const hasConfig = fields['slack-bot-token'] && fields['slack-team-id'];
        const statusBrief = document.getElementById('slack-status-brief');
        const statusDot = document.getElementById('slack-status-dot');

        if (statusBrief && statusDot) {
            if (hasConfig) {
                statusBrief.textContent = 'Configured';
                statusBrief.className = 'text-[10px] text-emerald-500 uppercase tracking-widest mt-0.5';
                statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-emerald-900 shadow-[0_0_6px_rgba(16,185,129,0.5)]';
            } else {
                statusBrief.textContent = 'Not Configured';
                statusBrief.className = 'text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5';
                statusDot.className = 'w-2.5 h-2.5 rounded-full bg-zinc-700 border-2 border-zinc-800';
            }
        }
    }

    saveSlackConfig() {
        const token = document.getElementById('slack-bot-token')?.value?.trim() || '';
        const teamId = document.getElementById('slack-team-id')?.value?.trim() || '';
        const webhook = document.getElementById('slack-webhook-url')?.value?.trim() || '';
        const channel = document.getElementById('slack-channel')?.value?.trim() || '';

        localStorage.setItem('slack_bot_token', token);
        localStorage.setItem('slack_team_id', teamId);
        localStorage.setItem('slack_webhook_url', webhook);
        localStorage.setItem('slack_default_channel', channel);

        this.loadSlackConfig(); // refresh status indicators

        // Show status feedback
        const statusEl = document.getElementById('slack-connection-status');
        if (statusEl) {
            statusEl.className = 'p-3 rounded-xl border text-xs font-mono transition-all duration-300 bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            statusEl.innerHTML = '✓ Slack configuration saved to local storage.';
            setTimeout(() => { statusEl.classList.add('hidden'); }, 4000);
        }

        this.log('SLACK CONFIG: Credentials saved to local storage.', 'success');
    }

    async testSlackConnection() {
        this.log('SLACK: Testing connection to Beast API...', 'system');

        const statusEl = document.getElementById('slack-connection-status');
        if (statusEl) {
            statusEl.className = 'p-3 rounded-xl border text-xs font-mono transition-all duration-300 bg-blue-500/10 border-blue-500/20 text-blue-400';
            statusEl.innerHTML = '⏳ Testing connection...';
        }

        try {
            const response = await fetch(`${this.apiEndpoint}/health`);
            if (!response.ok) throw new Error('API node unreachable');

            const data = await response.json();
            const gateways = data.gateways || [];
            const slackConnected = gateways.includes('slack');

            if (slackConnected) {
                this.log('SLACK: Gateway is ACTIVE on the Beast backbone.', 'success');
                if (statusEl) {
                    statusEl.className = 'p-3 rounded-xl border text-xs font-mono transition-all duration-300 bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                    statusEl.innerHTML = '🟢 Slack gateway is <strong>active</strong> on the Beast backbone. Ready for commands.';
                }
            } else {
                this.log('SLACK: Gateway NOT detected. Webhook URL may not be configured on the server.', 'system');
                if (statusEl) {
                    statusEl.className = 'p-3 rounded-xl border text-xs font-mono transition-all duration-300 bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
                    statusEl.innerHTML = `⚠️ API reachable but Slack gateway is <strong>offline</strong>. Active gateways: [${gateways.join(', ') || 'none'}]`;
                }
            }
        } catch (err) {
            this.log(`SLACK: Connection test failed — ${err.message}`, 'error');
            if (statusEl) {
                statusEl.className = 'p-3 rounded-xl border text-xs font-mono transition-all duration-300 bg-red-500/10 border-red-500/20 text-red-400';
                statusEl.innerHTML = `🔴 Connection failed: ${err.message}`;
            }
        }
    }

    toggleSlackPanel() {
        const body = document.getElementById('slack-panel-body');
        const chevron = document.getElementById('slack-chevron');
        if (!body) return;

        const isHidden = body.classList.contains('hidden');
        body.classList.toggle('hidden');

        if (chevron) {
            chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }

    toggleTokenVisibility() {
        const input = document.getElementById('slack-bot-token');
        const icon = document.getElementById('token-eye-icon');
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        }
    }
}

// Initialize on load
window.beast = new BeastControl();
