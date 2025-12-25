
import React, { useState } from 'react';
import { 
  Users, AlertTriangle, TrendingUp, 
  FileText, BarChart2, Activity,
  Brain, Send, Shield, MessageCircle, CheckCircle, FileQuestion, Settings, ChevronDown, Download, AlertCircle, Copy, Check, LifeBuoy, Filter
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
  { topic: 'Derivadas', questions: 120, fill: '#8884d8' },
  { topic: 'Integrales', questions: 85, fill: '#82ca9d' },
  { topic: 'Límites', questions: 45, fill: '#ffc658' },
  { topic: 'Álgebra', questions: 30, fill: '#ff8042' },
];

const atRiskStudents = [
  { id: 'u***1', risk: 'ALTO', reason: 'Baja asistencia + Alta ansiedad detectada', course: 'Cálculo I' },
  { id: 'u***5', risk: 'MEDIO', reason: 'Notas deficientes en Solemne 1', course: 'Física II' },
  { id: 'u***9', risk: 'MEDIO', reason: 'Inactividad en plataforma > 7 días', course: 'Programación' },
];

const sentinelLogs = [
  { id: 1, type: 'CRISIS', msg: 'Protocolo suicidio activado', time: '10:30 AM', status: 'Derivado DAE' },
  { id: 2, type: 'ETHICS', msg: 'Intento de copia en prueba detectado (Visión)', time: '09:15 AM', status: 'Bloqueado' },
  { id: 3, type: 'TOXIC', msg: 'Lenguaje ofensivo hacia el bot', time: 'Ayer', status: 'Advertencia' },
];

type Tab = 'ANALYTICS' | 'EXAM_GEN' | 'BROADCAST' | 'SENTINEL';

const formatMathText = (text: string) => {
  return text
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\sqrt\{(.*?)\}/g, '√($1)')
    .replace(/\\sqrt/g, '√')
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1/$2)')
    .replace(/\\cdot/g, '•')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\infty/g, '∞')
    .replace(/\\approx/g, '≈')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\%/g, '%')
    .replace(/\\/g, ''); 
};

const SimpleMarkdownRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-1 font-serif text-slate-800 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const cleanLine = formatMathText(line);
        if (cleanLine.startsWith('# ')) 
          return <h2 key={idx} className="text-2xl font-bold text-center text-slate-900 mt-6 mb-4 border-b-2 border-slate-900 pb-2 uppercase tracking-wider">{cleanLine.replace('# ', '')}</h2>;
        if (cleanLine.startsWith('## ')) 
          return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-6 mb-2 uppercase border-b border-slate-200 pb-1">{cleanLine.replace('## ', '')}</h3>;
        
        if (/^[a-d]\)/.test(cleanLine.trim())) {
             const isCorrect = cleanLine.includes('**');
             return (
                 <div key={idx} className={`ml-6 pl-2 py-1 ${isCorrect ? 'bg-green-50/50 -ml-2 pl-4 rounded border-l-2 border-green-500' : 'hover:bg-slate-50 rounded'}`}>
                    <span className="font-mono font-bold mr-2 text-slate-500">{cleanLine.trim().substring(0, 2)}</span>
                    <span className={isCorrect ? 'font-bold text-green-900' : 'text-slate-700'}>
                        {cleanLine.trim().substring(2).replace(/\*\*/g, '')}
                    </span>
                    {isCorrect && <span className="ml-2 text-[10px] text-green-600 font-bold border border-green-200 px-1 rounded bg-white">CORRECTA</span>}
                 </div>
             );
        }
        if (/^\d+\./.test(cleanLine.trim())) {
           return <div key={idx} className="mt-4 font-bold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">{cleanLine.replace(/\*\*/g, '')}</div>;
        }
        if (cleanLine.startsWith('**Dificultad')) {
            return <div key={idx} className="text-center text-xs text-slate-500 font-mono mb-6 border border-slate-200 inline-block px-3 py-1 rounded-full mx-auto w-full bg-slate-50">{cleanLine.replace(/\*\*/g, '')}</div>;
        }
        if (cleanLine.trim() === '') return <div key={idx} className="h-2"></div>;
        return <p key={idx} className="text-slate-700">{cleanLine.replace(/\*\*/g, '')}</p>;
      })}
    </div>
  );
};

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ANALYTICS');
  const [copied, setCopied] = useState(false);
  
  const [examConfig, setExamConfig] = useState({ topic: '', difficulty: 'University', qCount: 5, type: 'Mixed' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [msgSent, setMsgSent] = useState(false);

  const handleGenerateExam = async () => {
    if(!examConfig.topic) return;
    setIsGenerating(true);
    setGeneratedExam(null);
    setErrorMsg(null);
    setCopied(false);

    try {
      const examText = await generateExamWithGemini(examConfig.topic, examConfig.difficulty, examConfig.qCount);
      if (!examText || examText.length < 50) throw new Error("Respuesta incompleta.");
      setGeneratedExam(examText);
    } catch (e) {
      setErrorMsg("Error al generar. Verifica tu conexión.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
      if(generatedExam) {
          navigator.clipboard.writeText(generatedExam);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const handleBroadcast = () => {
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setBroadcastMsg('');
      setBroadcastSubject('');
    }, 3000);
  };

  const handleIntervention = (student: typeof atRiskStudents[0]) => {
     setBroadcastSubject("Apoyo Académico - UNAB");
     setBroadcastMsg(`Hola estimado/a estudiante (${student.id}). Hemos notado ciertas dificultades en ${student.course}. Queremos ofrecerte apoyo académico o emocional.`);
     setTargetAudience('RISK');
     setActiveTab('BROADCAST');
  };

  const fillTemplate = (type: 'support' | 'exam' | 'reminder') => {
      if (type === 'support') {
          setBroadcastSubject("Recursos de Apoyo Disponibles");
          setBroadcastMsg("Estimados estudiantes, les recuerdo que el Centro de Aprendizaje tiene horas disponibles para tutorías de Cálculo.");
      } else if (type === 'exam') {
          setBroadcastSubject("Información Solemne 2");
          setBroadcastMsg("La próxima evaluación se realizará el día Lunes en la sala 302. Los temas incluyen: Derivadas e Integrales.");
      } else if (type === 'reminder') {
          setBroadcastSubject("Recordatorio de Entrega");
          setBroadcastMsg("No olviden subir su informe final a la plataforma antes de las 23:59 de hoy.");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm sticky top-0 z-20 gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-700" /> Portal Docente
           </h2>
           <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Facultad de Ingeniería / Director</p>
        </div>
        
        <div className="w-full md:w-auto flex bg-slate-50 p-1 rounded-xl overflow-x-auto no-scrollbar gap-1 border border-slate-100">
          <button onClick={() => setActiveTab('ANALYTICS')} className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'ANALYTICS' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}>Analítica</button>
          <button onClick={() => setActiveTab('EXAM_GEN')} className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'EXAM_GEN' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-blue-600'}`}>IA Gen</button>
          <button onClick={() => setActiveTab('BROADCAST')} className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'BROADCAST' ? 'bg-white text-orange-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-orange-600'}`}>Difusión</button>
          <button onClick={() => setActiveTab('SENTINEL')} className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'SENTINEL' ? 'bg-white text-red-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-red-600'}`}>Sentinel</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">1,240</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Alumnos Activos</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">15</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Riesgo Deserción</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">85%</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Retención Mensual</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-purple-600" /> Mapa de Calor Académico</h3>
                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicConfusionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="topic" type="category" width={100} tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="questions" radius={[0, 4, 4, 0]} barSize={20}>
                        {topicConfusionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Termómetro Emocional</h3>
                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={academicMoodData}>
                      <defs>
                        <linearGradient id="colorMot" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="motivation" name="Motivación" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMot)" />
                      <Area type="monotone" dataKey="stress" name="Estrés" stroke="#ef4444" fillOpacity={1} fill="url(#colorStress)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           <LifeBuoy className="w-5 h-5 text-red-600" /> Radar de Retención & Riesgo
                        </h3>
                        <p className="text-sm text-slate-500">Estudiantes que requieren intervención inmediata.</p>
                    </div>
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        {atRiskStudents.length} Casos Activos
                    </span>
                </div>
                <div className="grid gap-4">
                    {atRiskStudents.map((student) => (
                        <div key={student.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-red-200 transition-colors gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-2 h-16 rounded-full shrink-0 ${student.risk === 'ALTO' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-sm">{student.id}</span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${student.risk === 'ALTO' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>Riesgo {student.risk}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800">{student.course}</h4>
                                    <p className="text-sm text-slate-500">{student.reason}</p>
                                </div>
                            </div>
                            <button onClick={() => handleIntervention(student)} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all shadow-sm active:scale-95">
                                <MessageCircle className="w-4 h-4" /> Enviar Apoyo
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'EXAM_GEN' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                   <Brain className="w-8 h-8" /> The Exam Architect
                 </h2>
                 <p className="text-blue-100 max-w-xl text-lg">
                   Crea evaluaciones completas en segundos. Ahora con soporte mejorado para selección múltiple y formato LaTeX.
                 </p>
               </div>
               <Brain className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-4 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
                     <h4 className="font-bold text-slate-700 flex items-center gap-2 text-lg"><Settings className="w-5 h-5 text-blue-600" /> Parámetros</h4>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tema / Unidad</label>
                       <input type="text" value={examConfig.topic} onChange={(e) => setExamConfig({...examConfig, topic: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium" placeholder="Ej: Termodinámica" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dificultad</label>
                       <div className="relative">
                         <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-100" value={examConfig.difficulty} onChange={(e) => setExamConfig({...examConfig, difficulty: e.target.value})}>
                           <option value="Basic">Nivel 1: Conceptos Básicos</option>
                           <option value="Intermediate">Nivel 2: Aplicación Práctica</option>
                           <option value="University">Nivel 3: Ingeniería (Solemne)</option>
                           <option value="PhD">Nivel 4: Experto (Complejo)</option>
                         </select>
                         <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase">Longitud del Examen</label>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{examConfig.qCount} Preguntas</span>
                       </div>
                       <div className="relative h-2 bg-slate-100 rounded-full mt-2">
                          <div className="absolute h-full bg-blue-600 rounded-full transition-all duration-150" style={{ width: `${(examConfig.qCount / 20) * 100}%` }}></div>
                          <input type="range" min="1" max="20" value={examConfig.qCount} onChange={(e) => setExamConfig({...examConfig, qCount: parseInt(e.target.value)})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                       </div>
                     </div>
                     <button onClick={handleGenerateExam} disabled={isGenerating || !examConfig.topic} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 mt-2 hover:translate-y-[-2px]">
                       {isGenerating ? <Activity className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                       {isGenerating ? 'Diseñando Examen...' : 'Generar Evaluación'}
                     </button>
                  </div>
               </div>
               <div className="md:col-span-8">
                 {errorMsg ? (
                    <div className="h-full bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center justify-center text-red-700 p-12 text-center animate-in zoom-in">
                       <AlertCircle className="w-12 h-12 mb-4" />
                       <h3 className="font-bold text-lg">Error de Generación</h3>
                       <p>{errorMsg}</p>
                    </div>
                 ) : generatedExam ? (
                   <div className="h-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg relative animate-in fade-in zoom-in duration-300 flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl" />
                      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl"><FileQuestion className="w-6 h-6" /></div>
                           <div>
                              <h3 className="font-bold text-slate-800 text-lg">Evaluación Generada</h3>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">IA Model: Gemini 1.5 Pro • Render: LaTeX Support</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={handleCopy} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar'}
                           </button>
                           <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
                             <Download className="w-4 h-4" /> <span className="text-sm font-bold">PDF</span>
                           </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                          <SimpleMarkdownRenderer text={generatedExam} />
                      </div>
                   </div>
                 ) : isGenerating ? (
                   <div className="h-full bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                       <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                          <Brain className="w-8 h-8 text-blue-600" />
                       </div>
                       <h3 className="font-bold text-slate-700 text-lg mb-2">Construyendo Evaluación...</h3>
                       <p className="text-slate-500 max-w-sm text-sm">La IA está analizando la complejidad, redactando distractores plausibles y formateando ecuaciones.</p>
                   </div>
                 ) : (
                   <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                          <Brain className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-slate-600 text-lg mb-2">Área de Trabajo Vacía</h3>
                      <p className="max-w-xs text-sm">Configura los parámetros a la izquierda y presiona "Generar" para ver la magia de la IA.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
        {activeTab === 'BROADCAST' && (
           <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1 space-y-6">
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><Filter className="w-5 h-5 text-orange-600" /> Audiencia</h2>
                     <div className="space-y-3">
                         {['ALL', 'RISK', 'GOOD'].map((opt) => (
                           <button key={opt} onClick={() => setTargetAudience(opt)} className={`w-full py-3 px-4 rounded-lg border text-left text-sm font-medium transition-all flex items-center justify-between ${targetAudience === opt ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                             <span>{opt === 'ALL' && 'Todos los Alumnos'}{opt === 'RISK' && '⚠️ Estudiantes en Riesgo'}{opt === 'GOOD' && '🌟 Cuadro de Honor'}</span>
                             {targetAudience === opt && <CheckCircle className="w-4 h-4" />}
                           </button>
                         ))}
                     </div>
                 </div>
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-blue-600" /> Plantillas Rápidas</h2>
                     <div className="space-y-2">
                         <button onClick={() => fillTemplate('support')} className="w-full text-left text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded transition-colors block border border-transparent hover:border-slate-100">💙 Ofrecer Apoyo</button>
                         <button onClick={() => fillTemplate('exam')} className="w-full text-left text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded transition-colors block border border-transparent hover:border-slate-100">📝 Info Solemne</button>
                         <button onClick={() => fillTemplate('reminder')} className="w-full text-left text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded transition-colors block border border-transparent hover:border-slate-100">⏰ Recordatorio Entrega</button>
                     </div>
                 </div>
             </div>
             <div className="md:col-span-2">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
                    <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-center gap-3">
                       <div className="p-2 bg-orange-100 rounded-lg text-orange-700"><MessageCircle className="w-6 h-6" /></div>
                       <div><h2 className="text-xl font-bold text-orange-900">Nueva Difusión</h2><p className="text-xs text-orange-700/70">Mensaje directo a la App del estudiante</p></div>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asunto</label>
                           <input type="text" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} placeholder="Ej: Cambio de Sala..." className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-100 outline-none font-bold text-slate-700" />
                        </div>
                        <div className="flex-1 h-full">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mensaje</label>
                           <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} placeholder="Escribe tu comunicado aquí..." className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-100 outline-none h-40 resize-none text-slate-600 leading-relaxed" />
                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
                        <span className="text-xs text-slate-400">Se enviará a <strong>{targetAudience === 'ALL' ? '1,240' : targetAudience === 'RISK' ? atRiskStudents.length : '124'}</strong> destinatarios.</span>
                        {msgSent ? <button disabled className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 cursor-default animate-in zoom-in"><CheckCircle className="w-5 h-5" /> Enviado</button> : <button onClick={handleBroadcast} disabled={!broadcastMsg || !broadcastSubject} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl active:scale-95"><Send className="w-5 h-5" /> Enviar Notificación</button>}
                    </div>
                </div>
             </div>
           </div>
        )}
        {activeTab === 'SENTINEL' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-4 bg-red-900 text-white p-6 rounded-xl shadow-lg">
                <Shield className="w-12 h-12 text-red-400" />
                <div><h2 className="text-2xl font-bold">Sentinel Audit Log</h2><p className="text-red-200">Registro inmutable de seguridad.</p></div>
             </div>
             <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-sm overflow-hidden font-mono text-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-800 border-b border-slate-700 text-slate-400"><tr><th className="p-4">TIPO</th><th className="p-4">EVENTO</th><th className="p-4">STATUS</th></tr></thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {sentinelLogs.map((log) => (
                      <tr key={log.id}><td className="p-4 text-xs font-bold text-slate-400">{log.type}</td><td className="p-4">{log.msg}</td><td className="p-4 text-green-400">{log.status}</td></tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
