
import React, { useState, useRef, useEffect } from 'react';
import { AIMode, Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Brain, HeartHandshake, Briefcase, FileText, Bot, Paperclip, Mic, X, Trash2, User, CheckCircle, Sparkles, Square, AudioLines } from 'lucide-react';

interface AIChatProps {
  histories: Record<AIMode, Message[]>;
  onUpdateHistory: (mode: AIMode, messages: Message[]) => void;
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const BOT_OPTIONS = [
  { mode: AIMode.TUTOR, label: 'Sócrates', desc: 'Tutor', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { mode: AIMode.PSYCHOLOGIST, label: 'Sam', desc: 'Apoyo', icon: HeartHandshake, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { mode: AIMode.COACH, label: 'Shark', desc: 'Coach', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { mode: AIMode.BUROCRACY, label: 'Admin', desc: 'Trámites', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
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
    if(window.confirm("¿Borrar historial de conversación?")) {
        const resetMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: 'Memoria de esta sesión borrada. ¿En qué te puedo ayudar ahora?',
        timestamp: new Date()
        };
        onUpdateHistory(currentMode, [resetMsg]);
    }
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
      const historyContext = updatedMessages; 
      let mediaPayload = undefined;
      
      if (currentImage) {
          mediaPayload = { mimeType: 'image/jpeg', data: currentImage };
      } else if (currentAudio) {
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

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
         return (
             <li key={i} className="ml-4 list-disc pl-1 mb-1">
                 {line.replace(/^[-*]\s+/, '').split('**').map((part, idx) => 
                     idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                 )}
             </li>
         );
      }
      if (/^\d+\./.test(line.trim())) {
         return (
             <div key={i} className="mb-1 ml-2 font-medium">
                 {line.split('**').map((part, idx) => 
                     idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                 )}
             </div>
         );
      }
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
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* MOBILE-OPTIMIZED BOT SELECTOR (Horizontal Scroll) */}
      <div className="bg-white border-b border-slate-200 shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar">
            {BOT_OPTIONS.map((bot) => {
                const isActive = currentMode === bot.mode;
                return (
                    <button
                        key={bot.mode}
                        onClick={() => onModeChange(bot.mode)}
                        className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all border ${
                            isActive 
                            ? `${bot.bg} ${bot.border} scale-105 shadow-sm` 
                            : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`p-1.5 rounded-lg mb-1 ${isActive ? 'bg-white shadow-sm' : ''} ${bot.color}`}>
                            <bot.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                            {bot.label}
                        </span>
                    </button>
                )
            })}
             <div className="h-8 w-px bg-slate-200 mx-1"></div>
             <button 
              onClick={handleClearChat}
              className="flex flex-col items-center justify-center min-w-[50px] p-2 text-slate-400 hover:text-red-500 rounded-xl"
              title="Borrar Memoria"
           >
               <Trash2 className="w-5 h-5 mb-1" />
               <span className="text-[10px] font-bold">Borrar</span>
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 md:pb-4">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 opacity-60 mt-10">
                <currentBotObj.icon className="w-16 h-16 mb-4 stroke-1" />
                <p>Inicia una conversación con {currentBotObj.label}</p>
            </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex items-start gap-2 max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200 shadow-sm mt-1 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-white'}`}>
                 {msg.role === 'user' ? <User className="w-4 h-4 text-slate-500" /> : <Bot className={`w-4 h-4 ${currentBotObj.color}`} />}
              </div>

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} min-w-0`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
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
      <div className="bg-white border-t border-slate-200 p-2 md:p-4 sticky bottom-0 z-30 safe-bottom">
        
        {/* ATTACHMENT PREVIEWS */}
        {(attachedImage || attachedAudio) && (
            <div className="flex gap-2 mb-2 overflow-x-auto px-2">
                {attachedImage && (
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0">
                        <img src={attachedImage} alt="Preview" className="h-10 w-10 object-cover rounded-md" />
                        <button onClick={() => setAttachedImage(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
                    </div>
                )}
                {attachedAudio && (
                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100 shrink-0">
                        <AudioLines className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700">Audio</span>
                        <button onClick={cancelRecording} className="text-blue-400"><X className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
        )}

        {/* RECORDING UI */}
        {isRecording ? (
           <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-[24px] p-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                 <span className="text-red-600 font-bold font-mono">{formatDuration(recordingDuration)}</span>
              </div>
              <div className="flex gap-4">
                 <button onClick={cancelRecording} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6" /></button>
                 <button onClick={stopRecording} className="bg-red-600 text-white p-2 rounded-full shadow-md"><Square className="w-4 h-4 fill-current" /></button>
              </div>
           </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-100 rounded-[24px] flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:bg-white transition-all relative">
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-slate-600"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí..."
                className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-1 text-sm max-h-32 min-h-[44px] leading-relaxed"
                rows={1}
                style={{ fontSize: '16px' }} // Prevent iOS zoom
              />

              <button 
                  onClick={startRecording}
                  className="p-3 text-slate-400 hover:text-red-600"
              >
                  <Mic className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !attachedImage && !attachedAudio) || loading}
              className={`p-3 rounded-full text-white shadow-md transition-all flex items-center justify-center shrink-0 mb-0.5 ${getModeColor()} ${(!input.trim() && !attachedImage && !attachedAudio) || loading ? 'opacity-50' : 'active:scale-95'}`}
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
