import React from 'react';
import { AppView, UserRole } from '../types';
import { LayoutDashboard, MessageSquare, Heart, Map, User, LogOut, Coins } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
  userRole: UserRole;
  userCoins: number;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, onLogout, userRole, userCoins, children }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'text-red-600 bg-red-50 font-medium' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-6 h-6 md:w-5 md:h-5 ${currentView === view ? 'scale-110' : ''}`} />
      <span className="text-[10px] md:text-sm mt-1 md:mt-0">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-100">
      
      {/* Sidebar (Desktop) / Header (Mobile) */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4">
        <div className="mb-8 px-2 flex items-center gap-2">
           <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold">U</div>
           <span className="font-bold text-slate-800 text-lg">UNAB SuperApp</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Inicio" />
          <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="Asistente IA" />
          <NavItem view={AppView.WELLNESS} icon={Heart} label="Bienestar" />
          <NavItem view={AppView.CAMPUS} icon={Map} label="Campus" />
          <NavItem view={AppView.PROFILE} icon={User} label="Perfil" />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-yellow-50 p-3 rounded-xl flex items-center justify-between mb-4 border border-yellow-100">
             <div className="flex items-center gap-2 text-yellow-700 font-bold">
               <Coins className="w-5 h-5 fill-yellow-500 text-yellow-600" />
               <span>{userCoins}</span>
             </div>
             <span className="text-xs text-yellow-600 uppercase font-bold">Coins</span>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-20">
        <div className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-700 rounded text-white flex items-center justify-center text-xs">U</div>
          SuperApp
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
           <Coins className="w-4 h-4 text-yellow-600 fill-yellow-500" />
           <span className="text-xs font-bold text-yellow-700">{userCoins}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <div className="md:hidden bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center shrink-0 safe-area-bottom">
        <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Inicio" />
        <NavItem view={AppView.AI_CHAT} icon={MessageSquare} label="Chat" />
        <NavItem view={AppView.WELLNESS} icon={Heart} label="Salud" />
        <NavItem view={AppView.CAMPUS} icon={Map} label="Campus" />
      </div>

    </div>
  );
};

export default Layout;