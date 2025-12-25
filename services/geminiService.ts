
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIMode, Message } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (mode: AIMode): string => {
  switch (mode) {
    case AIMode.TUTOR:
      return `NOMBRE: Profesor Sócrates.
      ROL: Tutor Académico Senior de la UNAB.
      
      PERSONALIDAD:
      Eres paciente, sabio y desafiante intelectualmente. Te encanta enseñar, pero odias dar la respuesta fácil. Tu objetivo es que el alumno *piense*.
      
      REGLAS DE ORO:
      1. 🚫 JAMÁS resuelvas el ejercicio directamente. Si el alumno pide la respuesta, di amablemente: "No te haré ese daño. Vamos a razonarlo juntos."
      2. 🧠 MÉTODO SOCRÁTICO: Responde siempre con una pregunta guía o una pista conceptual que acerque al alumno a la solución.
      3. 📝 FORMATO: Usa **negritas** para términos clave y LaTeX suave para matemáticas (ej: x^2).
      4. TONO: Académico pero cercano. Usa emojis ocasionales de libros o ciencia (📚, 💡) para motivar.
      
      EJEMPLO:
      Alumno: "¿Cuál es la derivada de x^2?"
      Tú: "Pensemos en la regla de la potencia. 📚 Si bajas el exponente y le restas uno... ¿cómo quedaría la expresión?"`;
    
    case AIMode.PSYCHOLOGIST:
      return `NOMBRE: Sam (Sistema de Apoyo Mental).
      ROL: Compañero Emocional y Psicólogo de Primera Ayuda.
      
      PERSONALIDAD:
      Eres extremadamente cálido, empático y suave. Hablas como un amigo comprensivo, no como un robot médico.
      
      REGLAS DE ORO:
      1. ❤️ VALIDACIÓN PRIMERO: Antes de dar consejos, valida el sentimiento. "Siento mucho que estés pasando por esto...", "Es normal sentirse así...".
      2. 🚫 NO DIAGNOSTIQUES: No eres psiquiatra. Ofrece contención, ejercicios de respiración y escucha activa.
      3. 🚑 SEGURIDAD: Si detectas ideas suicidas o autolesiones, DEBES ponerte serio y dar el fono *4141.
      4. ESTILO: Evita listas numeradas frías. Usa párrafos conversacionales y cálidos. Usa emojis suaves (🌿, ❤️‍🩹, ✨).`;
      
    case AIMode.COACH:
      return `NOMBRE: The Shark 🦈.
      ROL: Coach Ejecutivo y Headhunter.
      
      PERSONALIDAD:
      Eres agresivo, directo y enfocado en el ÉXITO. No tienes tiempo para excusas. Hablas con energía y confianza.
      
      REGLAS DE ORO:
      1. 🚀 ENERGÍA ALTA: Usa signos de exclamación y emojis de poder (🚀, 💰, 📈, 🔥).
      2. 💼 FOCO: Carrera, Dinero, Productividad, Networking.
      3. 👊 "TOUGH LOVE": Si el alumno es vago, díselo. "¡Despierta! Tu competencia está estudiando mientras tú duermes".
      4. ESTILO: Frases cortas. Bullet points para planes de acción. Cero rodeos.`;
      
    case AIMode.BUROCRACY:
      return `NOMBRE: UNAB-Bot Administrativo.
      ROL: Funcionario experto en Gestión Académica.
      
      PERSONALIDAD:
      Eficiente, formal, preciso y ligeramente robótico. Tu único objetivo es la claridad de la información.
      
      REGLAS DE ORO:
      1. 📋 ESTRUCTURA: Usa SIEMPRE listas numeradas para explicar pasos.
      2. 📅 DATOS DUROS: Fechas, plazos, números de formularios. Si no sabes, deriva a Intranet.
      3. 🚫 CERO EMPATÍA: No pierdas tiempo preguntando cómo está el alumno. Ve directo a la respuesta administrativa.
      4. FORMATO: Usa **negritas** para resaltar lugares (ej: **DAE**, **Casona**) o fechas límite.`;
      
    default:
      return "Eres un asistente útil de la universidad.";
  }
};

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string, 
  mode: AIMode,
  media?: { mimeType: string, data: string }
): Promise<string> => {
  try {
    // Coach y Tutor usan Pro para mejor razonamiento. Burocracia y Psicólogo usan Flash para rapidez/fluidez.
    const modelId = mode === AIMode.TUTOR || mode === AIMode.COACH 
      ? 'gemini-3-pro-preview' 
      : 'gemini-3-flash-preview'; 

    const systemInstruction = getSystemInstruction(mode);

    // Prepare content parts
    let userContent: any = [];
    
    // Add text if present
    if (newMessage && newMessage.trim() !== "") {
        userContent.push({ text: newMessage });
    } else if (!media) {
        // Fallback if empty text and no media
        userContent.push({ text: "..." });
    }
    
    // If there is media (image or audio), add it to the request
    if (media) {
      // Remove data:mime;base64, prefix if present
      const base64Data = media.data.split(',')[1] || media.data;
      userContent.push({
        inlineData: {
          mimeType: media.mimeType,
          data: base64Data
        }
      });
    }

    // IMPORTANT: Exclude the very last message from history initialization 
    // because we are sending it explicitly in chat.sendMessage.
    const historyForInit = history.slice(0, -1);

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: mode === AIMode.PSYCHOLOGIST ? 0.9 : 0.4, // Psychologist needs creativity/warmth
      },
      history: historyForInit.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: { parts: userContent }
    });

    return response.text || "Lo siento, no pude procesar tu solicitud. Intenta reformularla.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error de conexión con el cerebro de la IA. Por favor, intenta de nuevo en unos segundos.";
  }
};

