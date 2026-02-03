import { GoogleGenAI } from "@google/genai";
import { trackGemini } from "opik-gemini";
import { Opik } from "opik";

// Create Opik client
const opikClient = new Opik({
  apiKey: process.env.OPIK_API_KEY,
  workspaceName: process.env.OPIK_WORKSPACE,
  projectName: 'pace-reading-app',
});

// Create Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Wrap with Opik tracking
const trackedGenAI = trackGemini(genAI, {
  client: opikClient,
  traceMetadata: {
    tags: ['pace-reading-app', 'gemini'],
  },
});

export default trackedGenAI;