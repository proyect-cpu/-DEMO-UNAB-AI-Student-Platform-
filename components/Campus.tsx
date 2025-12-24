import React, { useState } from 'react';
import { Bus, Utensils, MapPin, Clock, Users } from 'lucide-react';
import { BusRoute } from '../types';

const mockBuses: BusRoute[] = [
  { id: '1', name: 'Inter-Sedes', origin: 'Casona', destination: 'República', nextDeparture: '14:00', status: 'OnTime' },
  { id: '2', name: 'Acercamiento', origin: 'Metro Los Dominicos', destination: 'Casona', nextDeparture: '14:15', status: 'Delayed' },
  { id: '3', name: 'Inter-Sedes', origin: 'República', destination: 'Antonio Varas', nextDeparture: '14:30', status: 'OnTime' },
];

const Campus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BUS' | 'FOOD' | 'ROOMS'>('BUS');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tabs */}
      <div className="flex bg-white shadow-sm">
        <button
          onClick={() => setActiveTab('BUS')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 flex justify-center items-center gap-2 ${activeTab === 'BUS' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}
        >
          <Bus className="w-5 h-5" /> <span className="hidden md:inline">Transporte</span>
        </button>
        <button
          onClick={() => setActiveTab('FOOD')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 flex justify-center items-center gap-2 ${activeTab === 'FOOD' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500'}`}
        >
          <Utensils className="w-5 h-5" /> <span className="hidden md:inline">Casino & Filas</span>
        </button>
        <button
          onClick={() => setActiveTab('ROOMS')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 flex justify-center items-center gap-2 ${activeTab === 'ROOMS' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500'}`}
        >
          <MapPin className="w-5 h-5" /> <span className="hidden md:inline">Salas Vacías</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {activeTab === 'BUS' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tracker de Buses en Tiempo Real</h2>
            {mockBuses.map(bus => (
              <div key={bus.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{bus.name}</span>
                    {bus.status === 'Delayed' && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Retrasado</span>}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    {bus.origin} <span className="text-slate-300">→</span> {bus.destination}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">{bus.nextDeparture}</div>
                  <div className="text-xs text-slate-400">Próxima salida</div>
                </div>
              </div>
            ))}
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
               <p className="text-sm text-blue-800 flex items-center gap-2">
                 <Clock className="w-4 h-4" /> Los horarios se actualizan automáticamente según GPS.
               </p>
             </div>
          </div>
        )}

        {activeTab === 'FOOD' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4">Estado del Casino Central</h3>
               <div className="flex items-center gap-4 mb-6">
                 <div className="flex-1 bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                    <div className="text-2xl font-bold text-green-600">5 min</div>
                    <div className="text-xs text-green-800 uppercase font-bold">Tiempo Espera</div>
                 </div>
                 <div className="flex-1 bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
                    <div className="text-2xl font-bold text-yellow-600">Media</div>
                    <div className="text-xs text-yellow-800 uppercase font-bold">Ocupación</div>
                 </div>
               </div>

               <h4 className="font-semibold text-slate-700 mb-3 border-b pb-2">Menú del Día</h4>
               <ul className="space-y-3">
                 <li className="flex justify-between items-start">
                   <span className="text-slate-600">Plato Fondo</span>
                   <span className="font-medium text-slate-900 text-right">Lomo Saltado con Arroz</span>
                 </li>
                 <li className="flex justify-between items-start">
                   <span className="text-slate-600">Opción Veggie</span>
                   <span className="font-medium text-slate-900 text-right">Tortilla de Acelga con Puré</span>
                 </li>
                 <li className="flex justify-between items-start">
                   <span className="text-slate-600">Hipocalórico</span>
                   <span className="font-medium text-slate-900 text-right">Pollo a la plancha c/ Ensalada</span>
                 </li>
               </ul>
            </div>
          </div>
        )}

        {activeTab === 'ROOMS' && (
          <div className="max-w-2xl mx-auto">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h3 className="font-bold text-slate-800 mb-2">Buscador de Silencio</h3>
                <p className="text-sm text-slate-500 mb-4">Encuentra espacios vacíos para estudiar ahora.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">R1</div>
                      <div>
                        <div className="font-bold text-slate-800">Sala 204</div>
                        <div className="text-xs text-slate-500">Disponible hasta las 15:30</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3" /> VACÍA
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-yellow-600 font-bold">C3</div>
                      <div>
                        <div className="font-bold text-slate-800">Biblioteca Z3</div>
                        <div className="text-xs text-slate-500">Zona Silencio</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3" /> MEDIO
                    </span>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campus;