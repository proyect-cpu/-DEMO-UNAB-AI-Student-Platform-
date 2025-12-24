import React from 'react';
import { UserState } from '../types';
import {  Flame, Activity, BookOpen, Coffee, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  user: UserState;
}

const stressData = [
  { day: 'L', level: 30 },
  { day: 'M', level: 45 },
  { day: 'X', level: 80 },
  { day: 'J', level: 60 },
  { day: 'V', level: 20 },
  { day: 'S', level: 10 },
  { day: 'D', level: 5 },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-full pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hola, {user.name}</h2>
          <p className="text-slate-500">¿Listo para dominar el semestre?</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-700">{user.streak} días racha</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Anti-Burnout Monitor */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" /> Carga Semanal
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-bold ${user.stressLevel > 70 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {user.stressLevel > 70 ? 'ALTA - Cuidado' : 'OPTIMA'}
            </span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressData}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="level" radius={[4, 4, 0, 0]}>
                  {stressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.level > 70 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick News (Info Inteligente) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-500" /> Cartelera Personalizada
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs font-bold text-blue-700">BECAS</p>
              <p className="text-sm text-slate-700">Postulación Beca Alimentación cierra mañana.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-500">
              <p className="text-xs font-bold text-slate-700">CAMPUS</p>
              <p className="text-sm text-slate-700">Bus de acercamiento Casona cambia horario a las 14:00.</p>
            </div>
          </div>
        </div>

        {/* Next Class / Location */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-500" /> Próxima Cátedra
          </h3>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-slate-800">14:30</div>
            <div className="text-lg text-purple-700 font-medium">Inteligencia Artificial</div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
              <span className="bg-slate-100 px-2 py-1 rounded">R1 - Sala 302</span>
              <span className="text-green-600 text-xs font-bold">● A tiempo</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2">
          <Activity className="w-6 h-6" />
          <span className="font-medium">SOS Pánico</span>
        </button>
        <button className="p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex flex-col items-center gap-2">
          <Coffee className="w-6 h-6 text-brown-500" />
          <span className="font-medium">Menú Casino</span>
        </button>
        {/* More actions... */}
      </div>
    </div>
  );
};

export default Dashboard;