// ------------------------------
// Clock / date
// ------------------------------
function updateTime() {
    const now = new Date();
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    const time = now.toLocaleTimeString('en-US', timeOptions);
    const date = now.toLocaleDateString('en-US', dateOptions).toUpperCase();

    const byId = (id) => document.getElementById(id);
    const setTxt = (id, val) => { const el = byId(id); if (el) el.textContent = val; };

    setTxt('nav-time', time);
    setTxt('nav-date', date);
    setTxt('nav-time-mobile', time);
    setTxt('nav-date-mobile', date);
    setTxt('contact-time', time);
    setTxt('contact-date', date);
    setTxt('year', now.getFullYear());
}
setInterval(updateTime, 1000);
updateTime();

// ------------------------------
// Mobile menu
// ------------------------------
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
});
mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});

// ------------------------------
// Marquee
// ------------------------------
const marqueeText = " // THE OFFICIAL BLACK SHEEP COMPANY // APPLE + SAMSUNG SPECIALISTS // SCREEN // BATTERY // CHARGING PORT // LIQUID DAMAGE // BOARD-LEVEL REPAIR // DATA RECOVERY (WHEN POSSIBLE) // DIAGNOSTICS // WEB DESIGN // CLOUD STORAGE // VPS HOSTING //";
const marqueeContainer = document.getElementById('marquee-content');
if (marqueeContainer) {
    marqueeContainer.innerHTML = `<span class="text-xs font-mono text-gray-500 tracking-[3px]">${marqueeText.repeat(14)}</span>`;
}

// ------------------------------
// System log (alive motion)
// ------------------------------
const logs = [
    "Initializing secure intake channel…",
    "Loading Apple diagnostic profile…",
    "Loading Samsung service profile…",
    "Reading battery health telemetry…",
    "Verifying charge negotiation…",
    "Touch matrix scan: stable",
    "Speaker/mic loopback: OK",
    "Thermal baseline: nominal",
    "Board inspection mode: ready",
    "System ready. Awaiting ticket."
];

const logContainer = document.getElementById('system-log');
const seqLabel = document.getElementById('log-seq');
let logIndex = 0;
let seq = 1;

function addLog() {
    if (!logContainer) return;
    const div = document.createElement('div');
    div.className = "flex items-center gap-2";
    div.innerHTML = `<span class="text-gray-200 font-bold text-[10px]">>></span> <span>${logs[logIndex]}</span>`;

    if (logContainer.children.length > 6) {
        logContainer.removeChild(logContainer.firstChild);
    }

    logContainer.appendChild(div);

    logIndex = (logIndex + 1) % logs.length;
    if (seqLabel) seqLabel.textContent = `SEQ ${String(seq++).padStart(4, '0')}`;

    const delay = Math.floor(Math.random() * 1700) + 700;
    setTimeout(addLog, delay);
}
addLog();

// Typing Effect
const typingLines = [
    "Precision repair for Apple & Samsung devices.",
    "Industrial-grade diagnostics and restoration.",
    "Where technology meets craftsmanship."
];
let currentLine = 0;
let charIndex = 0;
let typingSpeed = 50;
let erasingSpeed = 30;
let pauseBetween = 2000;

function typeWriter() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    if (charIndex < typingLines[currentLine].length) {
        typingElement.textContent += typingLines[currentLine].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
    } else {
        setTimeout(eraseWriter, pauseBetween);
    }
}

function eraseWriter() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    if (charIndex > 0) {
        typingElement.textContent = typingLines[currentLine].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseWriter, erasingSpeed);
    } else {
        currentLine = (currentLine + 1) % typingLines.length;
        setTimeout(typeWriter, typingSpeed);
    }
}

// Start typing effect after page load
setTimeout(typeWriter, 1000);

// ------------------------------
// Live queue simulation + status
// ------------------------------
const queueEl = document.getElementById('queue-count');
const statusEl = document.getElementById('system-status');
let queue = 7;

// System Status Cycling
const statuses = [
    { text: "Operational", color: "#10b981", dotColor: "#10b981" },
    { text: "Standby", color: "#3b82f6", dotColor: "#3b82f6" },
    { text: "Processing", color: "#f59e0b", dotColor: "#f59e0b" },
    { text: "Calibrating", color: "#8b5cf6", dotColor: "#8b5cf6" },
    { text: "High Load", color: "#ef4444", dotColor: "#ef4444" },
    { text: "Maintenance", color: "#f97316", dotColor: "#f97316" },
    { text: "Diagnostic", color: "#06b6d4", dotColor: "#06b6d4" },
    { text: "Ready", color: "#22c55e", dotColor: "#22c55e" },
    { text: "Active", color: "#84cc16", dotColor: "#84cc16" },
    { text: "Idle", color: "#64748b", dotColor: "#64748b" },
    { text: "Analyzing", color: "#a855f7", dotColor: "#a855f7" },
    { text: "Syncing", color: "#14b8a6", dotColor: "#14b8a6" }
];