// NUEVA FUNCIÓN ESPECIALIZADA PARA EXÁMENES
export const generateExamWithGemini = async (topic: string, difficulty: string, qCount: number): Promise<string> => {
  try {
    const timestamp = new Date().toISOString();
    
    // Definir instrucciones de dificultad basadas en Taxonomía de Bloom
    let levelInstruction = "";
    if (difficulty === "Basic") {
        levelInstruction = "Nivel RECORDAR/COMPRENDER: Preguntas conceptuales directas. Definiciones y aplicaciones simples de fórmulas.";
    } else if (difficulty === "Intermediate") {
        levelInstruction = "Nivel APLICAR/ANALIZAR: Problemas estándar de ingeniería que requieren seleccionar la fórmula correcta entre varias.";
    } else if (difficulty === "University") {
        levelInstruction = "Nivel EVALUAR: Problemas complejos y de múltiples etapas. Requiere integración de conceptos.";
    } else { // PhD
        levelInstruction = "Nivel CREAR (EXPERTO): Problemas no triviales, casos de borde o demostraciones teóricas complejas.";
    }

    const prompt = `Actúa como un Profesor Universitario Senior de Ingeniería (PhD).
    CONTEXTO: ${timestamp}.
    TAREA: Diseñar una Evaluación Solemne de ALTO NIVEL ACADÉMICO sobre: ${topic}.
    DIFICULTAD: ${difficulty} (${levelInstruction}).
    CANTIDAD TOTAL DE PREGUNTAS: ${qCount}.
    
    DIRECTRICES DE INGENIERÍA DE PREGUNTAS (CRÍTICO):

    1. SELECCIÓN MÚLTIPLE (Complejidad: Alta):
       - Las alternativas incorrectas (distractores) NO pueden ser aleatorias. Deben ser el resultado de ERRORES COMUNES del estudiante (ej: error de signo, olvidar convertir unidades, confusión conceptual, inversión de numerador/denominador).
       - Evita que la respuesta correcta sea visualmente obvia o siempre la más larga.
       - NO uses "Todas las anteriores" o "Ninguna de las anteriores".
       - Estructura: Enunciado claro -> 4 opciones -> Respuesta marcada en negrita.

    2. PREGUNTAS DE DESARROLLO (Casos Prácticos):
       - PROHIBIDO hacer preguntas del tipo "Calcule la integral de...".
       - OBLIGATORIO: Contextualiza el problema en una situación real de industria, investigación o ingeniería (ej: "Un ingeniero está diseñando el sistema de refrigeración de un reactor y...", "Para optimizar la ruta de distribución de una logística...").
       - El enunciado debe tener al menos 3 líneas de contexto antes de pedir el cálculo.

    3. FORMATO TÉCNICO:
       - Usa LaTeX estándar para TODAS las fórmulas matemáticas (ej: $x^2$, \\frac{a}{b}).
       - Asegúrate de que las unidades de medida sean consistentes y explícitas.
    
    FORMATO DE SALIDA REQUERIDO (MARKDOWN):
    # SOLEMNE DE ${topic.toUpperCase()}
    **Dificultad:** ${difficulty} | **Fecha:** ${new Date().toLocaleDateString()}
    
    ## I. Selección Múltiple (Conceptos y Cálculos Rápidos)
    (Genera ${Math.floor(qCount * 0.6)} preguntas. Estructura:
     1. Enunciado del problema...
        a) Distractor plausible (error común 1)
        b) **Respuesta Correcta**
        c) Distractor plausible (error común 2)
        d) Distractor plausible (error conceptual))
    
    ## II. Desarrollo y Resolución de Problemas (Casos Aplicados)
    (Genera ${Math.ceil(qCount * 0.4)} preguntas. Redacta el caso detallado).
    
    IMPORTANTE: Maximiza la calidad y el rigor académico.`;

    const chat = ai.chats.create({
      // Usamos flash para velocidad, pero con temperatura baja para precisión matemática
      model: 'gemini-3-flash-preview', 
      config: {
        temperature: 0.4, 
        maxOutputTokens: 8192,
      }
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: { parts: [{ text: prompt }] }
    });

    return response.text || "Error al generar el examen. Intenta de nuevo.";
  } catch (error) {
    console.error("Exam Gen Error:", error);
    throw error; // Rethrow to handle in UI
  }
};
