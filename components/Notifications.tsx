
import React, { useState } from 'react';
import { ThemeColor, UserRole } from '../types';
import { Bell, Megaphone, Calendar, Pin, User, Building2, BookOpen, AlertCircle, PlusCircle, Send, X, CheckCircle, Clock, Mail, ChevronRight } from 'lucide-react';

interface NotificationsProps {
  primaryColor: ThemeColor;
  userRole: UserRole;
}

// Initial Mock Data
const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'ACADEMIC',
    author: 'Prof. Roberto Parra',
    role: 'Cálculo I',
    title: 'Suspensión de clase este Jueves',
    content: 'Estimados alumnos, por motivos de fuerza mayor la clase de este jueves 14 se suspende. El material de estudio ya está en el aula virtual. La clase se recuperará el próximo martes.',
    date: 'Hace 2 horas',
    priority: 'HIGH'
  },
  {
    id: 2,
    type: 'ADMIN',
    author: 'DAE - Asuntos Estudiantiles',
    role: 'Institucional',
    title: 'Cierre de postulaciones Beca Alimentación',
    content: 'Recuerden que el plazo fatal para renovar la BAES termina este viernes a las 23:59. No se aceptarán solicitudes fuera de plazo.',
    date: 'Ayer',
    priority: 'MEDIUM'
  },
  {
    id: 3,
    type: 'ACADEMIC',
    author: 'Prof. Ana María Soto',
    role: 'Física Mecánica',
    title: 'Notas Solemne 1 Publicadas',
    content: 'Ya pueden revisar sus calificaciones en el portal. La pauta de corrección estará disponible mañana en la ayudantía. Tienen 3 días para solicitar recorrección.',
    date: 'Hace 2 días',
    priority: 'NORMAL'
  },
  {
    id: 4,
    type: 'EVENT',
    author: 'Centro de Alumnos (CEAL)',
    role: 'Vida Universitaria',
    title: 'Bienvenida Mechona - Patio Central',
    content: '¡Los esperamos a todos para compartir pizzas y música en el patio central! Traigan sus credenciales.',
    date: 'Hace 3 días',
    priority: 'LOW'
  }
];

const INITIAL_MESSAGES = [
    { id: 101, sender: 'Prof. Roberto Parra', subject: 'Re: Duda sobre Ejercicio 3', preview: 'Hola, efectivamente había un error en la guía. Considera x=2 en lugar de x=3.', date: '10:30 AM', unread: true, avatarBg: 'bg-blue-100', avatarText: 'text-blue-700' },
    { id: 102, sender: 'Secretaría Académica', subject: 'Certificado de Alumno Regular', preview: 'Estimado estudiante, su certificado solicitado ya se encuentra disponible para descarga.', date: 'Ayer', unread: false, avatarBg: 'bg-red-100', avatarText: 'text-red-700' },
    { id: 103, sender: 'Ayudante Física', subject: 'Horario Ayudantía Extra', preview: 'Chicos, mañana haré una sesión extra para repasar antes de la solemne.', date: 'Lun', unread: false, avatarBg: 'bg-slate-100', avatarText: 'text-slate-700' },
];