let currentStatusIndex = 0;

function tickQueue() {
    if (!queueEl) return;
    // gentle random walk for queue
    const delta = (Math.random() < 0.55 ? 1 : -1) * (Math.random() < 0.7 ? 1 : 0);
    queue = Math.max(1, Math.min(18, queue + delta));
    queueEl.textContent = String(queue);
}

function updateStatus() {
    const dotEl = document.querySelector('.status-dot');

    if (!statusEl || !dotEl) return;

    const currentStatus = statuses[currentStatusIndex];

    statusEl.textContent = currentStatus.text;
    statusEl.style.color = currentStatus.color;
    dotEl.style.backgroundColor = currentStatus.dotColor;
    dotEl.style.boxShadow = `0 0 0 0 ${currentStatus.dotColor}`;

    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;

    // Random delay between 2-5 seconds for next status change
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(updateStatus, randomDelay);
}

// Update queue every 800ms
setInterval(tickQueue, 800);
tickQueue();

// Start status cycling with random delays
updateStatus();

// ------------------------------
// Reveal-on-scroll
// ------------------------------
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.14 });
revealEls.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
});

// ------------------------------
// Quick estimate
// ------------------------------
const estDevice = document.getElementById('est-device');
const estIssue = document.getElementById('est-issue');
const estPriority = document.getElementById('est-priority');

const estEta = document.getElementById('est-eta');
const estPrice = document.getElementById('est-price');
const estConf = document.getElementById('est-confidence');

function computeEstimate() {
    if (!estDevice) return;
    const d = estDevice.value;
    const i = estIssue.value;
    const p = estPriority.value;

    // base ranges (simple, visual only)
    const table = {
        screen: { eta: '45–90 min', price: '$89–$279', conf: 'High' },
        battery: { eta: '30–70 min', price: '$69–$179', conf: 'High' },
        charge: { eta: '60–120 min', price: '$89–$199', conf: 'Medium' },
        water: { eta: '2–48 hrs', price: '$99–$399', conf: 'Variable' },
        diag: { eta: '20–45 min', price: '$29–$79', conf: 'High' },
    };

    let { eta, price, conf } = table[i];

    // device modifiers
    if (d === 'ipad' || d === 'tablet') {
        if (i === 'screen') price = '$139–$399';
        if (i === 'charge') price = '$119–$249';
        if (i === 'battery') price = '$99–$249';
        eta = (i === 'screen' || i === 'charge') ? '90–180 min' : eta;
    }

    if (d === 'galaxy' && i === 'screen') {
        price = '$129–$399';
        conf = 'Medium';
    }

    if (p === 'rush') {
        // Rush tends to shorten ETA but not always available
        if (eta.includes('–')) {
            eta = 'Priority Slot';
        }
    }

    estEta.textContent = eta;
    estPrice.textContent = price;
    estConf.textContent = conf;

    const updated = document.getElementById('estimate-updated');
    if (updated) {
        updated.textContent = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

[estDevice, estIssue, estPriority].forEach(el => el?.addEventListener('change', computeEstimate));
if (estDevice) computeEstimate();

// Copy estimate
const copyBtn = document.getElementById('copy-estimate');
copyBtn?.addEventListener('click', async () => {
    const text = `TOBSC Quick Estimate\nDevice: ${estDevice.options[estDevice.selectedIndex].text}\nIssue: ${estIssue.options[estIssue.selectedIndex].text}\nPriority: ${estPriority.options[estPriority.selectedIndex].text}\nETA: ${estEta.textContent}\nStarting Range: ${estPrice.textContent}\nConfidence: ${estConf.textContent}`;
    try {
        await navigator.clipboard.writeText(text);
        showToast('Estimate copied to clipboard.');
    } catch {
        showToast('Copy failed (browser blocked).');
    }
});

// ------------------------------
// About counters + recent repairs feed
// ------------------------------
const about1 = document.getElementById('about-counter-1');
const about2 = document.getElementById('about-counter-2');

function animateNumber(el, to, suffix = '') {
    const start = 0;
    const duration = 1200;
    const t0 = performance.now();

    function frame(t) {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(start + (to - start) * eased);
        el.textContent = `${val}${suffix}`;
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// animate when section becomes visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const aboutIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (about1) animateNumber(about1, 62, '%');
                if (about2) animateNumber(about2, 1240, '');
                aboutIO.disconnect();
            }
        });
    }, { threshold: 0.25 });
    aboutIO.observe(aboutSection);
}

