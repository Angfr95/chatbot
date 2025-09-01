const btn = document.getElementById("chatbot-btn");
const box = document.getElementById("chatbot-box");
const messages = document.getElementById("messages");
const input = document.getElementById("userInput");

// ✅ Ouvrir/fermer la fenêtre de chat avec le bouton
btn.addEventListener("click", () => {
  box.style.display = (box.style.display === "flex") ? "none" : "flex";
});

// ✅ Envoi du message avec la touche Entrée
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ✅ Ajouter un message dans la fenêtre
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "msg " + (sender === "Moi" ? "user" : "bot");
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// ✅ Envoyer un message au serveur backend
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("Moi", text);
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    addMessage("Bot", data.reply || "🤖 Je n’ai pas de réponse.");
  } catch (err) {
    console.error(err);
    addMessage("Bot", "❌ Erreur avec le serveur.");
  }
}