const Notifications: React.FC<NotificationsProps> = ({ primaryColor, userRole }) => {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'INSTITUTIONAL' | 'TEACHERS' | 'INBOX'>('INSTITUTIONAL');
  
  // Teacher Creation State
  const [newPost, setNewPost] = useState({ title: '', content: '', priority: 'NORMAL' });
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getThemeText = () => {
    switch (primaryColor) {
      case 'blue': return 'text-blue-600';
      case 'emerald': return 'text-emerald-600';
      case 'purple': return 'text-purple-600';
      case 'slate': return 'text-slate-800';
      case 'red': default: return 'text-red-600';
    }
  };

  const getTabClass = (isActive: boolean) => {
    const baseClass = "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all";
    if (!isActive) return `${baseClass} border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50`;
    
    switch (primaryColor) {
      case 'blue': return `${baseClass} border-blue-600 text-blue-600 bg-blue-50`;
      case 'emerald': return `${baseClass} border-emerald-600 text-emerald-600 bg-emerald-50`;
      case 'purple': return `${baseClass} border-purple-600 text-purple-600 bg-purple-50`;
      case 'slate': return `${baseClass} border-slate-800 text-slate-800 bg-slate-100`;
      case 'red': default: return `${baseClass} border-red-600 text-red-600 bg-red-50`;
    }
  };

  const handlePostAnnouncement = () => {
    if(!newPost.title || !newPost.content) return;
    
    setIsPosting(true);
    
    // Simulate API Call
    setTimeout(() => {
        const post = {
            id: Date.now(),
            type: 'ACADEMIC',
            author: 'Tú (Profesor)',
            role: 'Mi Curso',
            title: newPost.title,
            content: newPost.content,
            date: 'Hace un momento',
            priority: newPost.priority
        };
        setAnnouncements([post, ...announcements]);
        setNewPost({ title: '', content: '', priority: 'NORMAL' });
        setIsPosting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const filteredData = announcements.filter(item => {
    if (activeTab === 'TEACHERS') return item.type === 'ACADEMIC';
    return item.type !== 'ACADEMIC'; // Admin & Events
  });

  // --- TEACHER VIEW RENDER ---
  if (userRole === UserRole.TEACHER) {
    return (
        <div className="h-full bg-slate-50 flex flex-col p-4 md:p-8 space-y-6">
            <div className="bg-white px-6 py-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Megaphone className={`w-6 h-6 ${getThemeText()}`} /> Panel de Comunicaciones
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Gestiona los avisos para tus cursos.</p>
                </div>
            </div>
            {/* ... Existing Teacher View Code ... */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CREATE POST CARD */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md h-fit">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-blue-600" /> Nuevo Comunicado
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título</label>
                            <input 
                                type="text" 
                                value={newPost.title}
                                onChange={e => setNewPost({...newPost, title: e.target.value})}
                                placeholder="Ej: Cambio de fecha Solemne..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mensaje</label>
                            <textarea 
                                value={newPost.content}
                                onChange={e => setNewPost({...newPost, content: e.target.value})}
                                placeholder="Escribe el detalle aquí..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none h-32 resize-none text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prioridad</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setNewPost({...newPost, priority: 'NORMAL'})}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newPost.priority === 'NORMAL' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                >
                                    Normal
                                </button>
                                <button 
                                    onClick={() => setNewPost({...newPost, priority: 'HIGH'})}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newPost.priority === 'HIGH' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                >
                                    Alta Importancia
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={handlePostAnnouncement}
                            disabled={!newPost.title || !newPost.content || isPosting}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                        >
                            {isPosting ? 'Publicando...' : <><Send className="w-4 h-4" /> Publicar Anuncio</>}
                        </button>
                        {showSuccess && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in zoom-in">
                                <CheckCircle className="w-4 h-4" /> Publicado exitosamente
                            </div>
                        )}
                    </div>
                </div>

                {/* PREVIEW FEED */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-2">Tus Anuncios Recientes</h3>
                    {announcements.filter(a => a.type === 'ACADEMIC').map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                             <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
                                 {item.author.charAt(0)}
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between items-start mb-1">
                                     <h4 className="font-bold text-slate-800">{item.title}</h4>
                                     {item.priority === 'HIGH' && (
                                        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Urgente</span>
                                     )}
                                 </div>
                                 <p className="text-slate-500 text-sm mb-2">{item.content}</p>
                                 <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                     <Clock className="w-3 h-3" /> {item.date} • {item.role}
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  // --- STUDENT VIEW RENDER ---
  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Megaphone className={`w-6 h-6 ${getThemeText()}`} /> Centro de Comunicación
        </h1>
        <p className="text-slate-500 text-sm font-medium">Todo lo que necesitas saber, en un solo lugar.</p>
      </div>

      {/* Tabs - Distinct Separation */}
      <div className="flex bg-white shadow-sm border-b border-slate-100 overflow-x-auto">
        <button onClick={() => setActiveTab('INSTITUTIONAL')} className={getTabClass(activeTab === 'INSTITUTIONAL')}>
           <Building2 className="w-4 h-4" /> <span className="whitespace-nowrap">🏛️ Campus</span>
        </button>
        <button onClick={() => setActiveTab('TEACHERS')} className={getTabClass(activeTab === 'TEACHERS')}>
           <BookOpen className="w-4 h-4" /> <span className="whitespace-nowrap">📚 Anuncios</span>
        </button>
        <button onClick={() => setActiveTab('INBOX')} className={getTabClass(activeTab === 'INBOX')}>
           <Mail className="w-4 h-4" /> <span className="whitespace-nowrap">📩 Mensajería</span>
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-24 space-y-4 bg-slate-50/50">
        
        {/* INBOX VIEW */}
        {activeTab === 'INBOX' ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex justify-between items-center mb-2 px-1">
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Bandeja de Entrada</h3>
                     <button className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-slate-700 transition-colors">
                         <PlusCircle className="w-3.5 h-3.5" /> Redactar
                     </button>
                 </div>
                 {INITIAL_MESSAGES.map((msg) => (
                     <div key={msg.id} className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md cursor-pointer group ${msg.unread ? 'border-l-4 border-l-blue-500 border-slate-200 bg-blue-50/30' : 'border-slate-200'}`}>
                         <div className="flex items-start gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${msg.avatarBg} ${msg.avatarText}`}>
                                 {msg.sender.charAt(0)}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                     <h4 className={`text-sm truncate pr-2 ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.sender}</h4>
                                     <span className="text-xs text-slate-400 whitespace-nowrap">{msg.date}</span>
                                 </div>
                                 <p className={`text-sm mb-1 ${msg.unread ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{msg.subject}</p>
                                 <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
                             </div>
                             <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 self-center" />
                         </div>
                     </div>
                 ))}
             </div>
        ) : (
            // ANNOUNCEMENTS VIEW (Filtered by Active Tab)
            filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 opacity-60">
                <Bell className="w-12 h-12 mb-3 stroke-1" />
                <p className="font-medium text-sm">No hay anuncios en esta sección.</p>
            </div>
            ) : (
            filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-0 border border-slate-200 shadow-sm transition-all hover:shadow-md group overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header Strip */}
                <div className={`px-5 py-3 border-b border-slate-100 flex justify-between items-center ${item.type === 'ACADEMIC' ? 'bg-blue-50/50' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                        {item.type === 'ACADEMIC' ? <BookOpen className="w-3.5 h-3.5 text-blue-500" /> : <Building2 className="w-3.5 h-3.5 text-slate-500" />}
                        <span className={`text-xs font-bold uppercase tracking-wide ${item.type === 'ACADEMIC' ? 'text-blue-700' : 'text-slate-600'}`}>
                            {item.role}
                        </span>
                    </div>
                    {item.priority === 'HIGH' && (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-white px-2 py-0.5 rounded-full border border-red-100 shadow-sm">
                                <AlertCircle className="w-3 h-3" /> Urgente
                            </div>
                    )}
                </div>

                <div className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Avatar / Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${
                            item.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-700' : 
                            item.type === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                            {item.author.charAt(0)}
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-base leading-tight mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mb-3">De: {item.author}</p>
                            
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {item.content}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {item.date}
                        </span>
                        {item.type === 'ACADEMIC' && (
                            <button className={`text-xs font-bold ${getThemeText()} hover:underline flex items-center gap-1`}>
                                Ver en Aula Virtual
                            </button>
                        )}
                    </div>
                </div>
                </div>
            ))
            )
        )}
      </div>
    </div>
  );
};

export default Notifications;
