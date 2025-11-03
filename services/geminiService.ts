
import { GoogleGenAI, GenerateContentResponse, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

// Fix: Per coding guidelines, API key must be read from process.env.API_KEY without fallbacks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const parseJsonResponse = (text: string) => {
    try {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", text, error);
        return { type: 'error', detail: 'Invalid JSON response', originalText: text };
    }
};

export const startNewGame = () => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });
};

export const getGeminiResponse = async (message: string): Promise<any> => {
    if (!chat) {
        throw new Error("Game not started. Call startNewGame first.");
    }
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        const text = response.text.trim();
        return parseJsonResponse(text);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { type: 'error', detail: 'API call failed' };
    }
};
