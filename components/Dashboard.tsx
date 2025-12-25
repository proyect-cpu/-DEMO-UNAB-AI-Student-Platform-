
import React, { useState, useEffect } from 'react';
import { UserState, ThemeColor } from '../types';
import { Flame, Activity, BookOpen, Check, Plus, Calendar as CalendarIcon, Clock, GraduationCap, Smile, Frown, Meh, Sun, CloudRain, BatteryCharging, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface DashboardProps {
  user: UserState;
  primaryColor: ThemeColor;
}

// Data now represents "Energy/Mood Level" (Higher is Better)
const initialMoodData = [
  { day: 'Lun', level: 60 },
  { day: 'Mar', level: 45 },
  { day: 'Mié', level: 30 },
  { day: 'Jue', level: 80 },
  { day: 'Vie', level: 90 },
  { day: 'Sáb', level: 100 },
  { day: 'Hoy', level: 0 }, // Will be filled by user
];

const EMOTIONS = [
    { label: 'Radiante', score: 100, icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50', bar: '#eab308' }, // 100 pts
    { label: 'Bien', score: 75, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', bar: '#10b981' }, // 75 pts
    { label: 'Normal', score: 50, icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', bar: '#3b82f6' }, // 50 pts
    { label: 'Agobiado', score: 25, icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50', bar: '#f97316' }, // 25 pts
    { label: 'Colapsado', score: 10, icon: CloudRain, color: 'text-slate-500', bg: 'bg-slate-100', bar: '#64748b' }, // 10 pts
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
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
           <CalendarIcon className="w-5 h-5 text-slate-400" /> {currentMonth}
         </h3>
         <span className="text-xs font-bold text-slate-400">{date.getFullYear()}</span>
       </div>
       <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
         {['L','M','M','J','V','S','D'].map(d => <div key={d}>{d}</div>)}
       </div>
       <div className="grid grid-cols-7 gap-1 flex-1">
         {days.map((d, idx) => (
           <div key={idx} className={`aspect-square flex items-center justify-center text-xs rounded-full transition-all ${d === null ? '' : 'hover:bg-slate-100 cursor-pointer'} ${d === currentDay ? `${getBgClass()} text-white font-bold shadow-md scale-110` : 'text-slate-600'}`}>
             {d}
           </div>
         ))}
       </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, primaryColor }) => {
  const [moodData, setMoodData] = useState(initialMoodData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moodRecorded, setMoodRecorded] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Leer paper de Historia', done: false, weight: 10, tag: 'Estudio' },
    { id: 2, text: 'Inscribir taller deportivo', done: true, weight: 5, tag: 'Vida U' },
    { id: 3, text: 'Quiz de Matemáticas', done: false, weight: 20, tag: 'Urgente' },
  ]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const weight = Math.floor(Math.random() * 20) + 10;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false, weight, tag: 'General' }]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  const handleMoodCheckin = (score: number) => {
    setMoodData(prev => prev.map(d => 
      d.day === 'Hoy' ? { ...d, level: score } : d
    ));
    setMoodRecorded(true);
  };

  const getButtonClass = () => {
    switch(primaryColor) {
        case 'blue': return 'bg-blue-900 hover:bg-blue-800';
        case 'emerald': return 'bg-emerald-900 hover:bg-emerald-800';
        case 'purple': return 'bg-purple-900 hover:bg-purple-800';
        case 'slate': return 'bg-slate-900 hover:bg-slate-800';
        case 'red': default: return 'bg-red-900 hover:bg-red-800';
    }
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

  // Helper to get color based on score
  const getBarColor = (score: number) => {
      if (score >= 90) return '#eab308'; // Yellow/Gold
      if (score >= 70) return '#10b981'; // Green
      if (score >= 40) return '#3b82f6'; // Blue
      if (score >= 20) return '#f97316'; // Orange
      return '#64748b'; // Slate/Grey
  };

  const nextClassTime = new Date();
  nextClassTime.setHours(14, 30, 0);
  const diffMinutes = Math.round((nextClassTime.getTime() - currentTime.getTime()) / 60000);

  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-full pb-24 bg-slate-50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Hola, {user.nickname || user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 font-medium">Aquí está tu resumen de hoy.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <div className="p-1.5 bg-orange-100 rounded-full"><Flame className="w-4 h-4 text-orange-600 fill-orange-600" /></div>
          <div className="text-sm"><span className="font-bold text-slate-800">{user.streak} días</span> <span className="text-slate-400">en racha</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: Progreso y Métricas (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
           
           {/* INTERACTIVE EMOTIONAL BALANCE */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Balance de Energía
                   </h3>
                   <p className="text-xs text-slate-400 mt-1">Más feliz = Mayor puntaje</p>
                </div>
                
                {!moodRecorded ? (
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        {EMOTIONS.map((emotion) => (
                             <button 
                                key={emotion.label}
                                onClick={() => handleMoodCheckin(emotion.score)} 
                                className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 group relative ${emotion.color} hover:${emotion.bg}`}
                                title={`${emotion.label}`}
                             >
                                <emotion.icon className="w-6 h-6" />
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-1.5 py-0.5 rounded pointer-events-none">
                                    {emotion.label}
                                </span>
                             </button>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2 animate-in zoom-in shadow-sm">
                        <Check className="w-4 h-4" /> ¡Registrado!
                    </div>
                )}
              </div>

              {/* Chart Container */}
              <div className="w-full h-64 min-w-0">
                {moodData && moodData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}} 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                            formatter={(value: number) => [`${value} pts`, 'Energía']}
                        />
                        <Bar dataKey="level" radius={[12, 12, 12, 12]}>
                            {moodData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.day === 'Hoy' && !moodRecorded ? '#e2e8f0' : getBarColor(entry.level)} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                )}
              </div>
           </div>
           
           {/* GRADES */}
           {user.grades && user.grades.length > 0 && (
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <GraduationCap className="w-5 h-5 text-slate-500" /> Mis Notas
                   </h3>
                   <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full font-bold">Semestre Actual</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.grades.map((grade, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">{grade.subject}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Pond: {grade.weight}% • {grade.date}</p>
                            </div>
                            <div className={`text-xl font-black ${grade.score >= 4.0 ? 'text-blue-600' : 'text-red-500'}`}>
                                {grade.score.toFixed(1)}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
           )}
        </div>

        {/* COLUMNA DERECHA: Productividad Diaria (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col min-w-0">
           
           {/* PRÓXIMA CLASE - Highlighted */}
           <div className={`bg-gradient-to-br ${getGradientClass()} p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group shrink-0`}>
                 <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 opacity-80"><Clock className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Próxima Clase</span></div>
                   <div className="text-4xl font-black mb-1">14:30</div>
                   <div className="text-lg font-bold text-purple-100 mb-4 line-clamp-1">Inteligencia Artificial</div>
                   <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium"><BookOpen className="w-4 h-4" /> Sala 302</div>
                   <div className="absolute bottom-6 right-6 text-right"><div className="text-3xl font-bold">{diffMinutes > 0 ? diffMinutes : '0'}</div><div className="text-[10px] uppercase font-bold opacity-60">Minutos</div></div>
                 </div>
           </div>

           {/* CALENDAR - Compact */}
           <div className="h-auto shrink-0">
               <CalendarWidget primaryColor={primaryColor} />
           </div>

           {/* CHECKLIST - Takes remaining space */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1 min-h-[300px]">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Checklist</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{tasks.filter(t => !t.done).length} pendientes</span>
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <div key={task.id} onClick={() => toggleTask(task.id)} className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${task.done ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-300 group-hover:border-blue-400'}`}>{task.done && <Check className="w-3.5 h-3.5 text-white" />}</div>
                    <div className="flex-1 min-w-0"><p className={`text-sm font-medium truncate ${task.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.text}</p><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${task.tag === 'Urgente' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{task.tag}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                 <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} placeholder="Nueva tarea..." className="flex-1 bg-slate-50 border-0 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors outline-none" />
                 <button onClick={handleAddTask} className={`text-white p-2 rounded-xl transition-colors ${getButtonClass()}`}><Plus className="w-5 h-5" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
