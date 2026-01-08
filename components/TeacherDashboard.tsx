
import React, { useState, useRef } from 'react';
import { 
  Users, AlertTriangle, TrendingUp, 
  FileText, BarChart2, Activity,
  Brain, Send, Shield, MessageCircle, CheckCircle, FileQuestion, Settings, ChevronDown, Download, AlertCircle, Copy, Check, Plus, Filter, Zap, Eye, Lock, Globe, Siren, Upload, Trash2, Sparkles, FileUp, Loader2, Mail, Smartphone, Bell, Calendar, Megaphone, Search, User, Target, UserPlus, Clock, Printer, File, ShieldAlert, Cpu, Database, EyeOff, Radio,
  ShieldCheck, RefreshCw, BookOpen
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid, Legend, Cell 
} from 'recharts';
import { generateExamWithGemini } from '../services/geminiService';

const academicMoodData = [
  { week: 'S1', motivation: 90, stress: 20 },
  { week: 'S2', motivation: 85, stress: 30 },
  { week: 'S3', motivation: 70, stress: 50 },
  { week: 'S4', motivation: 60, stress: 65 },
  { week: 'S5', motivation: 75, stress: 40 },
  { week: 'S6', motivation: 80, stress: 30 },
];

const topicConfusionData = [
  { topic: 'Derivadas', questions: 120, fill: '#3b82f6' },
  { topic: 'Integrales', questions: 85, fill: '#10b981' },
  { topic: 'Límites', questions: 45, fill: '#f59e0b' },
  { topic: 'Álgebra', questions: 30, fill: '#ef4444' },
];

const sentinelLogs = [
  { id: 1, type: 'CRISIS', level: 'CRÍTICO', title: 'Riesgo Bienestar Estudiantil', desc: 'Patrón de lenguaje depresivo detectado en Chat Psicólogo. El alumno manifiesta agobio extremo por carga académica.', source: 'Módulo Sam (IA)', time: '10:30 AM', status: 'ACCION REQUERIDA', color: 'text-red-600', bg: 'bg-red-50', ip: '172.16.2.45' },
  { id: 2, type: 'INTEGRITY', level: 'ADVERTENCIA', title: 'Detección de Script Externo', desc: 'Estudiante intentó inyectar prompt de resolución automática durante el examen bloqueado de Cálculo I.', source: 'Sentinel Firewall', time: '09:15 AM', status: 'BLOQUEADO', color: 'text-orange-600', bg: 'bg-orange-50', ip: '201.12.33.10' },
  { id: 3, type: 'SYSTEM', level: 'INFO', title: 'Conexión desde IP Inusual', desc: 'Acceso registrado desde Estocolmo, Suecia. El alumno reside habitualmente en Santiago de Chile.', source: 'Auth Monitor', time: '08:45 AM', status: 'VERIFICADO', color: 'text-slate-600', bg: 'bg-slate-50', ip: '5.10.22.1' },
  { id: 4, type: 'ACADEMIC', level: 'BAJO', title: 'Deserción Probable', desc: 'Alumno U-2024-8192 no ha iniciado sesión en 12 días. Inasistencia acumulada: 45%.', source: 'LMS Tracker', time: '07:30 AM', status: 'SEGUIMIENTO', color: 'text-blue-600', bg: 'bg-blue-50', ip: 'N/A' },
];

type Tab = 'ANALYTICS' | 'EXAM_GEN' | 'BROADCAST' | 'SENTINEL';

