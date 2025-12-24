import React, { useState } from 'react';
import { AppView, UserRole, UserState } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Campus from './components/Campus';
import Wellness from './components/Wellness';
import { User, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const handleLogin = (email: string, role: UserRole) => {
    // Simulate user data fetching
    setUser({
      email,
      role,
      name: email.split('@')[0], // Derive name from email for demo
      coins: 1250,
      streak: 14,
      stressLevel: 45,
      dyslexiaMode: false
    });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  // Toggle Dyslexia Font Global
  const toggleDyslexia = () => {
    if (user) {
      const newState = !user.dyslexiaMode;
      setUser({ ...user, dyslexiaMode: newState });
      if (newState) {
        document.body.classList.add('font-dyslexic');
      } else {
        document.body.classList.remove('font-dyslexic');
      }
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} />;
      case AppView.AI_CHAT:
        return <AIChat />;
      case AppView.CAMPUS:
        return <Campus />;
      case AppView.WELLNESS:
        return <Wellness />;
      case AppView.PROFILE:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Perfil y Ajustes</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                   <User className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                   <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{user.role}</span>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                   <div>
                     <span className="font-medium text-slate-800 block">Modo Dislexia (OpenDyslexic)</span>
                     <span className="text-xs text-slate-500">Mejora la legibilidad de textos.</span>
                   </div>
                   <button 
                    onClick={toggleDyslexia}
                    className={`w-12 h-6 rounded-full transition-colors relative ${user.dyslexiaMode ? 'bg-red-600' : 'bg-slate-300'}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${user.dyslexiaMode ? 'left-7' : 'left-1'}`} />
                   </button>
                 </div>
                 <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3">
                   <Shield className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                   <div>
                     <span className="font-bold text-yellow-800 text-sm block">Seguridad Sentinel Activada</span>
                     <p className="text-xs text-yellow-700 mt-1">
                       Todas las interacciones son monitoreadas por nuestro guardián ético para tu seguridad.
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      onLogout={handleLogout}
      userRole={user.role}
      userCoins={user.coins}
    >
      {renderView()}
    </Layout>
  );
};

export default App;