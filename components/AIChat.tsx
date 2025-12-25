
import React, { useState, useRef, useEffect } from 'react';
import { AIMode, Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Brain, HeartHandshake, Briefcase, FileText, Bot, Paperclip, Mic, X, Trash2, User, ChevronDown, CheckCircle, Sparkles, Square, AudioLines, Play } from 'lucide-react';

interface AIChatProps {
  histories: Record<AIMode, Message[]>;
  onUpdateHistory: (mode: AIMode, messages: Message[]) => void;
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const BOT_OPTIONS = [
  { mode: AIMode.TUTOR, label: 'Profesor Sócrates', desc: 'Tutor Académico', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  { mode: AIMode.PSYCHOLOGIST, label: 'Sam (Bienestar)', desc: 'Apoyo Emocional', icon: HeartHandshake, color: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-100' },
  { mode: AIMode.COACH, label: 'The Shark', desc: 'Coach de Carrera', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-100' },
  { mode: AIMode.BUROCRACY, label: 'Bot Administrativo', desc: 'Trámites y DAE', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-200' },
];

const AIChat: React.FC<AIChatProps> = ({ histories, onUpdateHistory, currentMode, onModeChange }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<{ url: string, blob: Blob } | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // State for Dropdown
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Get current messages based on persisted active mode
  const messages = histories[currentMode] || [];
  const currentBotObj = BOT_OPTIONS.find(b => b.mode === currentMode) || BOT_OPTIONS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMode, loading, isRecording, attachedAudio]);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`; // Max 128px
    }
  }, [input]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = () => {
    const resetMsg: Message = {
      id: Date.now().toString(),
      role: 'model',
      text: 'Memoria de esta sesión borrada. ¿En qué te puedo ayudar ahora?',
      timestamp: new Date()
    };
    onUpdateHistory(currentMode, [resetMsg]);
  };

  // AUDIO RECORDING LOGIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAttachedAudio({ url, blob });
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // @ts-ignore
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        // Prevent onstop from saving the blob by clearing state immediately (logic simplified)
        setIsRecording(false);
        setAttachedAudio(null);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    } else {
        setAttachedAudio(null);
    }
  };

  const formatDuration = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage && !attachedAudio) || loading) return;

    let textToSend = input;
    if (attachedAudio && !input.trim()) {
        textToSend = "[Audio Adjunto]";
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    // 1. Optimistic Update
    const updatedMessages = [...messages, userMsg];
    onUpdateHistory(currentMode, updatedMessages);
    
    setInput('');
    const currentImage = attachedImage;
    const currentAudio = attachedAudio;

    setAttachedImage(null);
    setAttachedAudio(null);
    setLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

    try {
      // Create context, including the message we just added
      const historyContext = updatedMessages; 
      
      let mediaPayload = undefined;
      
      if (currentImage) {
          mediaPayload = { mimeType: 'image/jpeg', data: currentImage };
      } else if (currentAudio) {
          // Convert Blob to Base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
              reader.onloadend = () => {
                  resolve(reader.result as string);
              };
              reader.readAsDataURL(currentAudio.blob);
          });
          const base64Audio = await base64Promise;
          mediaPayload = { mimeType: 'audio/webm', data: base64Audio };
      }
      
      const responseText = await sendMessageToGemini(historyContext, userMsg.text, currentMode, mediaPayload);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      // 2. Final Update
      onUpdateHistory(currentMode, [...updatedMessages, botMsg]);

    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: 'Lo siento, mis circuitos están sobrecargados. Intenta de nuevo.',
        timestamp: new Date(),
        isError: true
      };
      onUpdateHistory(currentMode, [...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case AIMode.TUTOR: return 'bg-blue-600';
      case AIMode.PSYCHOLOGIST: return 'bg-teal-500';
      case AIMode.COACH: return 'bg-purple-600';
      case AIMode.BUROCRACY: return 'bg-slate-600';
      default: return 'bg-red-600';
    }
  };

  // Simple formatting helper for Bold and Lines
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Check for bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
         return (
             <li key={i} className="ml-4 list-disc pl-1 mb-1">
                 {line.replace(/^[-*]\s+/, '').split('**').map((part, idx) => 
                     idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                 )}
             </li>
         );
      }
      // Check for numbered lists
      if (/^\d+\./.test(line.trim())) {
         return (
             <div key={i} className="mb-1 ml-2 font-medium">
                 {line.split('**').map((part, idx) => 
                     idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                 )}
             </div>
         );
      }
      // Standard Paragraph with bold support
      return (
        <p key={i} className="min-h-[1em] mb-1 last:mb-0">
          {line.split('**').map((part, idx) => 
             idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* RICH BOT SELECTOR HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-20 flex items-center justify-between sticky top-0 h-[70px]">
        
        {/* DROPDOWN TRIGGER */}
        <div className="relative flex-1">
            <button 
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 pr-4 transition-all active:scale-95 group w-full md:w-auto max-w-xs"
            >
                <div className={`p-2 rounded-lg ${currentBotObj.bg} ${currentBotObj.color}`}>
                   <currentBotObj.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentBotObj.desc}</div>
                    <div className="text-sm font-bold text-slate-800 truncate flex items-center gap-1">
                        {currentBotObj.label} 
                        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            {/* DROPDOWN MENU */}
            {isSelectorOpen && (
              <>
                 <div className="fixed inset-0 z-30" onClick={() => setIsSelectorOpen(false)}></div>
                 <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-40">
                     <div className="p-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                         Selecciona tu Asistente
                     </div>
                     <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {BOT_OPTIONS.map((bot) => (
                           <button
                             key={bot.mode}
                             onClick={() => {
                                 onModeChange(bot.mode);
                                 setIsSelectorOpen(false);
                             }}
                             className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors mb-1 ${currentMode === bot.mode ? `${bot.bg} ring-1 ${bot.ring}` : 'hover:bg-slate-50'}`}
                           >
                               <div className={`p-2 rounded-lg ${currentMode === bot.mode ? 'bg-white' : 'bg-slate-100'} ${bot.color}`}>
                                   <bot.icon className="w-5 h-5" />
                               </div>
                               <div className="text-left flex-1">
                                   <div className={`font-bold text-sm ${currentMode === bot.mode ? 'text-slate-900' : 'text-slate-700'}`}>{bot.label}</div>
                                   <div className={`text-xs ${currentMode === bot.mode ? 'text-slate-600' : 'text-slate-400'}`}>{bot.desc}</div>
                               </div>
                               {currentMode === bot.mode && <CheckCircle className={`w-4 h-4 ${bot.color}`} />}
                           </button>
                        ))}
                     </div>
                 </div>
              </>
            )}
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
           <button 
              onClick={handleClearChat}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100"
              title="Borrar Memoria"
           >
               <Trash2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 md:pb-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex items-start gap-3 max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar Icons - Sticky Top */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200 shadow-sm mt-1 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-white'}`}>
                 {msg.role === 'user' ? <User className="w-4 h-4 text-slate-500" /> : <Bot className={`w-4 h-4 ${currentBotObj.color}`} />}
              </div>

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} min-w-0`}>
                  {/* Name Label */}
                  <span className="text-[10px] text-slate-400 font-bold mb-1 px-1">
                      {msg.role === 'user' ? 'Tú' : currentBotObj.label.split(' ')[0]}
                  </span>
                  
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                  >
                    {msg.role === 'user' ? msg.text : renderFormattedText(msg.text)}
                  </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-start gap-3 pl-2">
             <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-slate-400" />
             </div>
             <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 animate-pulse">Pensando...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30">
        
        {/* ATTACHMENT PREVIEW: IMAGE */}
        {attachedImage && (
          <div className="flex items-center gap-3 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit animate-in zoom-in">
             <img src={attachedImage} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
             <div className="text-xs text-slate-500 font-medium">Imagen adjunta</div>
             <button onClick={() => setAttachedImage(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ATTACHMENT PREVIEW: AUDIO */}
        {attachedAudio && (
            <div className="flex items-center gap-3 mb-3 bg-blue-50 p-3 rounded-xl border border-blue-100 w-fit animate-in zoom-in">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AudioLines className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                  <div className="text-xs font-bold text-blue-700">Nota de Voz</div>
                  <div className="text-[10px] text-blue-500">Listo para enviar</div>
               </div>
               <audio src={attachedAudio.url} controls className="h-8 w-24 md:w-40 ml-2" />
               <button onClick={cancelRecording} className="p-1 hover:bg-blue-200 rounded-full text-blue-500"><X className="w-4 h-4" /></button>
            </div>
        )}

        {/* RECORDING UI OVERLAY */}
        {isRecording ? (
           <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-[24px] p-2 pl-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                 <span className="text-red-600 font-bold font-mono">{formatDuration(recordingDuration)}</span>
                 <span className="text-xs text-red-400 font-medium ml-2">Grabando...</span>
              </div>
              <div className="flex gap-2">
                 <button onClick={cancelRecording} className="p-2.5 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
                 <button onClick={stopRecording} className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-all active:scale-95">
                    <Square className="w-4 h-4 fill-current" />
                 </button>
              </div>
           </div>
        ) : (
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 bg-slate-100 rounded-[24px] flex items-center p-1 border border-slate-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:bg-white transition-all relative">
              {/* Left Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-1 bottom-1 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors z-10"
                title="Adjuntar imagen o tarea"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  currentMode === AIMode.PSYCHOLOGIST ? "Estoy aquí para escucharte..." :
                  currentMode === AIMode.TUTOR ? "Sube una foto de tu ejercicio..." :
                  currentMode === AIMode.COACH ? "¿Cómo va esa búsqueda de práctica?" :
                  "Escribe tu consulta..."
                }
                className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-10 text-sm max-h-32 min-h-[44px]"
                rows={1}
              />

              {/* Right Button - RECORD AUDIO */}
              <button 
                  onClick={startRecording}
                  className="absolute right-1 bottom-1 p-2 rounded-full transition-all z-10 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Grabar nota de voz"
              >
                  <Mic className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !attachedImage && !attachedAudio) || loading}
              className={`p-3.5 rounded-full text-white shadow-lg transition-all flex items-center justify-center mb-0.5 ${getModeColor()} ${(!input.trim() && !attachedImage && !attachedAudio) || loading ? 'opacity-50 scale-95' : 'hover:scale-110 active:scale-90'}`}
            >
              {loading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
