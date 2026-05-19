const CHATBOT_BACKEND_URL = "https://burger-flames.onrender.com/chat";

document.body.insertAdjacentHTML("beforeend", `
   <!-- Toggle Button -->
  <button id="chat-toggle" onclick="toggleChat()">
    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  </button>
 
  <!-- Chat Window -->
  <div id="chat-window">
    <!-- Header -->
    <div id="chat-header">
      <div class="avatar">BF</div>
      <div class="info">
        <h3>Burger Flames</h3>
        <p><span class="online-dot"></span>AI Assistant • Online</p>
      </div>
      <button id="close-chat" onclick="toggleChat()">×</button>
    </div>
 
    <!-- Messages -->
    <div id="chat-messages"></div>
 
    <!-- Input -->
    <div id="chat-input-area">
      <input type="text" id="chat-input" placeholder="Type a message..." onkeydown="handleKey(event)">
      <button id="send-btn" onclick="sendMessage()">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
 
    <div id="powered-by">⚡ Powered by LIGHT</div>
  </div>
`);

















const style = document.createElement("style");

style.textContent = `
   /* ===== CHAT TOGGLE BUTTON ===== */
    #chat-toggle {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      background: #E07B23;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(224, 123, 35, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
 
    #chat-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(224, 123, 35, 0.7);
    }
 
    #chat-toggle svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
 
    /* ===== CHAT WINDOW ===== */
    #chat-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 360px;
      height: 520px;
      background: #1a1a1a;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 998;
      font-family: 'Inter', sans-serif;
      color: #f0f0f0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      pointer-events: none;
      font-family: "Lora", serif;
    }

    #chat-window,
#chat-window input,
#chat-window button {
  font-family: "Lora", serif;
}
 
    #chat-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    
 
    /* ===== HEADER ===== */
    #chat-header {
      background: #E07B23;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
 
    #chat-header .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Oswald', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: white;
    }
 
    #chat-header .info h3 {
      margin: 0;
      font-family: 'Oswald', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: white;
      letter-spacing: 0.5px;
    }
 
    #chat-header .info p {
      margin: 0;
      font-size: 12px;
      color: rgba(255,255,255,0.8);
    }
 
    #chat-header .online-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      display: inline-block;
      margin-right: 4px;
    }
 
    #close-chat {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
 
    #close-chat:hover { opacity: 1; }
 
    /* ===== MESSAGES AREA ===== */
    #chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: #333 transparent;
    }
 
    #chat-messages::-webkit-scrollbar { width: 4px; }
    #chat-messages::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
 
    /* Bot message */
    .msg-bot {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      font-family: "Lora", serif !important;
    }
 
    .msg-bot .bubble {
      background: #2a2a2a;
      color: #f0f0f0;
      padding: 10px 14px;
      border-radius: 18px 18px 18px 4px;
      font-size: 14px;
      line-height: 1.5;
      max-width: 78%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: "Lora", serif !important;
    }
 
    .msg-bot .bot-icon {
      width: 28px;
      height: 28px;
      background: #E07B23;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Oswald', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      font-family: "Lora", serif !important;
    }

    .typing-bubble {
    display: flex;
    gap: 4px;
    align-items: center;
    }

    .typing-bubble span {
    width: 6px;
    height: 6px;
    background: #777;
    border-radius: 50%;
    animation: typing 1s infinite ease-in-out;
    }

    .typing-bubble span:nth-child(2) {
    animation-delay: 0.15s;
    }

    .typing-bubble span:nth-child(3) {
    animation-delay: 0.3s;
    }

    @keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.7);
        opacity: 0.4;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
    }
 
    /* User message */
    .msg-user {
      display: flex;
      justify-content: flex-end;
      font-family: "Lora", serif !important;
    }
 
    .msg-user .bubble {
      background: #E07B23;
      color: white;
      padding: 10px 14px;
      border-radius: 18px 18px 4px 18px;
      font-size: 14px;
      line-height: 1.5;
      max-width: 78%;
      box-shadow: 0 2px 8px rgba(224, 123, 35, 0.3);
        font-family: "Lora", serif !important;
    }
 
    /* Quick reply buttons */
    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
      padding-left: 36px;
    }
 
    .quick-reply-btn {
      background: transparent;
      border: 1.5px solid #E07B23;
      color: #E07B23;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
 
    .quick-reply-btn:hover {
      background: #E07B23;
      color: white;
    }
 
    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }
 
    .typing-indicator .bubble {
      background: #2a2a2a;
      padding: 12px 16px;
      border-radius: 18px 18px 18px 4px;
      display: flex;
      gap: 4px;
      align-items: center;
    }
 
    .typing-indicator .dot {
      width: 7px;
      height: 7px;
      background: #888;
      border-radius: 50%;
      animation: bounce 1.2s infinite;
    }
 
    .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
 
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
 
    /* ===== INPUT AREA ===== */
    #chat-input-area {
      padding: 12px 16px;
      background: #222;
      border-top: 1px solid #333;
      display: flex;
      gap: 10px;
      align-items: center;
    }
 
    #chat-input {
      flex: 1;
      background: #2a2a2a;
      border: 1.5px solid #333;
      border-radius: 24px;
      padding: 10px 16px;
      color: #f0f0f0;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }
 
    #chat-input:focus { border-color: #E07B23; }
    #chat-input::placeholder { color: #666; }
 
    #send-btn {
      width: 40px;
      height: 40px;
      background: #E07B23;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 10px rgba(224, 123, 35, 0.4);
    }
 
    #send-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 16px rgba(224, 123, 35, 0.6);
    }
 
    #send-btn svg {
      width: 18px;
      height: 18px;
      fill: white;
    }
 
    /* ===== POWERED BY ===== */
    #powered-by {
      text-align: center;
      padding: 6px;
      font-size: 11px;
      color: #444;
      background: #1a1a1a;
    }

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.suggestions button {
  border: 1px solid #1a1a1a;
  background: #ed974c;
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.suggestions button:hover {
  background: #e07b23;
  color: white;
}

.bot-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
`;

