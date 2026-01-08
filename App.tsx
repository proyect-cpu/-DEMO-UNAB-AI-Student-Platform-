
import React, { useState } from 'react';
import { AppView, UserRole, UserState, ThemeColor, AIMode, Message } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AIChat from './components/AIChat';
import Campus from './components/Campus';
import Wellness from './components/Wellness';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import UniversityManagement from './components/UniversityManagement';

// Initial Messages for each mode
const INITIAL_CHATS: Record<AIMode, Message[]> = {
  [AIMode.TUTOR]: [{
    id: 'init-tutor', role: 'model', timestamp: new Date(),
    text: '¡Hola! Soy el Profesor Sócrates. ¿En qué materia necesitas ayuda hoy? (Matemáticas, Física, Programación...)'
  }],
  [AIMode.PSYCHOLOGIST]: [{
    id: 'init-psy', role: 'model', timestamp: new Date(),
    text: 'Hola, soy Sam. Este es un espacio seguro y confidencial. ¿Cómo te sientes hoy?'
  }],
  [AIMode.COACH]: [{
    id: 'init-coach', role: 'model', timestamp: new Date(),
    text: 'Soy The Shark. Vamos a optimizar tu carrera. ¿Qué dice tu CV o LinkedIn?'
  }],
  [AIMode.BUROCRACY]: [{
    id: 'init-admin', role: 'model', timestamp: new Date(),
    text: 'UNAB-Bot Administrativo listo. ¿Consultas sobre CAE, TNE, Toma de Ramos o Justificativos?'
  }]
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // GLOBAL CHAT STATE (PERSISTENCE)
  const [chatHistories, setChatHistories] = useState<Record<AIMode, Message[]>>(INITIAL_CHATS);
  const [activeAIMode, setActiveAIMode] = useState<AIMode>(AIMode.TUTOR);

  const handleLogin = (email: string, role: UserRole) => {
    const isTeacher = role === UserRole.TEACHER;
    
    // Generate Unique ID
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `U-${new Date().getFullYear()}-${randomId}`;

    // Mock Grades for Students
    const mockGrades = isTeacher ? undefined : [
        { subject: 'Cálculo I', score: 5.5, weight: 30, date: '12/03' },
        { subject: 'Física Mecánica', score: 4.2, weight: 25, date: '15/03' },
        { subject: 'Programación', score: 6.8, weight: 20, date: '20/03' },
        { subject: 'Algebra', score: 3.9, weight: 35, date: '22/03' },
    ];

    setUser({
      id: uniqueId,
      email,
      role,
      name: isTeacher ? "Director Académico" : email.split('@')[0], 
      coins: isTeacher ? 0 : 1250,
      streak: isTeacher ? 0 : 14,
      stressLevel: 45,
      dyslexiaMode: false,
      themeColor: 'red',
      grades: mockGrades
    });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
    setChatHistories(INITIAL_CHATS); 
    setActiveAIMode(AIMode.TUTOR);
  };

  const handleUpdateUser = (updates: Partial<UserState>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const handleUpdateChatHistory = (mode: AIMode, newMessages: Message[]) => {
    setChatHistories(prev => ({
      ...prev,
      [mode]: newMessages
    }));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const themeProps = {
    primaryColor: user.themeColor
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        if (user.role === UserRole.TEACHER) {
          return <TeacherDashboard />;
        }
        return <Dashboard user={user} {...themeProps} />;
      
      case AppView.NOTIFICATIONS:
        return <Notifications {...themeProps} userRole={user.role} />;
      
      case AppView.MANAGEMENT:
        return <UniversityManagement user={user} {...themeProps} />;

      case AppView.AI_CHAT:
        return (
          <AIChat 
            histories={chatHistories}
            onUpdateHistory={handleUpdateChatHistory}
            currentMode={activeAIMode}
            onModeChange={setActiveAIMode}
          />
        );
      case AppView.CAMPUS:
        return <Campus {...themeProps} />;
      case AppView.WELLNESS:
        return (
          <Wellness {...themeProps} />
        );
      case AppView.PROFILE:
        return <Profile user={user} onUpdateUser={handleUpdateUser} />;
      default:
        if (user.role === UserRole.TEACHER) return <TeacherDashboard />;
        return <Dashboard user={user} {...themeProps} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      onLogout={handleLogout}
      userRole={user.role}
      userCoins={user.coins}
      primaryColor={user.themeColor}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
