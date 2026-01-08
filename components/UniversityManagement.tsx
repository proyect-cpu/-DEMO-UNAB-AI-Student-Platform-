
import React, { useState, useMemo } from 'react';
import { UserState, ThemeColor, UserRole } from '../types';
import { 
  CreditCard, Calendar, Download, FileText, CheckCircle, 
  AlertCircle, ChevronRight, Clock, Award, 
  FileCheck, Wallet, ArrowRight, AlertTriangle, Check,
  Briefcase, MapPin, Users, Loader2, X, Sparkles, Flame, User, Search, Eye, Filter, DownloadCloud, Landmark, Coffee, Banknote, FileSpreadsheet, History, Percent, Shield, Info, MoreVertical,
  BookOpen, Activity, Plus
} from 'lucide-react';

interface UniversityManagementProps {
  user: UserState;
  primaryColor: ThemeColor;
}

interface Course {
  id: string;
  name: string;
  teacher: string;
  room: string;
  days: number[]; // 0=Mon, 1=Tue...
  startTime: number; // Hour in 24h format
  duration: number; // Hours
  color: string;
  attendance: number;
}

const INITIAL_COURSES: Course[] = [
  { id: 'CALC1', name: 'Cálculo I', teacher: 'Dr. Roberto Parra', room: 'Sala 302 (B)', days: [0, 2], startTime: 8, duration: 2, color: 'bg-blue-600', attendance: 85 },
  { id: 'FIS1', name: 'Física Mecánica', teacher: 'Dra. Ana Soto', room: 'Lab 4 (C)', days: [1, 3], startTime: 10, duration: 3, color: 'bg-red-600', attendance: 60 },
  { id: 'PROG1', name: 'Programación', teacher: 'Ing. Carlos Ruiz', room: 'Lab 1 (A)', days: [2, 4], startTime: 14, duration: 2, color: 'bg-emerald-600', attendance: 100 },
  { id: 'ALG1', name: 'Álgebra', teacher: 'Prof. Julia Meza', room: 'Sala 101 (B)', days: [0, 4], startTime: 11, duration: 2, color: 'bg-purple-600', attendance: 92 },
];