const cleanTechnicalGarbage = (text: string) => {
  return text
    .replace(/\\text\s*\{/g, '')
    .replace(/\\mathrm\s*\{/g, '')
    .replace(/\\unit\s*\{/g, '')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/\$/g, '')
    .replace(/\\/g, '')
    .replace(/\*\*/g, '') 
    .replace(/###/g, '') 
    .replace(/`/g, '');
};

const SimpleMarkdownRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-6 font-serif text-slate-900 leading-[1.8] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-slate-200 p-12 md:p-24 max-w-[850px] mx-auto min-h-[1100px] relative">
      {/* Marca de Agua UNAB */}
      <div className="absolute top-12 left-12 opacity-[0.05] pointer-events-none select-none">
          <div className="w-28 h-28 bg-slate-950 rounded-2xl flex items-center justify-center text-white text-xs font-black rotate-6 shadow-xl">
             UNAB
          </div>
      </div>

      {lines.map((line, idx) => {
        const cleanLine = cleanTechnicalGarbage(line).trim();
        if (!cleanLine && !line.includes(':')) return <div key={idx} className="h-4"></div>;

        // Títulos de nivel superior
        if (line.startsWith('# ')) {
          return (
            <div key={idx} className="mb-14 text-center border-b-[3px] border-slate-950 pb-8">
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 leading-tight">{cleanLine}</h1>
              <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Facultad de Ingeniería | Universidad Andrés Bello</div>
            </div>
          );
        }

        // Subtítulos / Ítems
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl font-bold text-slate-900 mt-16 mb-8 border-b-2 border-slate-100 pb-2 italic tracking-tighter uppercase">
              {cleanLine}
            </h2>
          );
        }

        // Bloque de Identificación (Regex robusto para detectar etiquetas)
        if (/(NOMBRE|RUT|FECHA|SECCIÓN|ALUMNO):/i.test(cleanLine)) {
           return (
             <div key={idx} className="bg-slate-50 border-y border-slate-100 py-6 px-4 my-10 flex flex-wrap gap-y-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {cleanLine.split(/\.{2,}/).map((part, i) => (
                  <span key={i} className="flex-1 min-w-[200px]">
                    {part.trim()} <span className="text-slate-200 font-normal">...................................................</span>
                  </span>
                ))}
             </div>
           );
        }

        // Opciones A), B), C)...
        const optionMatch = cleanLine.match(/^([A-D])\)\s*(.*)/);
        if (optionMatch) {
          return (
            <div key={idx} className="ml-24 flex gap-4 py-1.5 transition-colors hover:bg-slate-50 rounded-lg group">
              <span className="font-bold text-slate-950 w-8">{optionMatch[1]})</span>
              <span className="text-slate-700 font-medium tracking-tight">{optionMatch[2]}</span>
            </div>
          );
        }

        // Preguntas con numeración
        const questionMatch = cleanLine.match(/^(\d+)\.\s*(.*)/);
        if (questionMatch) {
          return (
            <div key={idx} className="mt-14 flex items-start gap-6 font-bold text-slate-950 text-base md:text-lg group">
              <span className="bg-slate-950 text-white w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-lg group-hover:scale-110 transition-transform">{questionMatch[1]}</span>
              <p className="pt-1 leading-snug">{questionMatch[2]}</p>
            </div>
          );
        }

        // Párrafos Estándar / Instrucciones
        return (
          <p key={idx} className="text-slate-800 text-justify mb-4 text-[15px] indent-10 leading-relaxed font-medium">
            {cleanLine}
          </p>
        );
      })}

      {/* Pie de Página Editorial */}
      <div className="mt-48 pt-8 border-t-2 border-slate-950 flex justify-between items-center opacity-40 grayscale">
        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-950">UNAB • IA ARCHITECT v3.1</div>
        <div className="text-[9px] font-bold text-slate-500 italic">Documento confidencial para uso docente y estudiantil.</div>
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ANALYTICS');
  const [examConfig, setExamConfig] = useState({ topic: '', difficulty: 'University', qCount: 5 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<{name: string, content: string}[]>([]);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'COURSE' | 'STUDENT'>('ALL');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsReadingFile(true);
      const reader = new FileReader();
      reader.onload = (event) => {
          const content = event.target?.result as string;
          setUploadedFiles(prev => [...prev, { name: file.name, content: content.slice(0, 25000) }]); 
          setIsReadingFile(false);
      };
      reader.readAsText(file);
  };

  const handleGenerateExam = async () => {
    if(!examConfig.topic && uploadedFiles.length === 0) return;
    setIsGenerating(true);
    setGeneratedExam(null);
    const docContext = uploadedFiles.map(f => `ARCHIVO: ${f.name}\nCONTENIDO: ${f.content}`).join('\n\n');
    try {
      const examText = await generateExamWithGemini(
          examConfig.topic || "Basado en material adjunto", 
          examConfig.difficulty, 
          examConfig.qCount,
          docContext
      );
      setGeneratedExam(examText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendBroadcast = () => {
      if(!broadcastMsg || !broadcastTitle) return;
      setIsSending(true);
      setTimeout(() => {
          setIsSending(false);
          setBroadcastMsg('');
          setBroadcastTitle('');
          alert(`Comunicado oficial emitido con éxito.`);
      }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfdfe]">
      {/* Header Centro de Mando */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="px-8 py-5 flex justify-between items-center max-w-[1600px] mx-auto">
            <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3 tracking-tighter">
                <div className="p-2 bg-red-700 text-white rounded-xl shadow-lg rotate-3"><Shield className="w-6 h-6" /></div>
                SENTINEL DOCENTE <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg ml-2 font-black border border-slate-200 uppercase">Core 3.0</span>
            </h2>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado del Sistema</span>
                    <span className="text-emerald-500 font-black text-xs flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> OPERATIVO</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white font-black shadow-inner">DA</div>
            </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-8 pb-4 max-w-[1600px] mx-auto">
          {[
            { id: 'ANALYTICS', label: 'Analítica Avanzada', icon: BarChart2 },
            { id: 'EXAM_GEN', label: 'IA Architect', icon: Brain },
            { id: 'BROADCAST', label: 'Comunicación', icon: Megaphone },
            { id: 'SENTINEL', label: 'Integridad', icon: Radio },
          ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border shrink-0 ${activeTab === tab.id ? `bg-slate-950 text-white border-slate-950 shadow-2xl scale-105` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
            >
                <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-40 max-w-[1600px] mx-auto w-full">
        
        {/* TAB: ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
            <div className="space-y-10 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl group-hover:scale-110 transition-transform"><Users className="w-8 h-8" /></div>
                        <div>
                            <div className="text-3xl font-black text-slate-950">1,240</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estudiantes</div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><CheckCircle className="w-8 h-8" /></div>
                        <div>
                            <div className="text-3xl font-black text-slate-950">82.4%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aprobación</div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className="p-5 bg-orange-50 text-orange-600 rounded-3xl group-hover:scale-110 transition-transform"><TrendingUp className="w-8 h-8" /></div>
                        <div>
                            <div className="text-3xl font-black text-slate-950">+12%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engagement</div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className="p-5 bg-red-50 text-red-600 rounded-3xl group-hover:scale-110 transition-transform"><AlertTriangle className="w-8 h-8" /></div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">14</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Riesgo Crítico</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-96">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" /> Bienestar vs Motivación (Campus)
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={academicMoodData}>
                                <Area type="monotone" dataKey="motivation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={4} />
                                <Area type="monotone" dataKey="stress" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={4} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="week" tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-96">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-600" /> Consultas por Tópico Crítico
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={topicConfusionData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="topic" type="category" tick={{fill: '#64748b', fontWeight: 800, fontSize: 11}} width={100} axisLine={false} tickLine={false} />
                                <Bar dataKey="questions" radius={[0, 12, 12, 0]}>
                                    {topicConfusionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: IA ARCHITECT */}
        {activeTab === 'EXAM_GEN' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8">
             <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-2xl space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10 group-hover:rotate-12 transition-transform duration-700">
                        <Cpu className="w-48 h-48" />
                    </div>
                    
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Entrenamiento por Contexto</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-4 border-dashed border-slate-100 rounded-[40px] p-10 text-center hover:border-slate-950 hover:bg-slate-50 transition-all cursor-pointer group/upload bg-slate-50/50"
                        >
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".txt,.pdf,.docx" />
                            <FileUp className="w-12 h-12 text-slate-300 group-hover/upload:text-slate-950 mx-auto mb-4 transition-transform group-hover/upload:-translate-y-2" />
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Vincular Base de Datos</p>
                        </div>
                        <div className="space-y-2">
                            {uploadedFiles.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-950 text-white p-5 rounded-3xl animate-in zoom-in">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl"><File className="w-4 h-4" /></div>
                                        <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                                    </div>
                                    <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Título de la Evaluación</label>
                            <input 
                                type="text" 
                                value={examConfig.topic} 
                                onChange={(e) => setExamConfig({...examConfig, topic: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-sm font-bold focus:bg-white focus:border-slate-950 outline-none transition-all"
                                placeholder="Ej: Álgebra Lineal - Solemne 2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Rigor Arquitectónico</label>
                            <select 
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-sm font-bold outline-none focus:bg-white focus:border-slate-950 transition-all appearance-none"
                                value={examConfig.difficulty}
                                onChange={(e) => setExamConfig({...examConfig, difficulty: e.target.value})}
                            >
                                <option value="Basic">GUÍA DE APRENDIZAJE (Manual)</option>
                                <option value="Intermediate">CONTROL SEMANAL (Aplicación)</option>
                                <option value="University">EXAMEN SOLEMNE UNAB (Rigor)</option>
                                <option value="PhD">EXAMEN DE GRADO (Síntesis)</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateExam}
                        disabled={isGenerating}
                        className="w-full bg-slate-950 text-white py-6 rounded-[32px] font-black flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl hover:bg-slate-800 transition-all active:scale-95 group"
                    >
                        {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 text-yellow-400 group-hover:rotate-45 transition-transform" />}
                        {isGenerating ? 'COMPILANDO...' : 'GENERAR INSTRUMENTO'}
                    </button>
                </div>
             </div>

             <div className="lg:col-span-8 h-full">
                {generatedExam ? (
                    <div className="flex flex-col gap-8 animate-in zoom-in duration-700 h-full">
                         <div className="bg-white p-6 rounded-[40px] border border-slate-200 shadow-xl flex justify-between items-center px-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Documento Arquitectado</h3>
                                    <p className="text-[10px] font-bold text-slate-400">Verificado por IA Architect Core 3.1</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => {navigator.clipboard.writeText(generatedExam); alert("Copiado");}} className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100"><Copy className="w-6 h-6" /></button>
                                <button className="p-4 bg-slate-950 text-white rounded-2xl shadow-2xl hover:bg-slate-800 flex items-center gap-3 text-xs font-black px-8"><Printer className="w-5 h-5" /> IMPRIMIR PDF</button>
                            </div>
                         </div>
                         
                         <div className="bg-slate-200/50 p-10 md:p-20 rounded-[64px] border border-slate-200 overflow-x-auto shadow-inner h-full flex items-start justify-center">
                            <SimpleMarkdownRenderer text={generatedExam} />
                         </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[64px] border-8 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-32 h-full min-h-[800px] group transition-all hover:bg-slate-50/30">
                        <div className="p-16 bg-slate-50 rounded-full mb-12 group-hover:bg-slate-100 transition-colors duration-500">
                            <Brain className="w-40 h-40 text-slate-200 group-hover:text-slate-300 transition-colors" />
                        </div>
                        <h3 className="text-4xl font-black text-slate-950 tracking-tighter">Diseño de Evaluaciones</h3>
                        <p className="text-slate-400 max-w-md mt-6 font-bold text-xl leading-relaxed">
                            Genera instrumentos de evaluación profesionales basados en tus propios materiales y el rigor UNAB.
                        </p>
                    </div>
                )}
             </div>
          </div>
        )}

        {/* TAB: BROADCAST */}
        {activeTab === 'BROADCAST' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
                <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-2xl space-y-10">
                    <h3 className="text-3xl font-black text-slate-950 flex items-center gap-5">
                        <Megaphone className="w-10 h-10 text-red-700" /> Difusión Multicanal
                    </h3>
                    <div className="space-y-8">
                        <div className="flex p-1.5 bg-slate-100 rounded-[32px] gap-1.5">
                            <button onClick={() => setBroadcastTarget('ALL')} className={`flex-1 py-4 rounded-[24px] text-xs font-black transition-all ${broadcastTarget === 'ALL' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400'}`}>Toda la Facultad</button>
                            <button onClick={() => setBroadcastTarget('COURSE')} className={`flex-1 py-4 rounded-[24px] text-xs font-black transition-all ${broadcastTarget === 'COURSE' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400'}`}>Curso Específico</button>
                        </div>
                        <div className="space-y-6">
                            <input type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-bold outline-none focus:bg-white focus:border-slate-950 shadow-inner" placeholder="Título del Comunicado Oficial" />
                            <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm h-56 resize-none outline-none focus:bg-white focus:border-slate-950 leading-relaxed font-medium shadow-inner" placeholder="Escribe el mensaje para la comunidad estudiantil..." />
                        </div>
                    </div>
                    <button onClick={handleSendBroadcast} className="w-full bg-slate-950 text-white py-6 rounded-[32px] font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 text-sm active:scale-95">
                        <Send className="w-6 h-6" /> EMITIR COMUNICADO OFICIAL
                    </button>
                </div>
                
                <div className="bg-slate-950 rounded-[56px] p-20 text-white flex flex-col justify-center items-center text-center relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-10 opacity-5 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-2000">
                        <Radio className="w-96 h-96" />
                     </div>
                     <div className="relative z-10 space-y-10">
                        <h4 className="text-5xl font-black tracking-tighter">Alcance Instantáneo</h4>
                        <p className="text-slate-400 max-w-md mx-auto font-bold text-lg leading-relaxed">
                            Sincronización automática con App, Correo Institucional y SMS para notificaciones críticas.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-md">
                                <div className="text-5xl font-black mb-2 text-blue-400">99%</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Efectividad</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-md">
                                <div className="text-5xl font-black mb-2 text-emerald-400">0.4s</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Latencia</div>
                            </div>
                        </div>
                     </div>
                </div>
             </div>
        )}

        {/* TAB: SENTINEL */}
        {activeTab === 'SENTINEL' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto h-full items-start">
                
                {/* Panel Lateral */}
                <div className="lg:col-span-1 space-y-6 sticky top-40">
                    <div className="bg-slate-950 rounded-[40px] p-8 text-white border border-white/10 shadow-2xl">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Estado Sentinel Core</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">Integridad LMS</span>
                                <span className="text-[10px] font-black text-emerald-500">SÍNCRONO</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                             <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Reportes Biométricos</button>
                             <button className="w-full py-4 bg-red-600/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-600/30">Protocolo de Emergencia</button>
                        </div>
                    </div>
                </div>

                {/* Feed de Logs */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-slate-950 text-white rounded-[24px] shadow-xl"><Database className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-black text-slate-950 text-2xl tracking-tighter">Terminal de Integridad</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros de Seguridad Campus</p>
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {sentinelLogs.map(log => (
                                <div key={log.id} className="p-10 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row items-start justify-between gap-10 group relative overflow-hidden">
                                    {log.level === 'CRÍTICO' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>}
                                    <div className="flex items-start gap-8 flex-1">
                                        <div className={`p-6 rounded-[32px] ${log.bg} ${log.color} shadow-sm group-hover:scale-105 transition-transform`}><ShieldAlert className="w-8 h-8" /></div>
                                        <div className="space-y-3 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="font-black text-slate-950 text-xl tracking-tight">{log.title}</h4>
                                                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase border tracking-widest ${log.color === 'text-orange-600' ? 'border-orange-200 bg-orange-100' : log.color === 'text-red-600' ? 'border-red-200 bg-red-100' : 'border-slate-200 bg-slate-100'}`}>{log.level}</span>
                                            </div>
                                            <p className="text-slate-500 text-lg max-w-4xl leading-relaxed font-medium">{log.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 shrink-0">
                                        <button className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all ${log.level === 'CRÍTICO' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-950 text-white hover:bg-slate-800'}`}>
                                            {log.status}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
