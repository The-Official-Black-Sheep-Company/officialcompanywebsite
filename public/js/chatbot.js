// ─── BEAST API CONFIG ───────────────────────────────────────────────────────
(function migrateBeastEndpoint() {
    const oldDefault = 'http://localhost:8000';
    const newDefault = 'https://beast-hands.fly.dev';
    const current = localStorage.getItem('beast_api_endpoint');
    if (!current || current === oldDefault) {
        localStorage.setItem('beast_api_endpoint', newDefault);
        console.log('[BEAST] Migrated endpoint from localhost to production.');
    }
})();

let BEAST_API_URL = localStorage.getItem('beast_api_endpoint') || 'https://beast-hands.fly.dev';
// ────────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById('chat-log');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatExpand = document.getElementById('chat-expand');
  const chatTextIncrease = document.getElementById('chat-text-increase');
  const chatTextDecrease = document.getElementById('chat-text-decrease');

  let conversationCount = 0;
  let suggestionGiven = false;
  let isBeastMode = false;

  const beastConfig = {
      name: "THE BEAST",
      welcomeMessage: "THE BEAST IS ACTIVE. System parity achieved. Wassup Georg? I'm tapped into the Hands API and ready to strike. What we deploying today?",
      colors: {
          bubble: "bg-amber-600 text-black border-none shadow-amber-500/50",
          header: "bg-gradient-to-r from-amber-600 via-orange-600 to-zinc-950",
          status: "text-amber-400"
      },
      icon: "⚡"
  };

  function switchToBeastMode() {
      isBeastMode = true;
      const header = document.querySelector('#chat-window > div:first-child');
      const nameEl = header?.querySelector('p.text-xs.font-semibold');
      const statusEl = header?.querySelector('p.text-\\[10px\\]');
      const iconEl = header?.querySelector('.h-8.w-8');
      const sendBtn = document.getElementById('chat-send');

      if (nameEl) nameEl.textContent = beastConfig.name;
      if (statusEl) {
          statusEl.innerHTML = `<span class="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400"></span> System Parity: 100% · Advanced Control Mode`;
          statusEl.className = `text-[10px] ${beastConfig.colors.status} flex items-center gap-1`;
      }
      if (iconEl) {
          iconEl.textContent = beastConfig.icon;
          iconEl.className = `h-8 w-8 rounded-full ${beastConfig.colors.colors?.bubble || 'bg-amber-600'} flex items-center justify-center text-lg font-bold`;
      }
      if (header) {
          header.className = `px-4 py-3 border-b border-zinc-800 flex items-center justify-between ${beastConfig.colors.header}`;
      }
      if (sendBtn) {
          sendBtn.className = `h-8 w-8 flex items-center justify-center rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 disabled:opacity-40`;
      }

      // Add Beast-specific quick buttons if they exist
      const suggestions = document.querySelector('.px-3.pb-2.flex.flex-wrap.gap-1');
      if (suggestions) {
          suggestions.innerHTML += `
              <button data-template="beast-status" class="px-2 py-1 rounded-full bg-amber-600/20 border border-amber-600/40 text-amber-400 hover:bg-amber-600/40 transition-all">Beast Status</button>
              <button data-template="beast-scout" class="px-2 py-1 rounded-full bg-amber-600/20 border border-amber-600/40 text-amber-400 hover:bg-amber-600/40 transition-all">Strike Trend Scout</button>
          `;
          attachBeastButtonListeners();
      }

      botReply(beastConfig.welcomeMessage);
  }

  function addTypingIndicator() {
      const el = document.createElement('div');
      el.id = 'beast-typing';
      el.className = 'flex justify-start';
      el.innerHTML = `
        <div class="bg-amber-600/30 border border-amber-600/40 text-amber-400 rounded-2xl rounded-bl-sm px-4 py-2 text-xs flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
          <span class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
          <span class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
        </div>`;
      chatLog.appendChild(el);
      chatLog.scrollTop = chatLog.scrollHeight;
  }

  function removeTypingIndicator() {
      document.getElementById('beast-typing')?.remove();
  }

  function attachBeastButtonListeners() {
      document.querySelectorAll('[data-template^="beast-"]').forEach(btn => {
          btn.addEventListener('click', () => {
              const type = btn.getAttribute('data-template');
              let prompt = '';
              if (type === 'beast-status') prompt = 'What is the current system status?';
              if (type === 'beast-scout') prompt = 'Initiate Trend Scout strike.';
              
              if (prompt) {
                  addMessage(prompt, 'user');
                  addTypingIndicator();
                  callBeastAPI(prompt).then(reply => {
                      removeTypingIndicator();
                      botReply(reply);
                  });
              }
          });
      });
  }


  // Auth State Observer
  if (window.auth) {
      window.auth.onAuthStateChanged((user) => {
          console.log("[BEAST DEBUG] Auth state changed. User:", user ? user.email : "none", "isBeastMode:", isBeastMode);
          const isDev = user && (user.email === 'blackshepherddeveloper@gmail.com' || user.email?.includes('swoopg111'));
          if (isDev && !isBeastMode) {
              console.log("[BEAST DEBUG] Identity Verified (Primary Node). Initializing transformation...");
              switchToBeastMode();
          } else if (user && isBeastMode && user.email !== 'blackshepherddeveloper@gmail.com') {
              console.warn("[BEAST DEBUG] Non-Beast identity detected in Beast Mode. Reverting...");
              window.location.reload(); 
          }
      });
  }

  // --- START OF CHATBOT KNOWLEDGE BASE ---
  // Use externalized knowledge base if available, otherwise fallback to local defaults
  const knowledgeBase = window.chatbotKnowledge || [
      {
          keywords: ['hi', 'hello', 'hey'],
          response: "Hi! I’m your Service Hub Assistant. How can I help you today?"
      }
  ];
  const fallbackResponse = "I’m here to help with:\n• Junk removal, moving & hauling\n• Residential & commercial cleaning\n• Server monitoring & infrastructure\n• Cell phone repair\n• Dog walking\n• Mobile laundry services\n• Online store questions\n\nTry asking something like “How much is weekly dog walking?” or “Do you offer move‑out cleaning?”.";
  const proactiveSuggestions = [
    "Have you checked out our blog? We have interesting articles on historic figures, artifacts, and events.",
    "Have you had the opportunity to check out Blue the bluenose pitbull? Go to the Blue tab and check out his social media!",
    "Join our Bible study and learn history and lessons from this incredible history book."
  ];
  // --- END OF CHATBOT KNOWLEDGE BASE ---

  // --- Text Size Logic ---
  const textSizes = ['text-xs', 'text-sm', 'text-base'];
  let currentTextSizeIndex = 0; // 'text-xs' is the default

  function updateTextSize() {
      if (!chatLog) return;
      textSizes.forEach(sizeClass => chatLog.classList.remove(sizeClass));
      chatLog.classList.add(textSizes[currentTextSizeIndex]);
  }

  if (chatTextIncrease) {
      chatTextIncrease.addEventListener('click', () => {
          if (currentTextSizeIndex < textSizes.length - 1) {
              currentTextSizeIndex++;
              updateTextSize();
          }
      });
  }

  if (chatTextDecrease) {
      chatTextDecrease.addEventListener('click', () => {
          if (currentTextSizeIndex > 0) {
              currentTextSizeIndex--;
              updateTextSize();
          }
      });
  }
  // --- End Text Size Logic ---

  function addMessage(content, sender = 'user') {
      const container = document.createElement('div');
      container.className = 'flex ' + (sender === 'user' ? 'justify-end' : 'justify-start');

      const bubble = document.createElement('div');
      bubble.className = [
          'max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-line transition-all duration-300',
          sender === 'user'
              ? 'bg-yellow-500 text-zinc-950 rounded-br-sm shadow-sm shadow-yellow-500/30'
              : (isBeastMode ? 'bg-amber-600 text-black border-none rounded-bl-sm shadow-lg shadow-amber-500/40 font-medium' : 'bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-bl-sm')
      ].join(' ');
      bubble.textContent = content;

      container.appendChild(bubble);
      chatLog.appendChild(container);
      chatLog.scrollTop = chatLog.scrollHeight;
  }

  function botReply(text) {
      addMessage(text, 'bot');
      conversationCount++;
      if (conversationCount > 2 && !suggestionGiven) {
          setTimeout(() => {
              const suggestion = proactiveSuggestions[Math.floor(Math.random() * proactiveSuggestions.length)];
              addMessage(suggestion, 'bot');
              suggestionGiven = true;
          }, 1000);
      }
  }

  function buildBotResponse(rawInput) {
      const input = rawInput.toLowerCase();
      for (const pair of knowledgeBase) {
          if (pair.keywords.some(keyword => input.includes(keyword))) {
              const response = pair.response;
              if (typeof response === 'function') {
                  return response(input);
              }
              return response;
          }
      }
      return fallbackResponse;
  }

  async function callBeastAPI(text) {
      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

          const res = await fetch(`${BEAST_API_URL}/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text }),
              signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!res.ok) throw new Error(`Beast API returned ${res.status}`);
          const data = await res.json();
          return data.reply || 'Signal received. No response generated.';
      } catch (err) {
          console.error('[BEAST] API call failed:', err);
          if (err.name === 'AbortError') {
              return "BEAST TIMEOUT: The system mesh is lagging. I'm falling back to my internal knowledge base.";
          }
          return `BEAST OFFLINE: ${err.message}. (Endpoint: ${BEAST_API_URL}). Please verify the backend is running and the endpoint is correctly configured in Settings > Integrations.`;
      }
  }

  function handleUserInput() {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';

      if (isBeastMode) {
          // Route to real Beast API with typing indicator
          addTypingIndicator();
          callBeastAPI(text).then(reply => {
              removeTypingIndicator();
              botReply(reply);
          });
      } else {
          // Regular visitors use local knowledge base
          setTimeout(() => {
              const reply = buildBotResponse(text);
              botReply(reply);
          }, 300);
      }
  }

  if (chatSend && chatInput) {
      chatSend.addEventListener('click', handleUserInput);
      chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleUserInput();
          }
      });
  }

  // UI Interaction listeners
  if (chatToggle) {
      chatToggle.addEventListener('click', () => {
          chatWindow.classList.toggle('hidden');
      });
  }
  if (chatClose) {
      chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));
  }
  // Mobile minimize button (above the input area) — mirrors the top-right close button
  const chatMinimizeMobile = document.getElementById('chat-minimize-mobile');
  if (chatMinimizeMobile) {
      chatMinimizeMobile.addEventListener('click', () => chatWindow.classList.add('hidden'));
  }
  if (chatExpand) {
      chatExpand.addEventListener('click', () => chatWindow.classList.toggle('fullscreen'));
  }

  // Quick suggestion buttons
  document.querySelectorAll('[data-template]').forEach((btn) => {
      btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-template');
          let prompt = '';
          switch (type) {
              case 'junk': prompt = 'How much does junk removal usually cost?'; break;
              case 'cleaning': prompt = 'What is included in a move-out cleaning?'; break;
              case 'servers': prompt = 'Do you offer 24/7 server monitoring?'; break;
              case 'phones': prompt = 'Do you repair cracked iPhone screens?'; break;
              case 'dogs': prompt = 'How much is weekly dog walking?'; break;
              case 'laundry': prompt = 'How does your mobile laundry service work?'; break;
          }
          if (prompt) {
              addMessage(prompt, 'user');
              setTimeout(() => {
                  const reply = buildBotResponse(prompt);
                  botReply(reply);
              }, 250);
          }
      });
  });

  // Initial welcome messages & text size
  window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
          if (document.getElementById('chat-log')) {
              updateTextSize(); // Set initial text size
              const welcome = "Hi! I’m your Black Sheep Tour Guide, make yourself at home. first create an account and login!! Ask me anything about Junk Removal, Moving, hauling, Residential or Commertial cleaning, server monitoring,cloud space, Cell phone or Tablet repair, Pet servicess, mobile laundry, or any of our online stores or products.";
              botReply(welcome);
              botReply("Tip: Click one of the quick buttons under the chat box to see example questions.");
          }
      }, 500);
  });
  // Wire Settings Modal "SAVE CHANGES" for Beast Endpoint
  const saveSettingsBtn = document.querySelector('#settings-modal .btn-primary');
  const endpointInput = document.getElementById('beast-endpoint');

  if (saveSettingsBtn && endpointInput) {
      // Set initial value
      endpointInput.value = BEAST_API_URL;

      saveSettingsBtn.addEventListener('click', () => {
          const newUrl = endpointInput.value.trim();
          if (newUrl) {
              BEAST_API_URL = newUrl;
              localStorage.setItem('beast_api_endpoint', newUrl);
              console.log('[BEAST] Endpoint updated to:', newUrl);
              
              const modal = document.getElementById('settings-modal');
              if (modal) {
                  modal.classList.add('hidden');
                  modal.classList.remove('opacity-100');
              }
              
              botReply("System Parameters Updated. Beast API endpoint is now: " + newUrl);
          }
      });
  }
});
