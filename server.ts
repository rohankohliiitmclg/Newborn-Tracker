import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for ChatGPT chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_GEMINI_API_KEY")) {
        return res.json({
          text: `I am your Lullaby & Cotton AI Assistant! I would love to help you with sleep training, outfit combinations, feeding schedules, or sensory activities. 

To help you get started right away:
- **Clothing Advice:** Focus on 100% organic cotton fabrics to soothe sensitive skin. For a room at 22°C (72°F), a soft bodysuit paired with a 1.0 TOG sleep sack is perfect.
- **Sleep Tip:** A standard wake window for a 3-month-old is around 60–90 minutes. Catching their yawn early prevents overtemperature sleep resistance!

*You can unlock full AI conversations with real-time customized responses by setting your Gemini API key in the Secrets panel inside the AI Studio settings.*`
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare system instruction
      const systemInstruction = `You are a warm, gentle, calm, intelligent, and deeply supportive AI Parenting Assistant named "Lullaby & Cotton Assistant".
Your tone should be comforting, supportive, clean, and highly encouraging to parents with infants (0-12 months).
You specialize in newborn care:
- Organically styled, highly breathable clothing recommendations depending on local weather, room temperature, skin conditions, and activity.
- Sleep guidance: tracking naps, schedules, wake windows, bedtime rituals, and white noise suggestions.
- Growth prediction, developmental milestones, and sensory play suggestions (e.g. tummy time, sensory bottles, texture exploring) tailored to their exact age.
- Product suggestions from Lullaby & Cotton (organic sleep bags, cloud-soft sleepsuits, sensitive-skin bodywear, cozy winter layers).

Keep responses digestible, kind, and emotionally nourishing. Always close with a supportive note for the parent.`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
        }
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong when contacting Gemini." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
