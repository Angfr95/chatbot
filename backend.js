const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("✅ Backend fonctionne !");
});

// ✅ Route chatbot corrigée (utilise fetch natif de Node 20)
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
	model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    console.log("🔎 Réponse brute Groq:", JSON.stringify(data, null, 2));

    if (!data.choices) {
      return res.status(500).json({ reply: "Erreur API Groq", details: data });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Erreur côté serveur :", err);
    res.status(500).json({ reply: "Erreur serveur interne", error: err.message });
  }
});

// ✅ Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