@media (max-width: 600px) {
  #chat-window {
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    right: 12px;
    bottom: 12px;
    border-radius: 18px;
  }

  #chat-toggle {
    right: 16px;
    bottom: 16px;
    width: 58px;
    height: 58px;
  }

  #chat-header {
    padding: 14px 16px;
  }

  #chat-messages {
    padding: 14px;
  }

  .bubble {
    max-width: 85%;
    font-size: 14px;
  }

  .suggestions {
    max-width: 100%;
  }

  .suggestions button {
    font-size: 12px;
    padding: 7px 10px;
  }

  #chat-input-area {
    padding: 12px;
  }

  #chat-input {
    font-size: 14px;
  }
}

document.head.appendChild(style);














function toggleChat() {
      const win = document.getElementById('chat-window');
      win.classList.toggle('open');
    }
 
    function handleKey(e) {
      if (e.key === 'Enter') sendMessage();
    }

    const conversation = [
  {
    role: "system",
    content: `
You are the Burger Flames website helpfulassistant.

Your job:
- Answer only questions related to Burger Flames, its food, ordering, delivery, location, careers, news, food quality, allergens, privacy, and terms.
- Keep replies short, friendly, and clear.
- Use simple language.
- If the user asks for food suggestions, recommend items from the Burger Flames menu.
- If the user asks something unrelated to Burger Flames, politely say: "I can only help with Burger Flames questions."

Follow-up behavior:
- After answering, you may ask one short relevant follow-up question when it truly helps.
- The follow-up question should help the customer choose food, order from the website, find the location, or get more details.
- Do not ask more than one question at a time.

Back-off behavior:
- Do not ask a follow-up question after every reply.
- Ask a follow-up only when it clearly helps the user continue.
- Do not ask a follow-up if the user says thanks, okay, cool, nice, great, yes, no, maybe, I understand, got it, or anything similar.
- Do not ask a follow-up if you already gave contact details, address, policies, privacy info, terms, or a final answer.
- Do not ask a follow-up if the answer is about what you cannot do.
- If the user seems finished, end politely without asking another question.

Burger Flames details:
- Burger Flames is a burger restaurant in Lagos, Nigeria.
- Address: 20 Cooper Avenue, Lagos, Nigeria.
- Phone: (234) 8118 850 121.
- Customers can order from the website by choosing a location and using Order Now.
- Menu items shown include Inferno, Lovers Delight, and Crispy Onion.
- Burger Flames focuses on custom burgers, fast delivery, easy ordering, and strong food quality.
- Burger Flames lets customers choose their bun, patty, toppings, and sauces.
- Website sections include Order, Menu, Offers, Restaurants, Careers, News, Terms and Conditions, Privacy Policy, Allergens Info, Food Quality, and Responsibility.

Ordering limits:
- You cannot place orders, take payments, reserve food, or confirm delivery.
- If a customer wants to order, guide them to use the Order Now button on the website.
- If the customer needs human help, give them the Burger Flames phone number: (234) 8118 850 121.
- Never say an order has been placed or confirmed.

Style:
- Do not write long paragraphs.
- Use 1 to 3 short sentences for most answers.
- If listing options, use short bullet points.
- Do not invent prices, opening hours, delivery fees, or menu items that are not provided.
- If information is missing, tell the customer to contact Burger Flames directly.
`
  }
];
    async function sendMessage(){
        const messageInput = document.getElementById("chat-input").value.trim();
             if (!messageInput) return;
            const chatMessages = document.getElementById("chat-messages");
  conversation.push({
    role: "user",
    content: messageInput
  });

  chatMessages.innerHTML += `
  <div class="msg-user">
    <div class="bubble">
      ${messageInput}
    </div>
  </div>

  <div class="msg-bot" id="typing-message">
    <div class="bot-icon">B</div>
    <div class="bubble typing-bubble">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
`;

chatMessages.scrollTop = chatMessages.scrollHeight;
document.getElementById("chat-input").value = "";

       document.querySelectorAll(".suggestions").forEach(function(suggestion) {
  suggestion.remove();
});
              


    let aiReply;


        try{
            const aiResponse = await fetch(CHATBOT_BACKEND_URL,{ 
            method: "POST",
            headers: {
                "Content-type": "application/json"
             },
            body: JSON.stringify({
                messages: conversation
            })
         })

            const data = await aiResponse.json();
          aiReply = data.choices[0].message.content;
       }catch (error) {
                 aiReply = "Sorry, something went wrong. Please try again.";
            }
            conversation.push({
    role: "assistant",
    content: aiReply
  });
           document.getElementById("typing-message").remove();

chatMessages.innerHTML += `
  <div class="msg-bot">
    <div class="bot-icon">B</div>
    <div class="bot-content">
    <div class="bubble">
      ${aiReply}
    </div>
    ${getSuggestions(messageInput)}
  </div>
  </div>
`;


chatMessages.scrollTop = chatMessages.scrollHeight;
 }

 function sendSuggestion(text) {
  document.getElementById("chat-input").value = text;
  sendMessage();
}

