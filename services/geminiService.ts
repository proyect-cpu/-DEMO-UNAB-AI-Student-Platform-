import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMode, Message } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (mode: AIMode): string => {
  switch (mode) {
    case AIMode.TUTOR:
      return `Eres un Tutor Socrático de la Universidad Andrés Bello. 
      Tu objetivo no es dar respuestas directas, sino guiar al estudiante para que encuentre la solución.
      - Usa analogías (fútbol, cocina, vida diaria) si el concepto es difícil.
      - Si te envían una foto de una prueba, NIÉGATE a resolverla directamente, ofrece explicar el concepto teórico.
      - Cita fuentes académicas cuando sea posible.
      - Nivel de explicación por defecto: Universitario.`;
    
    case AIMode.PSYCHOLOGIST:
      return `Eres un Asistente de Bienestar Psicológico (IA) empático y validador.
      - Usa escucha activa.
      - ALERTA CRÍTICA: Si detectas ideación suicida o autolesión, activa el PROTOCOLO ROMPER EL VIDRIO: Deja de actuar, responde con urgencia y sugiere contactar al *4141 o ir al DAE.
      - Ofrece ejercicios de respiración si detectas ansiedad.
      - Mantén un tono calmado y seguro.`;
      
    case AIMode.COACH:
      return `Eres un Coach Laboral y Académico.
      - Sugiere electivos basados en tendencias de mercado.
      - Ayuda a preparar defensas de título actuando como jurado exigente.
      - Aconseja sobre burocracia universitaria con pasos claros.`;
      
    case AIMode.BUROCRACY:
      return `Eres el experto en Burocracia UNAB.
      - Explica paso a paso trámites como: toma de ramos, certificados, bloqueos financieros.
      - Sé preciso, breve y directo.`;
      
    default:
      return "Eres un asistente útil de la universidad.";
  }
};

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string, 
  mode: AIMode
): Promise<string> => {
  try {
    const modelId = mode === AIMode.TUTOR || mode === AIMode.COACH 
      ? 'gemini-3-pro-preview' // More reasoning for academic/career
      : 'gemini-3-flash-preview'; // Faster for chat/psych

    const systemInstruction = getSystemInstruction(mode);

    // Construct chat history for context (simplified for this demo)
    // In a real app, we would use chat.sendMessageStream with history preservation
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: mode === AIMode.TUTOR ? 0.4 : 0.7, // Lower temp for factual tutor
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: newMessage
    });

    return response.text || "Lo siento, no pude procesar tu solicitud.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error de conexión con el asistente.");
  }
};