
import React, { useRef, useState, useEffect } from 'react';
import { UserState, ThemeColor } from '../types';
import { User, Shield, Camera, Save, Type, Hash, Palette, X, Edit2, Plus, Check, IdCard, QrCode } from 'lucide-react';

interface ProfileProps {
  user: UserState;
  onUpdateUser: (updatedUser: Partial<UserState>) => void;
}

const THEME_OPTIONS: { name: string, value: ThemeColor, gradient: string, ring: string }[] = [
  { name: 'UNAB Red', value: 'red', gradient: 'from-red-800 via-red-700 to-slate-900', ring: 'ring-red-500' },
  { name: 'Ocean Blue', value: 'blue', gradient: 'from-blue-800 via-blue-600 to-slate-900', ring: 'ring-blue-500' },
  { name: 'Forest Green', value: 'emerald', gradient: 'from-emerald-800 via-emerald-600 to-slate-900', ring: 'ring-emerald-500' },
  { name: 'Royal Purple', value: 'purple', gradient: 'from-purple-800 via-purple-600 to-slate-900', ring: 'ring-purple-500' },
  { name: 'Midnight', value: 'slate', gradient: 'from-slate-900 via-slate-800 to-black', ring: 'ring-slate-500' },
];

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(user.nickname || user.name);
  const [tempBio, setTempBio] = useState(user.bio || "Estudiante apasionado | Futuro profesional");
  const [newTag, setNewTag] = useState('');
  
  // Estado para controlar la animación de cambio de tema
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    setTempNickname(user.nickname || user.name);
    setTempBio(user.bio || "Estudiante apasionado | Futuro profesional");
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdateUser({ avatar: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    if (!tempNickname.trim()) return;
    onUpdateUser({ nickname: tempNickname, bio: tempBio });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = user.interests || [];
      if (!currentTags.includes(newTag.trim()) && currentTags.length < 5) {
        onUpdateUser({ interests: [...currentTags, newTag.trim()] });
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = user.interests || [];
    onUpdateUser({ interests: currentTags.filter(t => t !== tagToRemove) });
  };

  const toggleDyslexia = () => {
    const newState = !user.dyslexiaMode;
    onUpdateUser({ dyslexiaMode: newState });
    document.body.classList.toggle('font-dyslexic', newState);
  };

  // Manejador de cambio de tema con animación robusta
  const handleThemeChange = (newColor: ThemeColor) => {
    if (user.themeColor === newColor || isThemeChanging) return; // Prevent spamming
    
    // 1. Iniciar Fade Out
    setIsThemeChanging(true);

    // 2. Esperar que termine la animación de salida (300ms)
    setTimeout(() => {
        onUpdateUser({ themeColor: newColor });
        
        // 3. Pequeño delay para asegurar render y luego Fade In
        setTimeout(() => {
            setIsThemeChanging(false);
        }, 50);
    }, 300);
  };

  const currentThemeObj = THEME_OPTIONS.find(t => t.value === user.themeColor) || THEME_OPTIONS[0];

  return (
    <div className="p-4 md:p-8 h-full bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Mi Identidad Digital</h2>
           <p className="text-sm text-slate-500">Gestiona tu presencia en la SuperApp</p>
        </div>
        {!isEditing && (
            <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-bold shadow-sm"
            >
                <Edit2 className="w-4 h-4" /> Editar
            </button>
        )}
      </div>
      
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Card Main */}
        <div className={`w-full rounded-[32px] p-1.5 shadow-2xl transition-all duration-300 ease-in-out relative overflow-hidden isolate bg-gradient-to-br ${currentThemeObj.gradient} ${isThemeChanging ? 'opacity-50 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
           
           {/* Animated Blobs Background */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-[80px] animate-blob pointer-events-none transform translate-x-1/2 -translate-y-1/2 opacity-50 z-0"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full mix-blend-overlay filter blur-[80px] animate-blob animation-delay-2000 pointer-events-none transform -translate-x-1/2 translate-y-1/2 opacity-50 z-0"></div>

           {/* Content Container */}
           <div className="bg-white/10 backdrop-blur-lg rounded-[28px] p-6 md:p-10 border border-white/10 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
              
              {/* Avatar Section */}
              <div className="relative group shrink-0 z-20">
                 <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-tr from-white/40 to-white/10 shadow-2xl mx-auto backdrop-blur-sm">
                   <div className="w-full h-full rounded-full border-4 border-slate-900/50 overflow-hidden bg-slate-800 flex items-center justify-center relative shadow-inner">
                     {user.avatar ? (
                         <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                         <User className="w-16 h-16 text-slate-400" />
                     )}
                     
                     {/* Overlay for uploading */}
                     <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                     >
                       <Camera className="w-8 h-8 text-white mb-1" />
                       <span className="text-white text-[10px] font-bold uppercase tracking-widest">Cambiar</span>
                     </div>
                   </div>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 
                 {/* Status Indicator */}
                 <div className="absolute bottom-3 right-1/2 translate-x-12 md:translate-x-16 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full shadow-lg" title="Estado: Activo"></div>
              </div>

              {/* Info & Edit Section */}
              <div className="flex-1 w-full text-center md:text-left z-20 min-w-0">
                  {isEditing ? (
                    <div className="w-full space-y-4 bg-black/30 p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-lg relative animate-in fade-in zoom-in duration-300">
                      <button onClick={() => setIsEditing(false)} className="absolute top-2 right-2 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="text-left">
                        <label className="text-[10px] text-white/80 font-bold uppercase tracking-wider block mb-1.5 ml-1">Nombre</label>
                        <input 
                          type="text" 
                          value={tempNickname} 
                          onChange={(e) => setTempNickname(e.target.value)} 
                          className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/20 focus:border-white/40 font-bold text-lg placeholder-white/30 transition-all shadow-inner"
                          placeholder="Tu nombre..."
                        />
                      </div>
                      <div className="text-left">
                        <label className="text-[10px] text-white/80 font-bold uppercase tracking-wider block mb-1.5 ml-1">Biografía</label>
                        <textarea 
                          value={tempBio} 
                          onChange={(e) => setTempBio(e.target.value)} 
                          className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/20 focus:border-white/40 text-sm h-24 resize-none leading-relaxed placeholder-white/30 transition-all shadow-inner"
                          placeholder="Cuéntanos sobre ti..."
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                          <button onClick={handleSaveProfile} className="flex-1 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 transform duration-150">
                              <Save className="w-4 h-4" /> Guardar
                          </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                       <div className="space-y-2">
                           <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg break-words">
                               {user.nickname || user.name}
                           </h3>
                           <p className="text-white/90 text-lg font-medium italic leading-relaxed max-w-lg mx-auto md:mx-0 drop-shadow-md">
                               "{user.bio || "Estudiante UNAB"}"
                           </p>
                           
                           {/* UNIQUE ID CARD */}
                           <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-md mt-2 shadow-inner">
                               <IdCard className="w-5 h-5 text-white/80" />
                               <div className="text-left">
                                   <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">ID Institucional</div>
                                   <div className="font-mono font-bold text-white text-base tracking-wide">{user.id}</div>
                               </div>
                               <div className="h-6 w-px bg-white/20 mx-1"></div>
                               <QrCode className="w-6 h-6 text-white" />
                           </div>
                       </div>
                       
                       {/* Tags Display */}
                       <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                          {user.interests?.map(tag => (
                              <span key={tag} className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1 backdrop-blur-md shadow-sm hover:bg-white/30 transition-colors cursor-default">
                                  <Hash className="w-3 h-3 opacity-70" /> {tag}
                              </span>
                          ))}
                          {(!user.interests || user.interests.length === 0) && (
                              <span className="text-white/50 text-sm border border-dashed border-white/20 px-4 py-1.5 rounded-full">
                                  Sin intereses agregados
                              </span>
                          )}
                       </div>
                    </div>
                  )}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
           {/* PERSONALIZACIÓN */}
           <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-6 transition-all hover:shadow-md h-full">
              <div className="border-b border-slate-100 pb-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <div className={`p-2 rounded-lg bg-slate-50 ${user.themeColor === 'slate' ? 'text-slate-800' : 'text-purple-600'}`}>
                          <Palette className="w-5 h-5" />
                      </div>
                      Personalización de Aura
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 ml-11">Elige el color que define tu experiencia.</p>
              </div>
              
              {/* Bloque 1: Aura Selector */}
              <div className="space-y-4 flex-1">
                 <div className="flex flex-wrap gap-6 justify-center md:justify-start p-2">
                   {THEME_OPTIONS.map((theme) => (
                     <div key={theme.name} className="flex flex-col items-center gap-2 group relative">
                         <button 
                            onClick={() => handleThemeChange(theme.value)} 
                            disabled={isThemeChanging}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-md ${user.themeColor === theme.value ? `ring-4 ${theme.ring} ring-offset-2 ring-offset-white scale-110 z-10` : 'hover:scale-105 hover:shadow-lg'}`}
                            title={theme.name}
                         >
                            {user.themeColor === theme.value && (
                                <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full animate-in zoom-in duration-300">
                                    <Check className="w-4 h-4 text-white font-bold" />
                                </div>
                            )}
                         </button>
                         <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors text-center ${user.themeColor === theme.value ? 'text-slate-800' : 'text-slate-300 group-hover:text-slate-500'}`}>
                             {theme.name.split(' ')[0]}
                         </span>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Bloque 2: Tags Editor */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Editar Intereses
                 </label>
                 
                 <div className="flex gap-2">
                     <input 
                      type="text" 
                      value={newTag} 
                      onChange={(e) => setNewTag(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} 
                      placeholder="Ej: Tenis, Robótica..." 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all font-medium text-slate-700 outline-none" 
                      disabled={user.interests && user.interests.length >= 5} 
                     />
                     <button 
                      onClick={handleAddTag} 
                      disabled={!newTag.trim() || (user.interests && user.interests.length >= 5)}
                      className="bg-slate-900 text-white w-12 rounded-xl disabled:opacity-50 hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg active:scale-95"
                     >
                         <Plus className="w-5 h-5" />
                     </button>
                 </div>

                 <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {user.interests?.map(tag => (
                      <div key={tag} className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm animate-in zoom-in group hover:border-red-200 transition-colors">
                          <span>#{tag}</span>
                          <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all">
                              <X className="w-3 h-3" />
                          </button>
                      </div>
                    ))}
                 </div>
                 <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase ${user.interests && user.interests.length >= 5 ? 'text-red-500' : 'text-slate-400'}`}>
                        {user.interests?.length || 0}/5 Tags
                    </span>
                 </div>
              </div>
           </div>
           
           {/* SISTEMA & ACCESIBILIDAD */}
           <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-6 transition-all hover:shadow-md h-full">
              <div className="border-b border-slate-100 pb-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-green-50 text-green-600">
                        <Shield className="w-5 h-5" /> 
                      </div>
                      Sistema & Accesibilidad
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 ml-11">Configuración avanzada de la cuenta.</p>
              </div>
              
              <div className="space-y-4">
                {/* Dyslexia Toggle */}
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-purple-200 transition-colors group">
                   <div className="flex items-center gap-4">
                       <div className="p-3 bg-white text-purple-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Type className="w-5 h-5" /></div>
                       <div>
                           <span className="font-bold text-slate-800 text-sm block">Modo Dislexia</span>
                           <span className="text-xs text-slate-500">Fuente OpenDyslexic para mejor lectura.</span>
                       </div>
                   </div>
                   <button 
                    onClick={toggleDyslexia} 
                    className={`w-12 h-7 rounded-full transition-colors relative shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-200 ${user.dyslexiaMode ? 'bg-purple-600' : 'bg-slate-300'}`}
                   >
                       <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-transform duration-300 cubic-bezier(0.4, 0.0, 0.2, 1) ${user.dyslexiaMode ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>

                {/* Security Info */}
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex gap-4 items-start">
                   <div className="p-2 bg-emerald-100 rounded-full shrink-0">
                       <Shield className="w-5 h-5 text-emerald-700" />
                   </div>
                   <div>
                       <h5 className="font-bold text-emerald-800 text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                           Sentinel Active <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                       </h5>
                       <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                           Tus datos biométricos están encriptados de extremo a extremo (E2EE). 
                           Nadie más tiene acceso a tu información sensible.
                       </p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
