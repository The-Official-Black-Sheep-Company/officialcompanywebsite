/**
 * Chatwoot Widget with Voice Input Integration
 * For The Official Black Sheep Company
 */

(function() {
  // Chatwoot Widget Configuration
  window.chatwootSettings = {
    hideMessageBubble: true,     // Hide default button - we'll use custom button
    position: 'right',
    locale: 'en',
    type: 'expanded_bubble',
    launcherTitle: 'Live chat with us 24/7',
    showPopoutButton: false,
  };

  // Load Chatwoot Widget
  (function(d,t) {
    var BASE_URL=window.location.protocol + "//" + window.location.hostname + "/chatwoot";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: 'FhEd9sQW45sKaXu5wx9GmWdh',
        baseUrl: BASE_URL
      })

      // Initialize voice input after widget loads
      initializeVoiceInput();
    }
  })(document,"script");

  /**
   * Voice Input Implementation using Web Speech API
   */
  function initializeVoiceInput() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let isRecording = false;

    // Create voice button
    function createVoiceButton() {
      // Wait for Chatwoot widget to be fully loaded
      const checkWidget = setInterval(() => {
        const chatWidget = document.querySelector('.woot-widget-bubble');

        if (chatWidget) {
          clearInterval(checkWidget);

          // Create voice button
          const voiceBtn = document.createElement('button');
          voiceBtn.id = 'chatwoot-voice-btn';
          voiceBtn.setAttribute('aria-label', 'Voice input');
          voiceBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          `;
          voiceBtn.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 16px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(to right, #eab308, #f97316, #1f2937);
            color: white;
            border: 1px solid rgba(253, 224, 71, 0.6);
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(234, 179, 8, 0.3);
            z-index: 2147483000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          `;

          voiceBtn.onmouseover = () => {
            voiceBtn.style.transform = 'scale(1.1)';
            voiceBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          };

          voiceBtn.onmouseout = () => {
            voiceBtn.style.transform = 'scale(1)';
            voiceBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          };

          voiceBtn.onclick = toggleRecording;

          document.body.appendChild(voiceBtn);
        }
      }, 100);
    }

    function toggleRecording() {
      const voiceBtn = document.getElementById('chatwoot-voice-btn');

      if (isRecording) {
        recognition.stop();
        isRecording = false;
        voiceBtn.style.background = 'linear-gradient(to right, #eab308, #f97316, #1f2937)';
        voiceBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        `;
      } else {
        recognition.start();
        isRecording = true;
        voiceBtn.style.background = '#ff1744';
        voiceBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        `;
      }
    }

    // Handle speech recognition results
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        // Send message via Chatwoot
        sendChatwootMessage(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isRecording = false;
      const voiceBtn = document.getElementById('chatwoot-voice-btn');
      if (voiceBtn) {
        voiceBtn.style.background = 'linear-gradient(to right, #eab308, #f97316, #1f2937)';
        voiceBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        `;
      }
    };

    recognition.onend = () => {
      isRecording = false;
      const voiceBtn = document.getElementById('chatwoot-voice-btn');
      if (voiceBtn) {
        voiceBtn.style.background = 'linear-gradient(to right, #eab308, #f97316, #1f2937)';
        voiceBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        `;
      }
    };

    // Send message to Chatwoot
    function sendChatwootMessage(message) {
      if (window.$chatwoot) {
        window.$chatwoot.sendMessage(message);
      }
    }

    // Initialize button
    createVoiceButton();
  }
})();
