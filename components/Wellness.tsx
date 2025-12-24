import React, { useState, useEffect } from 'react';
import { Wind, Music, Heart, Phone, Play, Pause } from 'lucide-react';

const Wellness: React.FC = () => {
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Espera'>('Inhala');
  const [breathingActive, setBreathingActive] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (breathingActive) {
      interval = setInterval(() => {
        setTimer(t => {
          const cycle = t % 16;
          if (cycle < 4) setBreathingPhase('Inhala');
          else if (cycle < 8) setBreathingPhase('Retén');
          else if (cycle < 12) setBreathingPhase('Exhala');
          else setBreathingPhase('Espera');
          return t + 1;
        });
      }, 1000);
    } else {
      setTimer(0);
      setBreathingPhase('Inhala');
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  return (
    <div className="h-full bg-slate-50 overflow-y-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Toolkit de Emergencia</h1>

      {/* Panic Button / Breathing */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Wind className="w-12 h-12 mb-4 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Respiración Cuadrada</h2>
          <p className="text-teal-100 mb-6 max-w-sm">Técnica rápida para detener ataques de ansiedad y recuperar el control.</p>
          
          {breathingActive ? (
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold mb-4 tracking-wider animate-pulse">{breathingPhase}</div>
               <div className="w-64 h-2 bg-teal-800/50 rounded-full overflow-hidden mb-6">
                 <div 
                    className="h-full bg-white transition-all duration-1000 ease-linear"
                    style={{ width: `${((timer % 4) + 1) * 25}%` }}
                 />
               </div>
               <button 
                onClick={() => setBreathingActive(false)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-semibold transition-colors"
               >
                 Detener
               </button>
             </div>
          ) : (
            <button 
              onClick={() => setBreathingActive(true)}
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Iniciar Ejercicio
            </button>
          )}
        </div>
      </div>

      {/* Crisis Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Línea *4141</h3>
              <p className="text-sm text-red-600">Prevención del Suicidio (Minsal)</p>
            </div>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800">DAE UNAB</h3>
              <p className="text-sm text-blue-600">Apoyo estudiantil y psicopedagógico</p>
            </div>
         </div>
      </div>

      {/* Mood Playlist (Mock) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Music className="w-5 h-5 text-purple-500" /> DJ Emocional
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {['Lo-Fi Estudio', 'Energía Pre-Examen', 'Calma Profunda'].map((list, i) => (
             <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                   <Music className="w-5 h-5 text-purple-600" />
                 </div>
                 <span className="font-medium text-slate-700">{list}</span>
               </div>
               <Play className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default Wellness;