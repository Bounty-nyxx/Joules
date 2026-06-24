import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-initialize Gemini client to prevent crashes if GEMINI_API_KEY is not configured
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in your environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const PRESET_IDEAS = [
  {
    title: "Midnight Waves",
    genre: "Chill Lofi Hip-Hop",
    tempo: 85,
    lyricSample: "Neon lights reflecting in the puddles on the street / Listening to the rhythm of the rainy lofi beat..."
  },
  {
    title: "Hyperdrive",
    genre: "Synthesized Future Bass",
    tempo: 128,
    lyricSample: "Speed of sound, we're breaking through the atmospheric wall / Electric vibes, we ride the wave, we never fear to fall..."
  },
  {
    title: "My True Self",
    genre: "Melodic Acoustic Rap",
    tempo: 95,
    lyricSample: "I trace the strings looking for a remedy inside / No more secrets left to bury, no more places left to hide..."
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route: Get Preset Lyric inspiration
  app.get("/api/preset-ideas", (req, res) => {
    res.json(PRESET_IDEAS);
  });

  // API Route: AI Coach Chat Assistant
  app.post("/api/coach-chat", async (req, res) => {
    const { message, history = [], currentLyrics = "", bpm = 90, activeStyle = "Melodic Trap" } = req.body;

    try {
      const client = getGeminiClient();

      // Format previous chat dialogue briefly for context
      const formattedHistory = history.map((msg: any) => {
        const role = msg.sender === "user" ? "user" : "model";
        return {
          role,
          parts: [{ text: msg.text }]
        };
      });

      // Insert system instruction guiding the AI Coach Persona (Joules AI Coach)
      const systemInstruction = `You are "Joules AI Coach", an expert positive music educator, lofi beat designer, and songwriting coach inside the "Joules Music Studio".
Your mission is to help beginners and intermediate musicians write outstanding lyrics, construct smooth song formulas, configure comfortable BPM tempos, and develop high-quality loops.
Keep your responses friendly, constructive, motivating, and strictly concise (try to stay under 3 small paragraphs or bullet points). 
If the user asks for suggestions, give concrete musical ideas, e.g. "Try 90 BPM for melodic rap" or "Use a Hook-Verse-Hook structure".
Current user context:
- Studio tempo: ${bpm} BPM
- Selected Sound Vibe: ${activeStyle}
- Current lyrics in their editor: "${currentLyrics || "(None written yet)"}"`;

      // Build text for generateContent
      const contents = [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ];

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });

      const reply = response.text || "I'm vibing with that idea! To turn it into a track, try toggling our synth pads or sketching down some bars.";
      res.json({ reply });

    } catch (error: any) {
      console.error("AI Music Coach chat error:", error);
      res.json({
        reply: "Hey there! I am the Joules Studio backup assistant. Since my AI connection is offline, here's a pro-tip: Try clicking around our 16-step soundboards to lock in a hard 808 or a sweet acoustic loop to sing over!"
      });
    }
  });

  // API Route: Generate Structured Lyrics (AI Songwriter helper)
  app.post("/api/generate-lyrics", async (req, res) => {
    const { genre = "Melodic Rap", topic = "Ambition & Success", tone = "Uplifting", keywords = "" } = req.body;

    try {
      const client = getGeminiClient();

      const prompt = `Write a professional song in the genre of ${genre}.
- Topic: ${topic}
- Mood/Tone: ${tone}
- Additional Keywords: ${keywords || "None"}

The lyrics should consist of a standard song structure:
1. CHORUS/HOOK (Catchy, memorable melodic lines)
2. VERSE 1 (Deeper, narrative storytelling)
3. CHORUS/HOOK
4. VERSE 2 (Rhythmic, high energy, punchy)
5. OUTRO (Atmospheric fade-out)

Each segment should be structured clearly. Return the response strictly as a JSON object adhering to this schema:
{
  "title": "A sharp, catchy song title related to the theme",
  "recommendedBpm": Int (80 to 140),
  "lyricsText": "Full formatted song lyrics with segments clearly labeled in CAPITAL letters like [CHORUS] or [VERSE 1]."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              recommendedBpm: { type: Type.INTEGER },
              lyricsText: { type: Type.STRING, description: "Full structured lyrics with markdown segment headers" }
            },
            required: ["title", "recommendedBpm", "lyricsText"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content from Gemini.");
      }

      res.json(JSON.parse(responseText.trim()));

    } catch (error: any) {
      console.error("Lyrics generation error:", error);
      res.status(500).json({
        error: "Failed to generate lyrics.",
        title: "Durban Sunset",
        recommendedBpm: 92,
        lyricsText: `[CHORUS]\nUnderneath the Durban sunset, dreams are shining gold\nStories told in whispers, futures waiting to unfold\nYeah, we chasing down the spotlight, searching for a sign\nLeaving all the past behind under the stellar skyline\n\n[VERSE 1]\nCame from humble streets, now we making moves\nDancing on the edge, walking in these brand-new shoes\nIvy league dreams, acoustic strings in the background\nNo one in this city can ever make us look down...`
      });
    }
  });

  // Serve static assets / build files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JOULES SERVER] Active on http://localhost:${PORT}`);
  });
}

startServer();