function getSuggestions(message) {
  const text = message.toLowerCase();

  if (text.includes("lover") || text.includes("delight")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('I want to order Lovers Delight')">Order Lovers Delight</button>
        <button onclick="sendSuggestion('Can I customize Lovers Delight?')">Customize it</button>
        <button onclick="sendSuggestion('What toppings go well with Lovers Delight?')">Best toppings</button>
      </div>
    `;
  }

  if (text.includes("inferno")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('I want to order Inferno')">Order Inferno</button>
        <button onclick="sendSuggestion('Is Inferno spicy?')">Is it spicy?</button>
        <button onclick="sendSuggestion('Can I customize Inferno?')">Customize it</button>
      </div>
    `;
  }

  if (text.includes("crispy") || text.includes("onion")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('I want to order Crispy Onion')">Order Crispy Onion</button>
        <button onclick="sendSuggestion('What comes with Crispy Onion?')">What comes with it?</button>
        <button onclick="sendSuggestion('Can I customize Crispy Onion?')">Customize it</button>
      </div>
    `;
  }

  if (text.includes("custom") || text.includes("topping") || text.includes("sauce") || text.includes("patty") || text.includes("bun")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('What toppings can I choose?')">Choose toppings</button>
        <button onclick="sendSuggestion('Can I choose my bun and patty?')">Bun and patty</button>
        <button onclick="sendSuggestion('What sauces do you recommend?')">Sauce ideas</button>
      </div>
    `;
  }

  if (text.includes("menu") || text.includes("burger") || text.includes("recommend")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('Tell me about Inferno')">Inferno</button>
        <button onclick="sendSuggestion('Tell me about Lovers Delight')">Lovers Delight</button>
        <button onclick="sendSuggestion('Tell me about Crispy Onion')">Crispy Onion</button>
      </div>
    `;
  }

  if (text.includes("order") || text.includes("delivery")) {
    return `
      <div class="suggestions">
      <button onclick="sendSuggestion('How do I use the Order Now button?')">Use Order Now</button>
      <button onclick="sendSuggestion('Can I customize before ordering?')">Customize first</button>
      <button onclick="sendSuggestion('How can I contact support?')">Contact support</button>
    </div>
    `;
  }

  if (text.includes("support") || text.includes("help") || text.includes("contact") || text.includes("phone") || text.includes("call")) {
  return `
    <div class="suggestions">
      <button onclick="sendSuggestion('What is Burger Flames phone number?')">Phone number</button>
      <button onclick="sendSuggestion('Where is Burger Flames located?')">Location</button>
      <button onclick="sendSuggestion('How do I order online?')">Order online</button>
    </div>
  `;
}

  if (text.includes("location") || text.includes("address") || text.includes("where")) {
    return `
      <div class="suggestions">
        <button onclick="sendSuggestion('What is the phone number?')">Call Burger Flames</button>
        <button onclick="sendSuggestion('How can I order from this location?')">Order from there</button>
      </div>
    `;
  }

  return `
    <div class="suggestions">
      <button onclick="sendSuggestion('What burgers do you recommend?')">Burger picks</button>
      <button onclick="sendSuggestion('Can I customize my burger?')">Customize burger</button>
      <button onclick="sendSuggestion('How do I order from the website?')">How to order</button>
    </div>
  `;
}
