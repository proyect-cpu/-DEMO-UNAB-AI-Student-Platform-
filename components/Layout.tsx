
import React from 'react';
import { AppView, UserRole, ThemeColor } from '../types';
import { LayoutDashboard, MessageSquare, Heart, Map, User, LogOut, Coins, BarChart, Bell, Briefcase, Landmark } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
  userRole: UserRole;
  userCoins: number;
  primaryColor: ThemeColor;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentView, onChangeView, onLogout, userRole, 
  userCoins, primaryColor, children 
}) => {
  
  const isTeacher = userRole === UserRole.TEACHER;

  const getThemeClasses = (isActive: boolean) => {
    if (!isActive) return 'text-slate-400 hover:text-slate-600 hover:bg-slate-50';
    switch (primaryColor) {
      case 'blue': return 'text-blue-600 bg-blue-50 font-bold';
      case 'emerald': return 'text-emerald-600 bg-emerald-50 font-bold';
      case 'purple': return 'text-purple-600 bg-purple-50 font-bold';
      case 'slate': return 'text-slate-800 bg-slate-200 font-bold';
      case 'red': default: return 'text-red-600 bg-red-50 font-bold';
    }
  };

  const getLogoColor = () => {
    switch (primaryColor) {
      case 'blue': return 'bg-blue-700';
      case 'emerald': return 'bg-emerald-700';
      case 'purple': return 'bg-purple-700';
      case 'slate': return 'bg-slate-900';
      case 'red': default: return 'bg-red-700';
    }
  };

  const NavItem = ({ view, icon: Icon, label, isMobile = false }: { view: AppView, icon: React.ElementType, label: string, isMobile?: boolean }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`flex items-center transition-all ${
        isMobile 
         ? `flex-col justify-center py-2 px-1 min-w-[60px] active:scale-95 ${currentView === view ? getThemeClasses(true).replace('bg-', 'bg-opacity-0 ') : 'text-slate-400'}`
         : `flex-row gap-3 px-4 py-3.5 rounded-2xl ${getThemeClasses(currentView === view)}`
      }`}
    >
      <Icon className={`${isMobile ? 'w-5 h-5 mb-1' : 'w-5 h-5'} ${currentView === view ? 'scale-110' : 'stroke-[1.5px]'}`} />
      <span className={`${isMobile ? 'text-[9px] font-black uppercase tracking-tighter' : 'text-sm font-bold'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#f8fafc] overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-6 relative z-30 shadow-sm shrink-0">
        <div className="mb-10 px-2 flex items-center gap-3">
           <div className={`w-10 h-10 ${getLogoColor()} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3`}>U</div>
           <div className="flex flex-col">
                <span className="font-black text-slate-900 text-lg leading-none tracking-tighter">SuperApp</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Estudiante</span>
           </div>
        </div>
        
        <div className="flex-1 space-y-1.5">
          <NavItem view={AppView.DASHBOARD} icon={isTeacher ? BarChart : LayoutDashboard} label={isTeacher ? "Analytics" : "Dashboard"} />
          <NavItem view={AppView.MANAGEMENT} icon={Landmark} label="Secretaría" />
          <NavItem view={AppView.NOTIFICATIONS} icon={Bell} label="Noticias" />
          <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="Asistente IA" />
          <NavItem view={AppView.CAMPUS} icon={Map} label="Mi Campus" />
          <NavItem view={AppView.WELLNESS} icon={Heart} label="Bienestar" />
          <NavItem view={AppView.PROFILE} icon={User} label="Mi Perfil" />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 w-full transition-colors font-bold text-sm">
            <LogOut className="w-5 h-5" />
            <span>Desconectar</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white px-5 py-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-50 shadow-sm h-[64px] shrink-0 safe-top">
        <div className="font-black text-slate-900 flex items-center gap-2 tracking-tighter text-xl">
          <div className={`w-8 h-8 ${getLogoColor()} rounded-xl text-white flex items-center justify-center text-sm shadow-md`}>U</div>
          <span>SuperApp</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={onLogout} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-200 active:scale-95 shadow-sm">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 h-full relative overflow-hidden flex flex-col bg-[#f8fafc]`}>
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-[84px] md:pb-0 h-full w-full">
             {children}
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 pb-safe-bottom flex justify-between items-center shrink-0 fixed bottom-0 left-0 right-0 z-50 h-[74px] shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]">
        <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Inicio" isMobile />
        <NavItem view={AppView.MANAGEMENT} icon={Landmark} label="Trámites" isMobile />
        <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="IA Chat" isMobile />
        <NavItem view={AppView.CAMPUS} icon={Map} label="Campus" isMobile />
        <NavItem view={AppView.PROFILE} icon={User} label="Perfil" isMobile />
      </div>

    </div>
  );
};

export default Layout;
