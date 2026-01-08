
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMode, Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string, 
  mode: AIMode,
  media?: { mimeType: string, data: string }
): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview'; 
    let userContent: any = [];
    if (newMessage) userContent.push({ text: newMessage });
    if (media) {
      const base64Data = media.data.split(',')[1] || media.data;
      userContent.push({ inlineData: { mimeType: media.mimeType, data: base64Data } });
    }
    const chat = ai.chats.create({
      model: modelId,
      config: { temperature: 0.7 },
      history: history.slice(0, -1).map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const response: GenerateContentResponse = await chat.sendMessage({ message: { parts: userContent } });
    return response.text || "No pude procesar la solicitud.";
  } catch (error) {
    return "Error de conexión.";
  }
};

export const generateExamWithGemini = async (
    topic: string, 
    difficulty: string, 
    qCount: number, 
    docContext?: string
): Promise<string> => {
  try {
    const modelId = 'gemini-3-pro-preview'; 
    let rigorFocus = "";
    let thinkingBudget = 0;

    switch(difficulty) {
        case 'Basic':
            rigorFocus = "FORMATO: GUÍA DE ESTUDIO. Estructura: Título, Breve introducción teórica, Ejemplos, Ejercicios. Tono: Tutorial.";
            break;
        case 'Intermediate':
            rigorFocus = "FORMATO: CONTROL SEMANAL. Estructura: Título, Instrucciones, Preguntas con puntaje. Tono: Evaluativo estándar.";
            break;
        case 'University':
            rigorFocus = "FORMATO: EXAMEN SOLEMNE UNAB. Estructura: Encabezado Institucional, Instrucciones de tiempo/comportamiento, Ítem I (Selección Múltiple), Ítem II (Desarrollo). Tono: Académico Riguroso.";
            thinkingBudget = 16000; 
            break;
        case 'PhD':
            rigorFocus = "FORMATO: EXAMEN DE DOCTORADO. Estructura: Análisis de casos complejos, Preguntas de síntesis crítica. Tono: Científico Avanzado.";
            thinkingBudget = 24576; 
            break;
    }

    const prompt = `Actúa como un Diseñador Curricular Senior de la Universidad Andrés Bello. 
    Genera un documento profesional sobre: ${topic}.

    ESTRUCTURA TÉCNICA (SIGUE ESTO AL PIE DE LA LETRA):
    1. ${rigorFocus}
    2. ENCABEZADO: Comienza con '# ' seguido del nombre de la evaluación.
    3. IDENTIFICACIÓN: La segunda línea debe ser exactamente: 'NOMBRE: ........................................ RUT: ...................... FECHA: ......................'
    4. PREGUNTAS: Usa '1. ', '2. ', etc.
    5. ALTERNATIVAS: Deben ir en líneas nuevas como 'A) ', 'B) ', 'C) ', 'D) '.
    6. CLAVE DE RESPUESTAS: Al final del documento, añade una sección '## CLAVE DE RESPUESTAS' con las respuestas correctas.
    
    RESTRICCIONES ESTÉTICAS:
    - NO USES markdown como **negritas** o _cursivas_ dentro de las preguntas.
    - NO USES símbolos de LaTeX ($, \\, {}, []).
    - Usa solo símbolos UTF-8: √, Δ, π, ±, ², ³, Σ.
    - Evita el uso de '####' o exceso de niveles de títulos.

    ${docContext ? `Usa este contexto como fuente obligatoria:\n${docContext}` : ""}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.1,
        thinkingConfig: thinkingBudget > 0 ? { thinkingBudget } : undefined
      }
    });

    return response.text || "Error en la generación del documento académico.";
  } catch (error) {
    console.error("Exam Gen Error:", error);
    throw error;
  }
};
