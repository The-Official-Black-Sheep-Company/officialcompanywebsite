
  const chatLog = document.getElementById('chat-log');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatExpand = document.getElementById('chat-expand');
  const chatTextIncrease = document.getElementById('chat-text-increase');
  const chatTextDecrease = document.getElementById('chat-text-decrease');

  // --- START OF CHATBOT KNOWLEDGE BASE ---
  const knowledgeBase = [
      {
          keywords: ['hi', 'hello', 'hey'],
          response: "Hi! I’m your Service Hub Assistant. I can help with junk removal & moving, cleaning, server monitoring, phone repair, dog walking, mobile laundry, and your online store. What are you looking for today?"
      },
      {
          keywords: ['store', 'shop', 'order'],
          response: "About the online store:\n• Browse and order items 24/7.\n• I can answer basic questions about products, availability, and shipping.\nFor specific order help, you can tell me your order number (don’t share anything sensitive like full card numbers)."
      },
      {
          keywords: ['server', 'monitor', 'uptime', 'infrastructure'],
          response: "Server monitoring & infrastructure:\n• We offer 24/7 monitoring with alerts for downtime and performance issues.\n• We can monitor websites, APIs, servers, and key services.\n• Plans can include uptime checks, resource usage, and incident notifications.\nTell me a bit about how many servers or sites you have, and your preferred contact method for alerts."
      },
      {
          keywords: ['junk', 'haul', 'hauling', 'removal', 'moving', 'move'],
          response: (input) => {
              if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                  return "Junk removal & moving pricing:\n• Pricing usually depends on load size, distance, and any special handling.\n• For a quick estimate, tell me: 1) what you need removed or moved, 2) approximate volume (e.g. a small room, full garage, 1‑bedroom apartment), and 3) pickup & drop‑off locations.";
              }
              if (input.includes('same day') || input.includes('today') || input.includes('urgent') || input.includes('emergency')) {
                  return "Same‑day junk removal / moving:\n• Same-day options may be available depending on schedule.\n• Tell me your location, what you need done, and your ideal time window and we’ll confirm availability.";
              }
              return "Junk removal & moving services:\n• We handle household junk, furniture, appliances, and general hauling (within reasonable safety limits).\n• We can also help with local moves and loading/unloading.\nTell me what you need moved or removed and the address so we can estimate time and cost.";
          }
      },
      {
          keywords: ['clean', 'cleaning', 'housekeeping'],
          response: (input) => {
              if (input.includes('move out') || input.includes('move-out') || input.includes('moveout') || input.includes('deep')) {
                  return "Move‑out / deep cleaning:\n• Focus on kitchens, bathrooms, floors, baseboards, and inside cabinets (as requested).\n• Ideal for end of lease / pre‑sale cleanups.\nShare the type of property (apartment/house, number of bedrooms/bathrooms) and your preferred date so we can give a better estimate.";
              }
              if (input.includes('commercial') || input.includes('office') || input.includes('business')) {
                  return "Commercial cleaning:\n• Offices, retail spaces, and other commercial properties.\n• We can set up recurring schedules (daily/weekly) or one‑time projects.\nTell me the type of business, approximate square footage, and how often you’d like cleaning.";
              }
              return "Residential & commercial cleaning:\n• Options for standard, deep, move‑in/move‑out, and recurring cleanings.\n• We bring our own supplies unless you prefer specific products.\nTell me if the space is residential or commercial, how many rooms, and how often you’d like cleaning (one‑time, weekly, bi‑weekly, etc.).";
          }
      },
      {
          keywords: ['phone', 'screen', 'iphone', 'android', 'battery', 'repair'],
          response: (input) => {
              if (input.includes('screen') || input.includes('crack')) {
                  return "Phone screen repair:\n• We handle most popular iPhone and Android models.\n• Turnaround time can be same‑day or next‑day for common parts.\nTell me your phone model and the issue (cracked glass only, no touch, display issues) and I can outline next steps.";
              }
              if (input.includes('battery')) {
                  return "Phone battery replacement:\n• We replace worn batteries that don’t hold a charge.\n• Typical service time is around 1–2 hours, depending on the model.\nShare your phone model and any battery symptoms (shutting off, draining fast, swelling).";
              }
              if (input.includes('water') || input.includes('liquid')) {
                  return "Water‑damage phone repair:\n• Power off the device and avoid charging it.\n• We can inspect and attempt recovery / repair depending on condition.\nTell me when the damage happened and the phone model, and we’ll recommend next steps.";
              }
              return "Cell phone repair services:\n• Screen, battery, charging port, buttons, and other common issues.\n• Many repairs can be done the same day, depending on parts.\nTell me your phone model and the problem you’re seeing so we can guide you.";
          }
      },
      {
          keywords: ['dog', 'dogs', 'walk', 'pet'],
          response: (input) => {
              if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                  return "Dog walking pricing:\n• Usually based on walk length (e.g. 20, 30, 60 minutes) and frequency (occasional vs weekly).\n• Multi‑dog households may have a small additional fee.\nTell me how many dogs you have, how often you need walks, and your general location so we can estimate.";
              }
              if (input.includes('schedule') || input.includes('weekly') || input.includes('daily')) {
                  return "Dog walking schedules:\n• Options for daily, a few times per week, or occasional walks.\n• We can discuss preferred time windows (morning, mid‑day, evening).\nShare your preferred days/times and any special notes about your dog (age, energy level, anything we should watch for).";
              }
              return "Dog walking services:\n• Regular or occasional walks with updates after each visit.\n• We pay attention to your dog’s routine, energy level, and any special instructions.\nTell me your dog’s age, breed (optional), and how often you’d like walks.";
          }
      },
      {
          keywords: ['laundry', 'laundromat', 'wash', 'fold'],
          response: (input) => {
              if (input.includes('how') && (input.includes('work') || input.includes('works'))) {
                  return "Mobile laundry service – how it works:\n1) We pick up your laundry at a scheduled time.\n2) We wash, dry, and fold it for you.\n3) We deliver it back, usually within 24–48 hours depending on volume.\nTell me your approximate number of loads per week and your area so we can plan pickup times.";
              }
              if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                  return "Mobile laundry pricing:\n• Often charged per pound or per standard laundry bag.\n• Pickup and delivery may be included above a minimum amount.\nShare roughly how many loads or pounds of laundry you have and how often you’ll use the service.";
              }
              return "Mobile laundry services:\n• Pickup, wash/dry/fold, and delivery included.\n• Great for busy households or small businesses.\nTell me your location and how much laundry you typically have each week.";
          }
      },
      {
          keywords: ['hour', 'time', 'open', 'close'],
          response: "Hours & availability:\n• Core hours are typically standard business hours, with some services offering evenings or weekends.\n• Junk removal, moving, and cleaning can sometimes be scheduled outside normal hours.\nTell me which service you’re asking about and your preferred date/time so we can check availability."
      },
      {
          keywords: ['where', 'located', 'location', 'area', 'serve'],
          response: "Service area:\n• We serve local clients for in‑person services (junk removal, moving, cleaning, dog walking, laundry, phone repair).\n• Server monitoring and some online services can support clients in many locations.\nTell me your city/area and the service you need so we can confirm coverage."
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
      {
          keywords: ['book', 'schedule', 'appointment', 'quote', 'estimate'],
          response: "Booking & quotes:\nI can capture your request so our team can follow up. Please share:\n1) Your name\n2) Service you need (junk removal, cleaning, server monitoring, phone repair, dog walking, laundry, online store help)\n3) Your general location\n4) Ideal date/time window\n(Please avoid sending highly sensitive data here.)"
      }
  ];
  const fallbackResponse = "I’m here to help with:\n• Junk removal, moving & hauling\n• Residential & commercial cleaning\n• Server monitoring & infrastructure\n• Cell phone repair\n• Dog walking\n• Mobile laundry services\n• Online store questions\n\nTry asking something like “How much is weekly dog walking?” or “Do you offer move‑out cleaning?”.";
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
      // Open Chatwoot AI widget instead of old chatbot
      chatToggle.addEventListener('click', () => {
          console.log('Chat button clicked');

          // Wait for Chatwoot to load if not ready yet
          const openChatwoot = () => {
              if (window.$chatwoot) {
                  console.log('Opening Chatwoot widget');
                  window.$chatwoot.toggle();
              } else {
                  console.log('Chatwoot not ready, waiting...');
                  setTimeout(openChatwoot, 100);
              }
          };

          openChatwoot();
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
