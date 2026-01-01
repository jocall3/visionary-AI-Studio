
import { GoogleGenAI } from "@google/genai";
import { ImageStyle, GenerationSettings } from "../types";

const API_KEY = process.env.API_KEY;

export const generateAIImage = async (prompt: string, settings: GenerationSettings) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const finalPrompt = `${prompt}. Style: ${settings.style}. Negative prompt: ${settings.negativePrompt}. Guidance scale: ${settings.guidanceScale}. Seed: ${settings.seed}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const improvePromptWithAI = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = "You are a professional prompt engineer for AI image generators. Expand the user's short prompt into a rich, detailed, and highly descriptive prompt that includes lighting, texture, composition, and mood. Keep it under 100 words.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve this prompt: ${prompt}`,
      config: {
        systemInstruction
      }
    });
    
    return response.text?.trim() || prompt;
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return prompt;
  }
};
