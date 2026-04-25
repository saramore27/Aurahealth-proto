function postMessage() {
  const input = document.getElementById('chat-input');
  const box = document.getElementById('chat-box');
  const text = input.value.trim();

  if (!text) {
    return;
  }

  box.innerHTML += '<div class="msg user">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';

  const quick = text.toLowerCase();
  let reply = 'For better guidance, share your dosha type and your current issue (sleep, digestion, stress, food timing, or hydration).';

  if (quick.includes('water') || quick.includes('hydration')) {
    reply = 'Hydration tip: sip small amounts every 45-60 minutes and increase intake around workouts. Warm water is often easier for Vata and Kapha.';
  } else if (quick.includes('sleep')) {
    reply = 'Sleep tip: fixed bedtime, lower light after sunset, no heavy meals 2-3 hours before bed, and avoid intense screen exposure at night.';
  } else if (quick.includes('stress') || quick.includes('anxiety')) {
    reply = 'For stress: try 4-7-8 breathing for 5 cycles, gentle neck release, and a short walk. Repeat morning and evening.';
  } else if (quick.includes('protein') || quick.includes('diet') || quick.includes('eat')) {
    reply = 'Nutrition tip: keep each meal balanced with protein, fiber, and healthy fat. Use your routine tab to follow dosha-specific foods and avoid lists.';
  }

  box.innerHTML += '<div class="msg bot">' + reply + '</div>';
  box.scrollTop = box.scrollHeight;
  input.value = '';
}

document.addEventListener('DOMContentLoaded', function () {
  const sendBtn = document.getElementById('chat-send-btn');
  const input = document.getElementById('chat-input');

  sendBtn.addEventListener('click', postMessage);

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      postMessage();
    }
  });
});

// ==========================================
// 1. TOGGLE CHATBOT VISIBILITY (MISSING FUNCTION!)
// ==========================================
function toggleChatbot() {
    const widget = document.getElementById('chatbot-widget');
    const icon = document.getElementById('chatbot-icon');

    if (!widget) {
        console.error('Chatbot widget not found!');
        return;
    }

    // Toggle the collapsed class
    widget.classList.toggle('collapsed');

    // Update icon if it exists
    if (icon) {
        if (widget.classList.contains('collapsed')) {
            icon.className = 'fa-solid fa-chevron-up';
        } else {
            icon.className = 'fa-solid fa-chevron-down';
        }
    }

    // Focus on input when opening
    if (!widget.classList.contains('collapsed')) {
        const input = document.getElementById('chat-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
}

// ==========================================
// 2. SEND MESSAGE FUNCTION (IMPROVED)
// ==========================================
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chatbot-messages');

    if (!input || !messages) {
        console.error('Chat elements not found!');
        return;
    }

    const userText = input.value.trim();

    // Validate input
    if (!userText) {
        input.focus();
        return;
    }

    // Clear input immediately
    input.value = '';

    // Add user message
    messages.innerHTML += `
        <div class="message user-message" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 16px; border-radius: 18px; margin: 8px 0; max-width: 75%; margin-left: auto; text-align: right;">
            ${escapeHtml(userText)}
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `
        <div class="message ai-message" id="${typingId}" style="background: rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 18px; margin: 8px 0; max-width: 75%;">
            <i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    try {
        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{
                            text: "You are Aura, a warm and knowledgeable AI wellness assistant specializing in Ayurvedic guidance, yoga, and wellness. Provide helpful, empathetic, and concise responses. Keep answers under 100 words unless detailed explanation is needed."
                        }]
                    },
                    contents: [{
                        parts: [{
                            text: userText
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        // Remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.remove();
        }

        // Display AI response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            messages.innerHTML += `
                <div class="message ai-message" style="background: rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 18px; margin: 8px 0; max-width: 75%;">
                    ${escapeHtml(aiText)}
                </div>
            `;
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Chatbot Error:', error);

        // Remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.remove();
        }

        // Show error message
        messages.innerHTML += `
            <div class="message ai-message" style="background: rgba(255,59,48,0.2); padding: 12px 16px; border-radius: 18px; margin: 8px 0; max-width: 75%; border-left: 3px solid #ff3b30;">
                ⚠️ Sorry, I'm having trouble connecting. Please try again in a moment.
            </div>  `;
    }

    messages.scrollTop = messages.scrollHeight;
    input.focus();
}

// ==========================================
// 3. SECURITY: ESCAPE HTML TO PREVENT XSS
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// 4. INITIALIZE EVENT LISTENERS
// ==========================================
function initializeChatbot() {
    const input = document.getElementById('chat-input');
    const sendButton = document.querySelector('.btn-send');

    // Add Enter key support
    if (input) {
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    // Ensure send button works
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    console.log('✅ Chatbot initialized successfully!');
}

// ==========================================
// 5. AUTO-INITIALIZE WHEN DOM IS READY
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    initializeChatbot();
}

// Make functions globally accessible for inline onclick handlers
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;