const Toast = ({ message, onClose, color = 'blue' }: { message: string, onClose: () => void, color?: string }) => (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 bg-white border-${color}-100 w-[90%] md:w-auto`}>
        <div className={`p-1.5 rounded-full bg-${color}-100 text-${color}-600`}><CheckCircle className="w-4 h-4" /></div>
        <span className="font-bold text-slate-700 text-sm">{message}</span>
        <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
    </div>
);

const UniversityManagement: React.FC<UniversityManagementProps> = ({ user, primaryColor }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(INITIAL_COURSES.map(c => c.id));
  const [activeCourseDetail, setActiveCourseDetail] = useState<Course | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const isTeacher = user.role === UserRole.TEACHER;
  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'];

  const showToast = (msg: string) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 3000);
  };

  const currentCourses = useMemo(() => 
    INITIAL_COURSES.filter(c => selectedCourses.includes(c.id)),
    [selectedCourses]
  );

  const handleOptimize = () => {
      setIsOptimizing(true);
      setTimeout(() => {
          setIsOptimizing(false);
          showToast("¡Horario optimizado! Ventanas críticas minimizadas.");
      }, 2000);
  };

  const getGradientClass = () => {
    switch(primaryColor) {
        case 'blue': return 'from-blue-600 to-indigo-600';
        case 'emerald': return 'from-emerald-600 to-teal-600';
        case 'purple': return 'from-purple-600 to-fuchsia-600';
        case 'slate': return 'from-slate-700 to-black';
        case 'red': default: return 'from-red-600 to-orange-600';
    }
  };

  if (isTeacher) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto pb-32">
        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} color="emerald" />}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión Académica & RRHH</h1>
            <p className="text-slate-500 font-medium">Portal administrativo para docentes UNAB.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-sm">
             <Landmark className="w-4 h-4" /> Intranet Docente
          </div>
        </div>

        <div className="rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden text-white bg-slate-900">
          <div className="absolute right-0 top-0 p-10 opacity-5 -mr-10 -mt-10">
             <Banknote className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <Wallet className="w-6 h-6 text-white" />
                   </div>
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Remuneración Mensual</span>
                </div>
                <div>
                    <h2 className="text-4xl md:text-5xl font-black mb-1 tracking-tighter">Depósito Procesado</h2>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5" /> Periodo Marzo 2024
                    </div>
                </div>
             </div>
             <button onClick={() => showToast("Descargando liquidación...")} className="w-full md:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                DESCARGAR LIQUIDACIÓN <Download className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h3 className="font-black text-slate-900 text-xl flex items-center gap-2">
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600" /> Planificación de Cátedras
                   </h3>
                </div>
             </div>
             <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><AlertTriangle className="w-5 h-5 text-orange-600" /></div>
                    <div className="text-xs font-black text-orange-900">Actas Pendientes: 12 notas de Física II</div>
                </div>
                <button className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">GESTIONAR</button>
             </div>
             <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100 min-h-[350px] relative">
                <div className="absolute inset-0 grid grid-cols-5 divide-x divide-slate-200/50 pointer-events-none">
                   {DAYS.map(day => <div key={day} className="pt-2 text-center text-[9px] font-black text-slate-300">{day}</div>)}
                </div>
                <div className="relative mt-8 grid grid-cols-5 gap-2 h-full">
                    <div className="col-start-1 h-24 bg-blue-600 rounded-2xl p-3 shadow-lg flex flex-col justify-between text-white">
                        <div className="font-black text-[10px]">CÁLCULO I</div>
                        <div className="text-[9px] font-bold opacity-60">Sección 302</div>
                    </div>
                </div>
             </div>
          </div>
          <div className="lg:col-span-1 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
             <h3 className="font-black text-slate-900 text-lg">Billetera RRHH</h3>
             <div className="space-y-3">
                {['Contrato Indefinido', 'Cert. Carga Académica', 'Seguro Salud'].map(doc => (
                  <button key={doc} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border hover:bg-white transition-all group">
                    <span className="text-sm font-black text-slate-800">{doc}</span>
                    <Download className="w-4 h-4 text-slate-300 group-hover:text-slate-900" />
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto pb-32">
       {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Secretaría Virtual</h1>
            <p className="text-slate-500 font-medium">Control académico y financiero centralizado.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 text-xs font-bold uppercase tracking-widest shadow-sm">
             <Landmark className="w-4 h-4" /> Campus Conectado
          </div>
       </div>

       <div className={`rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden text-white bg-gradient-to-br from-emerald-600 to-teal-800`}>
          <div className="absolute right-0 top-0 p-10 opacity-5">
             <Wallet className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Saldo Matrícula</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">$185.000</h2>
             </div>
             <button onClick={() => showToast("Redirigiendo a pasarela de pago...")} className="w-full md:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-all">PAGAR CUOTA</button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col gap-8">
             <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-2xl flex items-center gap-2">
                   <Calendar className="w-7 h-7 text-blue-600" /> Planificación Semanal
                </h3>
             </div>

             <div className="bg-slate-50/50 rounded-[32px] p-4 md:p-8 border border-slate-100 relative min-h-[750px] flex gap-4 overflow-hidden">
                <div className="flex flex-col pt-12 text-center text-[10px] font-black text-slate-300 w-10 gap-[48px]">
                   {HOURS.map(h => <span key={h} className="h-4">{h}:00</span>)}
                </div>

                <div className="flex-1 grid grid-cols-5 gap-3 h-full relative">
                    <div className="absolute inset-0 grid grid-rows-[repeat(13,60px)] pointer-events-none opacity-20">
                        {HOURS.map(h => <div key={h} className="border-b border-slate-400 w-full h-[60px]"></div>)}
                    </div>
                    
                    <div className="col-span-5 grid grid-cols-5 mb-4 sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-2">
                        {DAYS.map(d => <div key={d} className="text-center text-[11px] font-black text-slate-400">{d}</div>)}
                    </div>

                    {currentCourses.map(course => (
                        course.days.map(dayIdx => {
                            const startOffset = (course.startTime - 8) * 60;
                            const durationHeight = course.duration * 60;
                            return (
                                <div 
                                    key={`${course.id}-${dayIdx}`}
                                    onClick={() => setActiveCourseDetail(course)}
                                    className={`absolute rounded-2xl p-3 shadow-lg flex flex-col justify-between group cursor-pointer hover:scale-[1.03] transition-all border border-white/20 text-white ${course.color}`}
                                    style={{ 
                                        left: `${(dayIdx * 20)}%`, 
                                        width: '18%', 
                                        top: `${startOffset + 48}px`, 
                                        height: `${durationHeight - 4}px`,
                                        zIndex: 10
                                    }}
                                >
                                    <div className="font-black text-[10px]">{course.name}</div>
                                    <div className="text-[8px] font-black uppercase opacity-60">{course.startTime}:00</div>
                                </div>
                            );
                        })
                    ))}
                </div>
             </div>
             <button onClick={handleOptimize} className={`w-full py-5 rounded-[28px] font-black text-white shadow-xl transition-all bg-gradient-to-r ${getGradientClass()} flex items-center justify-center gap-3`}>
                <Sparkles className="w-5 h-5 text-yellow-300" /> OPTIMIZAR HORARIO IA
             </button>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-600" /> Mis Ramos</h3>
                <div className="space-y-3">
                    {INITIAL_COURSES.map(course => (
                        <div key={course.id} onClick={() => setSelectedCourses(prev => prev.includes(course.id) ? prev.filter(id => id !== course.id) : [...prev, course.id])} className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${selectedCourses.includes(course.id) ? 'bg-slate-50 border-blue-200' : 'opacity-40 grayscale'}`}>
                            <div className="text-sm font-black text-slate-800">{course.name}</div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCourses.includes(course.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>{selectedCourses.includes(course.id) && <Check className="w-4 h-4" />}</div>
                        </div>
                    ))}
                </div>
             </div>
             <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2"><FileCheck className="w-5 h-5 text-slate-500" /> Certificados</h3>
                <div className="space-y-3">
                   {['Alumno Regular', 'Concentración Notas'].map(doc => (
                       <button key={doc} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border hover:bg-white transition-all group">
                          <span className="text-sm font-black text-slate-800">{doc}</span>
                          <Download className="w-4 h-4 text-slate-300 group-hover:text-slate-900" />
                       </button>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default UniversityManagement;
