import React, { useState, useRef, useEffect } from 'react';
import { AIMode, Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send,  Brain,  HeartHandshake,  Briefcase,  FileText, Bot } from 'lucide-react';

const AIChat: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AIMode>(AIMode.TUTOR);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu asistente UNAB. ¿En qué modo te gustaría trabajar hoy? Puedo ayudarte a estudiar, escucharte si tienes estrés, o planificar tu carrera.',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Filter only relevant history for context window management
      const historyContext = messages.slice(-10); 
      const responseText = await sendMessageToGemini(historyContext, userMsg.text, activeMode);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: 'Lo siento, tuve un problema de conexión. Intenta nuevamente.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getModeColor = () => {
    switch (activeMode) {
      case AIMode.TUTOR: return 'bg-blue-600';
      case AIMode.PSYCHOLOGIST: return 'bg-teal-500';
      case AIMode.COACH: return 'bg-purple-600';
      case AIMode.BUROCRACY: return 'bg-slate-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Mode Selector Header */}
      <div className="bg-white border-b border-slate-200 p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveMode(AIMode.TUTOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeMode === AIMode.TUTOR ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Brain className="w-4 h-4" /> Tutor Socrático
          </button>
          <button
            onClick={() => setActiveMode(AIMode.PSYCHOLOGIST)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeMode === AIMode.PSYCHOLOGIST ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <HeartHandshake className="w-4 h-4" /> Psicólogo
          </button>
          <button
            onClick={() => setActiveMode(AIMode.COACH)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeMode === AIMode.COACH ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Briefcase className="w-4 h-4" /> Coach Carrera
          </button>
           <button
            onClick={() => setActiveMode(AIMode.BUROCRACY)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeMode === AIMode.BUROCRACY ? 'bg-slate-200 text-slate-800 ring-2 ring-slate-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <FileText className="w-4 h-4" /> Burocracia
          </button>
        </div>
        <div className="text-xs text-center mt-2 text-slate-400">
          {activeMode === AIMode.TUTOR && "Modo: Carga Syllabus PDF para respuestas basadas en bibliografía."}
          {activeMode === AIMode.PSYCHOLOGIST && "Modo: Espacio seguro y confidencial. En caso de emergencia llama al *4141."}
          {activeMode === AIMode.COACH && "Modo: Preparación para entrevistas y consejos laborales."}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-1">
                   <Bot className={`w-4 h-4 ${activeMode === AIMode.PSYCHOLOGIST ? 'text-teal-500' : 'text-blue-500'}`} />
                   <span className="text-xs font-bold text-slate-400 uppercase">{activeMode}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 pb-6 md:pb-4">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={activeMode === AIMode.PSYCHOLOGIST ? "Cuéntame cómo te sientes..." : "Escribe tu pregunta..."}
            className="flex-1 bg-slate-100 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-slate-300 focus:outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-3 rounded-full text-white shadow-md transition-all ${getModeColor()} ${(!input.trim() || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;