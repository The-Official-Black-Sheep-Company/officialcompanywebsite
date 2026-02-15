
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

  // --- START OF CHATBOT KNOWLEDGE BASE ---
  const knowledgeBase = [
    {
        keywords: ['hi', 'hello', 'hey'],
        response: "Hi! I’m your Service Hub Assistant. I can help with junk removal & moving, cleaning, server monitoring, phone repair, dog walking, mobile laundry, and your online store. What are you looking for today?"
    },
    {
        keywords: ['store', 'shop', 'order', 'product'],
        response: "About our online store:\n• You can browse our products and place an order 24/7. Just head to the 'Shopping' tab and click 'Store'.\n• I can help with basic questions about products, like pricing. For example, you can ask 'How much is the Black Sheep hoodie?'."
    },
    {
        keywords: ['ismm', 'social media', 'integrated social media management'],
        response: "The Integrated Social Media Management (ISMM) platform is a powerful tool for managing all your social media accounts in one place. You can schedule posts, track engagement, and analyze your performance. You can find it under the 'Servers' tab in the 'Business Server' section."
    },
    {
        keywords: ['navigate', 'find', 'go to', 'where is'],
        response: (input) => {
            if (input.includes('monitoring')) return "You can find our monitoring services under the 'Monitoring' tab. We have dashboards for Wazuh, Glances, and Kubernetes.";
            if (input.includes('bible study')) return "Our 'Seek Eternity' bible study is located under its own tab. You can find the latest study there.";
            if (input.includes('reports')) return "The 'Reports' tab contains our blogs on historic figures, artifacts, and events.";
            if (input.includes('servers')) return "You can find our server information under the 'Servers' tab. We have sections for Arts, Business, Cloud, and Home servers.";
            return "I can help you find what you're looking for. What section are you trying to find? For example, you can ask 'Where is the bible study?'.";
        }
    },
    {
        keywords: ['price', 'cost', 'how much'],
        response: (input) => {
            if (input.includes('junk removal')) return "Junk removal pricing is based on the volume of junk. A small load is typically around $125, while a full truckload can be up to $600.";
            if (input.includes('cleaning')) return "Our residential cleaning services start at $150 for a basic cleaning of a 2-bedroom apartment. Commercial cleaning is quoted based on the size and needs of the space.";
            if (input.includes('hoodie')) return "The Black Sheep hoodie is $45. You can find it in our online store under the 'Shopping' tab.";
            return "I can provide pricing information for our services and products. What are you interested in?"
        }
    },
    {
        keywords: ['book', 'schedule', 'appointment'],
        response: "To schedule an appointment, I'll need your name, the service you're interested in, and your preferred date and time. Once I have that, I can check our availability. Please note that I do not have access to Cal.com yet, but I can still help you book an appointment."
    },
    {
        keywords: ['thanks', 'thank you', 'appreciate it'],
        response: "You're welcome! Is there anything else I can help you with?"
    },
    {
        keywords: ['bye', 'goodbye', 'see ya'],
        response: "Have a great day!"
    },
    {
        keywords: ['whats crackin', "what's good", 'whats good', 'wassup', 'wats good', 'wats up'],
        response: ['whats Brackin homie', 'wats poppin', 'what it do nephew', 'where dem thangs at?', 'U strait?']
    },
    {
        keywords: ["who's the owne'r?", 'who ownes this company?', 'who runs the show?', 'whos the hnic?'],
        response: "Swoop mf Geezy, view our contacts tab for more info!!"
    },
    {
        keywords: ['whats your name?'],
        response: "My name is Black the sheep, one of the blackest sheep in the flock"
    },
  ];
  const fallbackResponse = "I’m here to help with:\n• Junk removal, moving & hauling\n• Residential & commercial cleaning\n• Server monitoring & infrastructure\n• Cell phone repair\n• Dog walking\n• Mobile laundry services\n• Online store questions\n\nTry asking something like “How much is weekly dog walking?” or “Do you offer move‑out cleaning?”.";
  const proactiveSuggestions = [
    "Did you know we also offer 24/7 server monitoring? It's a great way to keep your websites and applications running smoothly.",
    "We're running a special on our residential cleaning services this month. Get 10% off your first cleaning!",
    "Have you checked out our blog? We have interesting articles on historic figures, artifacts, and events."
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
          'max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-line',
          sender === 'user'
              ? 'bg-yellow-500 text-zinc-950 rounded-br-sm shadow-sm shadow-yellow-500/30'
              : 'bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-bl-sm'
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

  function handleUserInput() {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';

      setTimeout(() => {
          const reply = buildBotResponse(text);
          botReply(reply);
      }, 300);
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
});
