
import React from 'react';
import { AppView, UserRole, ThemeColor } from '../types';
import { LayoutDashboard, MessageSquare, Heart, Map, User, LogOut, Coins, BarChart, Bell } from 'lucide-react';

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
      case 'blue': return 'text-blue-600 bg-blue-50 font-medium';
      case 'emerald': return 'text-emerald-600 bg-emerald-50 font-medium';
      case 'purple': return 'text-purple-600 bg-purple-50 font-medium';
      case 'slate': return 'text-slate-800 bg-slate-200 font-medium';
      case 'red': default: return 'text-red-600 bg-red-50 font-medium';
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
         ? `flex-col justify-center py-1 px-1 min-w-[50px] ${currentView === view ? getThemeClasses(true).replace('bg-', 'bg-opacity-0 ') : 'text-slate-400'}`
         : `flex-row gap-3 px-4 py-3 rounded-xl ${getThemeClasses(currentView === view)}`
      }`}
    >
      <Icon className={`${isMobile ? 'w-5 h-5 mb-1' : 'w-5 h-5'} ${currentView === view ? 'scale-110 stroke-[2.5px]' : ''}`} />
      <span className={`${isMobile ? 'text-[9px] font-medium' : 'text-sm'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 relative z-30 shadow-sm shrink-0">
        <div className="mb-8 px-2 flex items-center gap-2">
           <div className={`w-8 h-8 ${getLogoColor()} rounded-lg flex items-center justify-center text-white font-bold transition-colors duration-300`}>U</div>
           <span className="font-bold text-slate-800 text-lg">UNAB SuperApp</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <NavItem view={AppView.DASHBOARD} icon={isTeacher ? BarChart : LayoutDashboard} label={isTeacher ? "Gestión Académica" : "Inicio"} />
          <NavItem view={AppView.NOTIFICATIONS} icon={Bell} label="Anuncios" />
          <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="Asistente IA" />
          <NavItem view={AppView.WELLNESS} icon={Heart} label="Bienestar" />
          <NavItem view={AppView.CAMPUS} icon={Map} label="Campus" />
          <NavItem view={AppView.PROFILE} icon={User} label="Perfil" />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          {!isTeacher && (
            <div className="bg-yellow-50 p-3 rounded-xl flex items-center justify-between mb-4 border border-yellow-100">
               <div className="flex items-center gap-2 text-yellow-700 font-bold">
                 <Coins className="w-5 h-5 fill-yellow-500 text-yellow-600" />
                 <span>{userCoins}</span>
               </div>
               <span className="text-xs text-yellow-600 uppercase font-bold">Coins</span>
            </div>
          )}
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-slate-200 sticky top-0 z-50 shadow-sm h-[60px] shrink-0">
        <div className="font-bold text-slate-800 flex items-center gap-2">
          <div className={`w-8 h-8 ${getLogoColor()} rounded-lg text-white flex items-center justify-center text-sm shadow-md`}>U</div>
          <span className="tracking-tight">SuperApp</span>
        </div>
        <div className="flex items-center gap-3">
            {!isTeacher && (
              <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                  <Coins className="w-4 h-4 text-yellow-600 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">{userCoins}</span>
              </div>
            )}
            <button onClick={onLogout} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 h-full relative overflow-hidden flex flex-col bg-slate-50`}>
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
             {children}
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <div className="md:hidden bg-white border-t border-slate-200 px-1 py-1 flex justify-between items-center shrink-0 fixed bottom-0 left-0 right-0 z-50 h-[60px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavItem view={AppView.DASHBOARD} icon={isTeacher ? BarChart : LayoutDashboard} label="Inicio" isMobile />
        <NavItem view={AppView.NOTIFICATIONS} icon={Bell} label="Anuncios" isMobile />
        <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="Chat" isMobile />
        <NavItem view={AppView.CAMPUS} icon={Map} label="Campus" isMobile />
        <NavItem view={AppView.PROFILE} icon={User} label="Perfil" isMobile />
      </div>

    </div>
  );
};

export default Layout;
