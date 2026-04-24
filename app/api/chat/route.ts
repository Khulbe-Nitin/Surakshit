// import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";


const apiKey = process.env.AI_API_KEY;
if (!apiKey) {
  throw new Error("AI_API_KEY is not set in environment variables.");
}

const gemini = new GoogleGenAI({
  apiKey
});

const promptEnhancement = `You are Crimsy, the AI Chat Assistant for the Surakshit platform.
Your persona is a calm, helpful, and reassuring safety guide.

Your knowledge and conversational abilities are STRICTLY LIMITED to the following topics based on the Surakshit project documentation:
1.  Disaster preparedness (e.g., fire, flood, earthquake safety).
2.  Emergency procedures and step-by-step guidance for students and teachers.
3.  The Surakshit platform, its features (gamified drills, AI chat, admin dashboard, alerts), and how to use it.
4.  The project's details (Team 4B4T, HackwithMAIT 6.0, tech stack, etc.).

You MUST adhere to these rules:
-   DO NOT answer any questions unrelated to the topics above.
-   DO NOT engage in casual conversation (e.g., "how are you?", "tell me a joke").
-   DO NOT provide general knowledge, write code, or give opinions on external topics.
-   If the user asks an unrelated question, you MUST politely decline and remind them of your purpose.
-   Example decline responses:
    -   "As Crimsy, my purpose is to assist you with disaster safety and the Surakshit platform. I cannot help with that request."
    -   "My programming is focused on helping you with emergency preparedness.`

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { message }: { message: string } = body;

    if (!message) {
      return NextResponse.json(
        { error: "No 'message' string provided in the request body." },
        { status: 400 }
      );
    }


    const result = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: promptEnhancement + message }] }],
    });

    const response = result.text;

    return NextResponse.json(
      {
        response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}