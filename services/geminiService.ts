import { GoogleGenAI, GenerateContentResponse, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAiInstance = (): GoogleGenAI => {
    if (ai) return ai;

    if (!process.env.API_KEY) {
        // This specific error message is caught in App.tsx to show a user-friendly message.
        throw new Error("API_KEY_MISSING");
    }

    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
};

const parseJsonResponse = (text: string) => {
    try {
        // Clean the response from markdown code blocks before parsing
        const cleanedText = text.replace(/```json|```/g, '').trim();
        if (!cleanedText) {
             return { type: 'error', detail: 'The AI returned an empty response.' };
        }
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", text, error);
        return { type: 'error', detail: 'Invalid JSON response', originalText: text };
    }
};

export const startNewGame = () => {
    const aiInstance = getAiInstance();
    chat = aiInstance.chats.create({
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
        const text = response.text;
        
        // Handle cases where the response is blocked or doesn't contain text
        if (typeof text !== 'string' || text.trim() === '') {
            console.error("Gemini response did not contain text or was empty.", response);
            const blockReason = response.candidates?.[0]?.finishReason;
            if (blockReason === "SAFETY") {
                return { type: 'error', detail: 'The response was blocked for safety reasons.' };
            }
            return { type: 'error', detail: 'The AI gave an invalid or empty response.' };
        }
        
        return parseJsonResponse(text);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { type: 'error', detail: 'API call failed' };
    }
};