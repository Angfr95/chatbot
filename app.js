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
    e.preventDefault(); // empêche le saut de ligne
    sendMessage();      // appelle ta fonction pour envoyer le message
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


async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage("Moi", text);
  input.value = "";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${process.env.GROQ_API_KEY}"  // ⚠️ Mets ta clé Groq ici
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",  // modèle gratuit dispo chez Groq
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    addMessage("Bot", botReply || "🤖 Je n’ai pas de réponse.");
  } catch (err) {
    addMessage("Bot", "❌ Erreur avec l’API.");
    console.error(err);
  }
}