const recentRepairEl = document.getElementById('recent-repair');
const recentTimeEl = document.getElementById('recent-time');
const recentRepairs = [
    'iPhone 14 Pro — Screen & TrueTone calibration',
    'Galaxy S23 — Charging port rework & test',
    'iPad Air — Battery replacement & health check',
    'Galaxy Tab — Liquid clean + connector service',
    'iPhone 13 — Speaker/mic diagnostics & repair',
    'Galaxy A54 — OLED replacement & seal',
    'iPhone 12 — Logic board short isolation',
];
function rotateRecent() {
    if (!recentRepairEl) return;
    const item = recentRepairs[Math.floor(Math.random() * recentRepairs.length)];
    recentRepairEl.textContent = item;
    if (recentTimeEl) recentTimeEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}
setInterval(rotateRecent, 2600);
rotateRecent();

// ------------------------------
// Contact form: transmit animation + toast
// ------------------------------
const form = document.getElementById('ticket-form');
const txBtn = document.getElementById('tx-btn');
const txBar = document.getElementById('tx-bar');
const txLabel = document.getElementById('tx-label');

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add('hidden'), 2200);
}

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const device = (fd.get('device') || '').toString().trim();

    // visual-only; no backend
    txBtn.disabled = true;
    txBtn.classList.add('opacity-70', 'cursor-not-allowed');

    txLabel.textContent = 'SENDING…';
    txBar.style.width = '0%';

    let p = 0;
    const interval = setInterval(() => {
        p += Math.random() * 22;
        if (p >= 100) p = 100;
        txBar.style.width = p + '%';
        if (p === 100) {
            clearInterval(interval);
            txLabel.textContent = 'COMPLETE';

            // Also push a log line
            if (logContainer) {
                const div = document.createElement('div');
                div.className = 'flex items-center gap-2';
                div.innerHTML = `<span class="text-gray-200 font-bold text-[10px]">>></span> <span>Ticket created for ${escapeHtml(name || 'Client')} — ${escapeHtml(device || 'Device')}.</span>`;
                if (logContainer.children.length > 6) logContainer.removeChild(logContainer.firstChild);
                logContainer.appendChild(div);
            }

            showToast('Ticket transmitted. We’ll contact you shortly.');

            setTimeout(() => {
                form.reset();
                txBar.style.width = '0%';
                txLabel.textContent = 'IDLE';
                txBtn.disabled = false;
                txBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }, 850);
        }
    }, 300);
});

function escapeHtml(str) {
    return str.replace(/[&<>"]+/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m] || m));
}

// ------------------------------
// Particles (subtle grayscale drift) - Canvas
// ------------------------------
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;

    function resize() {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const particleCount = prefersReduced ? 0 : Math.min(95, Math.floor((window.innerWidth * window.innerHeight) / 26000));
    const particles = Array.from({ length: particleCount }, () => makeParticle());

    function makeParticle() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.6,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.16,
            a: Math.random() * 0.12 + 0.04
        };
    }

    function step() {
        if (prefersReduced) return;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';

        // dots
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${p.a})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // faint connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.06;
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ------------------------------
// Floating Particles (DOM)
// ------------------------------
function createFloatingParticles() {
    const container = document.getElementById('floating-particles');
    // If container not found (e.g. before HTML rename), fallback or abort
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;

        container.appendChild(particle);

        animateFloatingParticle(particle);
    }
}

function animateFloatingParticle(particle) {
    const duration = Math.random() * 10000 + 10000;
    // Need to get computed or current values if they exist, but initially they are style
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);

    let startTime = null;

    function move(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            const newY = startY - (progress * 30);
            const newX = startX + Math.sin(progress * Math.PI * 2) * 5;

            particle.style.top = newY + 'vh';
            particle.style.left = newX + 'vw';

            requestAnimationFrame(move);
        } else {
            // Reset
            particle.style.top = (100 + Math.random() * 10) + 'vh';
            particle.style.left = Math.random() * 100 + 'vw';
            // Start new animation cycle for this particle
            animateFloatingParticle(particle);
        }
    }

    requestAnimationFrame(move);
}

// Call once outside loop
createFloatingParticles();


// ------------------------------
// Random Bible verses
// ------------------------------
async function setRandomBibleVerse() {
    try {
        const response = await fetch('few-verses.txt');
        const text = await response.text();
        const verses = text.split('\n').filter(line => line.trim() !== '');

        if (verses.length > 0) {
            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            const el = document.getElementById('bible-verse');
            if (el) el.textContent = randomVerse;
        }
    } catch (error) {
        console.error('Error loading verses:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setRandomBibleVerse();
});

// ------------------------------
// Protocols cycling animation
// ------------------------------
const protocolText = document.getElementById('protocol-text');
const variants = ['', 'glitch-gray', 'glitch-color', 'glitch-intense'];
let currentVariant = 0;

function cycleProtocols() {
    if (!protocolText) return;
    protocolText.className = 'protocol-base text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 opacity-90 ' + variants[currentVariant];
    currentVariant = (currentVariant + 1) % variants.length;

    const randomDelay = Math.floor(Math.random() * 250) + 50; // High speed flicker (50ms - 300ms)
    setTimeout(cycleProtocols, randomDelay);
}

// Start cycling
cycleProtocols();
