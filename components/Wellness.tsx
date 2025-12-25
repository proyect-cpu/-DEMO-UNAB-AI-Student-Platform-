
import React, { useState, useEffect } from 'react';
import { Wind, Play, Book, Save, Mic, MicOff, Volume2, Quote, Dice5, Timer, Coffee, Pause, RotateCcw, Eye, ShieldCheck, Fingerprint, Waves } from 'lucide-react';
import { ThemeColor } from '../types';

interface WellnessProps {
  primaryColor: ThemeColor;
}

interface JournalEntry {
  id: number;
  date: string;
  text: string;
}

const Wellness: React.FC<WellnessProps> = ({ primaryColor }) => {
  // Breathing State
  const [breathingPhase, setBreathingPhase] = useState<'Prepárate' | 'Inhala' | 'Sostén' | 'Exhala'>('Prepárate');
  const [breathingActive, setBreathingActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  // Pomodoro State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  // Grounding (SOS) State
  const [sosActive, setSosActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  // Journal State
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // Random Tip State
  const [activeTip, setActiveTip] = useState("Toca el dado para recibir un consejo.");

  // Helpers
  const getGradient = () => {
    switch(primaryColor) {
        case 'blue': return 'from-blue-600 to-indigo-800';
        case 'emerald': return 'from-emerald-600 to-teal-800';
        case 'purple': return 'from-purple-600 to-fuchsia-800';
        case 'slate': return 'from-slate-700 to-black';
        case 'red': default: return 'from-red-600 to-orange-800';
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; 
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Breathing Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (breathingActive) {
      if (timer === 0) speak("Relaja tus hombros. Cierra los ojos. Comenzamos.");
      
      interval = setInterval(() => {
        setTimer(t => {
          const nextTime = t + 1;
          const cycleTime = (nextTime - 4) % 12; 
          
          if (nextTime < 4) { 
            setBreathingPhase('Prepárate'); 
          } else {
            if (cycleTime === 0) { 
              speak("Inhala profundo por la nariz..."); 
              setBreathingPhase('Inhala'); 
            } else if (cycleTime === 4) { 
              speak("Mantén el aire..."); 
              setBreathingPhase('Sostén'); 
            } else if (cycleTime === 8) { 
              speak("Suelta todo el aire suavemente..."); 
              setBreathingPhase('Exhala'); 
            }
          }
          return nextTime;
        });
      }, 1000);
    } else {
      setTimer(0);
      setBreathingPhase('Prepárate');
      window.speechSynthesis.cancel();
    }
    return () => clearInterval(interval);
  }, [breathingActive, voiceEnabled]);

  // Pomodoro Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (pomoActive && pomoTime > 0) {
        interval = setInterval(() => setPomoTime(t => t - 1), 1000);
    } else if (pomoTime === 0 && pomoActive) {
        setPomoActive(false);
        if (pomoMode === 'FOCUS') {
            speak("Buen trabajo. Tómate un descanso.");
            setPomoMode('BREAK');
            setPomoTime(5 * 60);
        } else {
            speak("Descanso terminado. A enfocar de nuevo.");
            setPomoMode('FOCUS');
            setPomoTime(25 * 60);
        }
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoTime, pomoMode]);

  const togglePomo = () => setPomoActive(!pomoActive);
  const resetPomo = () => {
      setPomoActive(false);
      setPomoMode('FOCUS');
      setPomoTime(25 * 60);
  };

  const handleSaveJournal = () => {
    if (!journalText.trim()) return;
    setEntries([{ id: Date.now(), date: new Date().toLocaleDateString(), text: journalText }, ...entries]);
    setJournalText('');
  };

  const handleRandomTip = () => {
      const tips = [
          "Bebe un vaso de agua ahora mismo. Tu cerebro funciona con agua.", 
          "Estira las piernas. La circulación ayuda a la concentración.", 
          "Aplica la regla 20-20-20: Mira a 20 metros por 20 segundos cada 20 minutos.", 
          "Desconecta notificaciones por 1 hora. Deep Work.",
          "Sal a tomar aire fresco. Oxigena tu mente.",
          "Limpia tu escritorio. El orden físico trae orden mental."
      ];
      setActiveTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const groundingSteps = [
      { icon: Eye, text: "Nombra 5 cosas que puedas ver." },
      { icon: Fingerprint, text: "Nombra 4 cosas que puedas tocar." },
      { icon: Volume2, text: "Nombra 3 cosas que puedas oír." },
      { icon: Wind, text: "Nombra 2 cosas que puedas oler." },
      { icon: Coffee, text: "Nombra 1 cosa que puedas saborear." }
  ];

  return (
    <div className="h-full bg-slate-50 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-slate-800">Centro de Bienestar</h1>
         <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Powered by Sentinel</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
             {/* LEFT: Breathing Exercise */}
             <div className={`bg-gradient-to-br ${getGradient()} rounded-[32px] p-1 shadow-2xl relative overflow-hidden group h-[400px]`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="bg-white/5 backdrop-blur-md rounded-[28px] p-6 relative h-full flex flex-col items-center justify-center text-center border border-white/10">
                  <div className="absolute top-4 right-4 z-20">
                     <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-full transition-colors border ${voiceEnabled ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white border-white/30'}`}>
                       {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                     </button>
                  </div>

                  {!breathingActive ? (
                    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center h-full">
                       <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white/10">
                          <Wind className="w-8 h-8 text-white" />
                       </div>
                       <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Respiración Táctica</h2>
                       <p className="text-white/80 mb-8 max-w-xs text-sm font-medium leading-relaxed">
                         Reduce la ansiedad en 60 segundos usando el protocolo Navy SEAL (Box Breathing).
                       </p>
                       <button onClick={() => setBreathingActive(true)} className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm">
                         <Play className="w-4 h-4 fill-current" /> INICIAR SESIÓN
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                       <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                          <div className={`absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm transition-all duration-[4000ms] ease-in-out ${breathingPhase === 'Inhala' ? 'scale-110 opacity-100' : breathingPhase === 'Exhala' ? 'scale-75 opacity-60' : 'scale-90 opacity-80'}`} />
                          <div className={`absolute inset-0 border-2 border-white/30 rounded-full transition-all duration-[4000ms] ${breathingPhase === 'Sostén' ? 'scale-105 border-white' : 'scale-100'}`}></div>
                          <div className="relative z-10 flex flex-col items-center">
                            <span className="text-6xl font-black text-white drop-shadow-lg">{timer > 3 ? (timer - 4) % 4 + 1 : 3 - timer}</span>
                            <span className="text-sm font-bold text-white uppercase mt-2 tracking-widest">{breathingPhase}</span>
                          </div>
                       </div>
                       <button onClick={() => setBreathingActive(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-xs font-bold uppercase transition-all border border-white/20">Detener</button>
                     </div>
                  )}
                </div>
             </div>

             {/* RIGHT: POMODORO TIMER (Replaces Spotify) */}
             <div className="bg-[#1e1e2e] rounded-[32px] overflow-hidden shadow-2xl h-[400px] flex flex-col relative border border-slate-800">
                 <div className="p-6 bg-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <Timer className="w-5 h-5 text-indigo-400" />
                        <span className="font-bold tracking-wide text-sm">Focus Mode</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${pomoMode === 'FOCUS' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                        {pomoMode === 'FOCUS' ? 'Estudio Profundo' : 'Descanso'}
                    </div>
                 </div>

                 <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                     <div className="text-8xl font-black text-white font-mono tracking-tighter mb-8 drop-shadow-2xl">
                         {formatTime(pomoTime)}
                     </div>

                     <div className="flex gap-4">
                         <button onClick={togglePomo} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95 ${pomoActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                             {pomoActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                         </button>
                         <button onClick={resetPomo} className="w-16 h-16 rounded-2xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-all shadow-lg hover:scale-105 active:scale-95">
                             <RotateCcw className="w-8 h-8" />
                         </button>
                     </div>
                     <p className="text-slate-400 text-xs font-medium mt-8">
                         {pomoActive ? "Mantén el enfoque. Tú puedes." : "Configuración: 25m Focus / 5m Break"}
                     </p>
                 </div>
             </div>
      </div>

      {/* SOS KIT & TIPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOS ANXIETY BUTTON */}
        <div className="lg:col-span-1">
             {!sosActive ? (
                 <button onClick={() => setSosActive(true)} className="w-full h-full min-h-[160px] bg-red-50 rounded-2xl border border-red-100 p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-red-100 transition-colors group">
                     <div className="p-3 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform"><ShieldCheck className="w-8 h-8" /></div>
                     <h3 className="font-bold text-red-700 text-lg">Kit de Calma SOS</h3>
                     <p className="text-xs text-red-600/80 max-w-[200px]">Usa esto si sientes ansiedad o pánico ahora mismo.</p>
                 </button>
             ) : (
                 <div className="w-full h-full min-h-[160px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between animate-in zoom-in">
                     <div className="flex justify-between items-start">
                         <h3 className="font-bold text-slate-800 text-sm uppercase">Técnica 5-4-3-2-1</h3>
                         <button onClick={() => {setSosActive(false); setGroundingStep(0);}} className="text-slate-400 hover:text-slate-600"><RotateCcw className="w-4 h-4" /></button>
                     </div>
                     <div className="flex items-center gap-3 my-2">
                         {React.createElement(groundingSteps[groundingStep].icon, { className: "w-8 h-8 text-blue-500" })}
                         <p className="text-sm font-bold text-slate-700">{groundingSteps[groundingStep].text}</p>
                     </div>
                     <div className="flex gap-2">
                         <button 
                            disabled={groundingStep === 0}
                            onClick={() => setGroundingStep(s => Math.max(0, s - 1))}
                            className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded-lg disabled:opacity-50"
                         >Anterior</button>
                         <button 
                            onClick={() => {
                                if (groundingStep < 4) setGroundingStep(s => s + 1);
                                else setSosActive(false);
                            }}
                            className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg"
                         >
                             {groundingStep === 4 ? "Finalizar" : "Siguiente"}
                         </button>
                     </div>
                 </div>
             )}
        </div>

        {/* RANDOM TIP */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Dice5 className="w-5 h-5 text-orange-500" />
                        <h4 className="text-sm font-bold uppercase tracking-wide text-orange-600">Consejo Random</h4>
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed animate-in fade-in">
                        {activeTip}
                    </p>
                </div>
                <button 
                  onClick={handleRandomTip}
                  className="mt-3 w-full py-2 rounded-lg bg-orange-50 border border-orange-100 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors"
                >
                    Tirar Dados
                </button>
            </div>
        </div>

        {/* Journal */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[280px]">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                    <Book className="w-4 h-4 text-emerald-500" /> Gratitud
                 </h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
                 {entries.length === 0 ? (
                   <p className="text-center text-slate-300 text-xs mt-10 italic">Escribe algo bueno de hoy...</p>
                 ) : (
                   entries.map(entry => (
                     <div key={entry.id} className="bg-emerald-50/50 p-2 rounded border border-emerald-100 text-xs text-slate-700">
                        {entry.text}
                     </div>
                   ))
                 )}
              </div>
              <div className="p-3 bg-slate-50 rounded-b-2xl flex gap-2">
                    <input 
                        type="text" 
                        value={journalText} 
                        onChange={(e) => setJournalText(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveJournal()} 
                        placeholder="Hoy agradezco..." 
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
                    />
                    <button onClick={handleSaveJournal} className="bg-emerald-600 text-white p-2 rounded-lg">
                        <Save className="w-4 h-4" />
                    </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
