
import React, { useState, useEffect } from 'react';
import { UserState, ThemeColor } from '../types';
// Added MapPin to imports
import { Flame, Activity, BookOpen, Check, Plus, Calendar as CalendarIcon, Clock, GraduationCap, Smile, Frown, Meh, Sun, CloudRain, Zap, ClipboardList, Coins, ArrowRight, AlertTriangle, CreditCard, Sparkles, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface DashboardProps {
  user: UserState;
  primaryColor: ThemeColor;
}

const initialMoodData = [
  { day: 'Lun', level: 60 },
  { day: 'Mar', level: 45 },
  { day: 'Mié', level: 30 },
  { day: 'Jue', level: 80 },
  { day: 'Vie', level: 90 },
  { day: 'Sáb', level: 100 },
  { day: 'Hoy', level: 0 },
];

const EMOTIONS = [
    { label: 'Radiante', score: 100, icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50', bar: '#eab308' },
    { label: 'Bien', score: 75, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', bar: '#10b981' },
    { label: 'Normal', score: 50, icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', bar: '#3b82f6' },
    { label: 'Agobiado', score: 25, icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50', bar: '#f97316' },
    { label: 'Colapsado', score: 10, icon: CloudRain, color: 'text-slate-500', bg: 'bg-slate-100', bar: '#64748b' },
];

const CalendarWidget = ({ primaryColor }: { primaryColor: ThemeColor }) => {
  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.toLocaleDateString('es-ES', { month: 'long' });
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];
  for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getBgClass = () => {
      switch(primaryColor) {
          case 'blue': return 'bg-blue-600';
          case 'emerald': return 'bg-emerald-600';
          case 'purple': return 'bg-purple-600';
          case 'slate': return 'bg-slate-800';
          case 'red': default: return 'bg-red-600';
      }
  };

  return (
    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 h-full flex flex-col">
       <div className="flex justify-between items-center mb-3">
         <h3 className="font-bold text-slate-800 text-sm capitalize flex items-center gap-2">
           <CalendarIcon className="w-4 h-4 text-slate-400" /> {currentMonth}
         </h3>
       </div>
       <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-slate-300 mb-2 uppercase">
         {['L','M','M','J','V','S','D'].map(d => <div key={d}>{d}</div>)}
       </div>
       <div className="grid grid-cols-7 gap-1 flex-1">
         {days.map((d, idx) => (
           <div key={idx} className={`aspect-square flex items-center justify-center text-[11px] rounded-full transition-all ${d === null ? '' : 'hover:bg-slate-50 cursor-pointer'} ${d === currentDay ? `${getBgClass()} text-white font-black shadow-lg scale-105` : 'text-slate-500 font-medium'}`}>
             {d}
           </div>
         ))}
       </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, primaryColor }) => {
  const [moodData, setMoodData] = useState(initialMoodData);
  const [moodRecorded, setMoodRecorded] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Leer paper de Historia', done: false, weight: 10, tag: 'Estudio' },
    { id: 2, text: 'Inscribir taller deportivo', done: true, weight: 5, tag: 'Vida U' },
    { id: 3, text: 'Quiz de Matemáticas', done: false, weight: 20, tag: 'Urgente' },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleMoodCheckin = (score: number) => {
    setMoodData(prev => prev.map(d => d.day === 'Hoy' ? { ...d, level: score } : d));
    setMoodRecorded(true);
  };

  const getGradientClass = () => {
    switch(primaryColor) {
        case 'blue': return 'from-blue-600 to-indigo-700';
        case 'emerald': return 'from-emerald-600 to-teal-700';
        case 'purple': return 'from-purple-600 to-pink-700';
        case 'slate': return 'from-slate-700 to-black';
        case 'red': default: return 'from-red-600 to-orange-700';
    }
  };

  const getBarColor = (score: number) => {
      if (score >= 90) return '#eab308';
      if (score >= 70) return '#10b981';
      if (score >= 40) return '#3b82f6';
      if (score >= 20) return '#f97316';
      return '#64748b';
  };

  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-full pb-28 bg-[#f8fafc]">
      
      {/* Header Dinámico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">¡Hola, {user.nickname || user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-yellow-500" /> Hoy es un gran día para aprender.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-1.5 bg-orange-100 rounded-full"><Flame className="w-4 h-4 text-orange-600 fill-orange-600" /></div>
              <div className="text-sm font-bold text-slate-800">{user.streak} días</div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-1.5 bg-yellow-100 rounded-full"><Coins className="w-4 h-4 text-yellow-600 fill-yellow-600" /></div>
              <div className="text-sm font-bold text-slate-800">{user.coins}</div>
            </div>
        </div>
      </div>

      {/* Bento Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PRIORIDAD 1: SMART CARDS (Alertas críticas) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Alerta Financiera (Traída de Gestión) */}
            <div className="bg-white border-l-4 border-red-500 rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Cuota Pendiente</h4>
                        <p className="text-[10px] text-red-600 font-bold uppercase">Vence en 2 días</p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
            </div>

            {/* Asistencia Crítica */}
            <div className="bg-white border-l-4 border-orange-500 rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Alerta Asistencia</h4>
                        <p className="text-[10px] text-orange-600 font-bold uppercase">60% en Física Mecánica</p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
            </div>

            {/* Ventana Inteligente */}
            <div className="bg-white border-l-4 border-blue-500 rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Tienes una Ventana</h4>
                        <p className="text-[10px] text-blue-600 font-bold uppercase">De 10:00 a 14:00 • 4 horas</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    BOX DISPONIBLE
                </div>
            </div>
        </div>

        {/* COLUMNA IZQUIERDA (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
           {/* Registro de Humor y Energía */}
           <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                   <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                       <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Pulso de Energía
                   </h3>
                   <p className="text-xs text-slate-400 font-medium">¿Cómo te sientes para enfrentar el día?</p>
                </div>
                
                {!moodRecorded ? (
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                        {EMOTIONS.map((emotion) => (
                             <button 
                                key={emotion.label}
                                onClick={() => handleMoodCheckin(emotion.score)} 
                                className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 group relative ${emotion.color} hover:${emotion.bg}`}
                             >
                                <emotion.icon className="w-5 h-5" />
                             </button>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Registro completado
                    </div>
                )}
              </div>

              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodData} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="level" radius={[10, 10, 10, 10]}>
                            {moodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.day === 'Hoy' && !moodRecorded ? '#e2e8f0' : getBarColor(entry.level)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Mis Notas (Compact) */}
           <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-5">
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <GraduationCap className="w-5 h-5 text-blue-600" /> Rendimiento
                   </h3>
                   <button className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Ver Historial</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.grades?.slice(0, 4).map((grade, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{grade.subject}</h4>
                                <p className="text-[9px] text-slate-400 font-black uppercase">{grade.date}</p>
                            </div>
                            <div className={`text-lg font-black ${grade.score >= 4.0 ? 'text-blue-600' : 'text-red-500'}`}>
                                {grade.score.toFixed(1)}
                            </div>
                        </div>
                    ))}
                </div>
           </div>
        </div>

        {/* COLUMNA DERECHA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
           
           {/* Próxima Clase - High Impact Card */}
           <div className={`bg-gradient-to-br ${getGradientClass()} p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group`}>
                 <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 opacity-70"><Clock className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">En 25 minutos</span></div>
                   <div className="text-4xl font-black mb-1">14:30</div>
                   <div className="text-lg font-bold text-white/90 mb-4 line-clamp-1">Inteligencia Artificial</div>
                   <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 shadow-sm">
                            <MapPin className="w-3.5 h-3.5" /> Sala 302 (Ed. B)
                        </div>
                        <Check className="w-5 h-5 text-white/50" />
                   </div>
                 </div>
           </div>

           {/* Calendario Compacto */}
           <div className="shrink-0 h-[220px]">
               <CalendarWidget primaryColor={primaryColor} />
           </div>

           {/* Lista de Tareas (Quick Check) */}
           <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col flex-1 min-h-[300px]">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-slate-400" /> Pendientes
                  </h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-full">
                    {tasks.filter(t => !t.done).length} hoy
                  </div>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <div key={task.id} className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${task.done ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-200 group-hover:border-blue-400'}`}>{task.done && <Check className="w-3 h-3 text-white" />}</div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                 <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Agrega algo..." className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                 <button onClick={() => { if(newTask.trim()){setTasks([{id: Date.now(), text: newTask, done: false, weight: 10, tag: 'General'}, ...tasks]); setNewTask('');} }} className={`bg-slate-900 text-white p-2.5 rounded-xl hover:scale-105 transition-all shadow-md`}><Plus className="w-5 h-5" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
