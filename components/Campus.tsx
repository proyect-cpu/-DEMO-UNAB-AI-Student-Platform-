
import React, { useState, useEffect } from 'react';
import { Bus, Utensils, MapPin, Clock, Users, ArrowRight, Ticket, Coffee, Info, CheckCircle, Sun, Cloud, Droplets, ChevronDown, Building2, RefreshCw, Volume1, Volume2, Wifi, Zap } from 'lucide-react';
import { BusRoute, ThemeColor } from '../types';

interface CampusProps {
  primaryColor: ThemeColor;
}

const UNAB_CAMPUSES = [
    { id: 'casona', name: 'Casona de Las Condes', temp: '24°C', occupancy: 'Alta' },
    { id: 'republica', name: 'República', temp: '26°C', occupancy: 'Media' },
    { id: 'antoniovaras', name: 'Antonio Varas', temp: '25°C', occupancy: 'Baja' },
    { id: 'bellavista', name: 'Bellavista', temp: '26°C', occupancy: 'Alta' },
    { id: 'vina', name: 'Viña del Mar', temp: '19°C', occupancy: 'Media' },
    { id: 'concepcion', name: 'Concepción', temp: '16°C', occupancy: 'Baja' },
];

// DATA MOCKS POR CAMPUS
const CAMPUS_DATA: any = {
  casona: {
    buses: [
      { id: 'c1', name: 'Casona -> República', origin: 'Patio Central', destination: 'República', nextDeparture: '14:00', status: 'OnTime' },
      { id: 'c2', name: 'Casona -> Metro Los Dominicos', origin: 'Acceso C', destination: 'Metro', nextDeparture: '14:15', status: 'Delayed' },
    ],
    menu: {
      name: 'Casino Casona',
      wait: '15 min',
      junaeb: 'Pollo Arvejado con Arroz',
      veg: 'Tortilla de Acelga'
    }
  },
  republica: {
    buses: [
      { id: 'r1', name: 'República -> Casona', origin: 'República 239', destination: 'Casona', nextDeparture: '14:10', status: 'OnTime' },
      { id: 'r2', name: 'República -> Antonio Varas', origin: 'Echaurren', destination: 'A. Varas', nextDeparture: '14:20', status: 'OnTime' },
    ],
    menu: {
      name: 'Casino República',
      wait: '30 min',
      junaeb: 'Lentejas con Longaniza',
      veg: 'Lentejas Guisadas'
    }
  },
  vina: {
    buses: [
      { id: 'v1', name: 'V1 -> Valparaíso', origin: 'Acceso Principal', destination: 'Puerto', nextDeparture: '14:30', status: 'OnTime' },
    ],
    menu: {
      name: 'Casino V. del Mar',
      wait: '5 min',
      junaeb: 'Pescado Frito con Puré',
      veg: 'Budín de Zapallo Italiano'
    }
  }
};

// Fallback para campus sin datos específicos
const FALLBACK_DATA = {
    buses: [{ id: 'xx', name: 'Acercamiento Metro', origin: 'Campus', destination: 'Metro', nextDeparture: '14:00', status: 'OnTime' }],
    menu: { name: 'Casino Central', wait: '10 min', junaeb: 'Charquicán', veg: 'Huevo con Arroz' }
};

const Campus: React.FC<CampusProps> = ({ primaryColor }) => {
  const [activeTab, setActiveTab] = useState<'BUS' | 'FOOD' | 'ROOMS'>('BUS');
  const [reservedRoom, setReservedRoom] = useState<string | null>(null);
  
  const [selectedCampus, setSelectedCampus] = useState(UNAB_CAMPUSES[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Estados para Salas en Tiempo Real
  const [liveRooms, setLiveRooms] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Obtener datos del campus seleccionado o usar fallback
  const currentData = CAMPUS_DATA[selectedCampus.id] || FALLBACK_DATA;

  // Resetear reserva al cambiar de campus
  useEffect(() => {
    setReservedRoom(null);
  }, [selectedCampus.id]);

  // Simular Búsqueda en Tiempo Real al entrar a ROOMS
  useEffect(() => {
    if (activeTab === 'ROOMS') {
        scanRooms();
    }
  }, [activeTab, selectedCampus]);

  const scanRooms = () => {
    setIsScanning(true);
    setLiveRooms([]); // Clear previous
    
    // Simulate network delay
    setTimeout(() => {
        const newRooms = generateRandomRooms(selectedCampus.id);
        setLiveRooms(newRooms);
        setIsScanning(false);
    }, 1200);
  };

  const generateRandomRooms = (campusId: string) => {
     const roomPrefix = campusId.substring(0, 1).toUpperCase();
     const types = ['Aula', 'Lab', 'Estudio', 'Biblioteca'];
     const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 rooms
     
     return Array.from({ length: count }).map((_, i) => {
         const isAvailable = Math.random() > 0.3; // 70% chance available
         const type = types[Math.floor(Math.random() * types.length)];
         
         // Calculate times
         const now = new Date();
         const minutesUntilChange = 30 + Math.floor(Math.random() * 90);
         const changeTime = new Date(now.getTime() + minutesUntilChange * 60000);
         const timeString = changeTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

         return {
             id: `${roomPrefix}-${100 + i * 10 + Math.floor(Math.random() * 9)}`,
             name: `${type} ${roomPrefix}-${100 + i * 10}`,
             type,
             status: isAvailable ? 'AVAILABLE' : 'OCCUPIED',
             time: timeString,
             noise: Math.random() > 0.6 ? 'Alto' : 'Bajo',
             wifi: Math.random() > 0.1,
             occupancy: Math.floor(Math.random() * 100)
         };
     });
  };

  const getTabClass = (isActive: boolean) => {
    if (!isActive) return 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50';
    
    switch(primaryColor) {
        case 'blue': return 'border-blue-600 text-blue-600 bg-blue-50';
        case 'emerald': return 'border-emerald-500 text-emerald-500 bg-emerald-50';
        case 'purple': return 'border-purple-500 text-purple-500 bg-purple-50';
        case 'slate': return 'border-slate-800 text-slate-800 bg-slate-100';
        case 'red': default: return 'border-red-600 text-red-600 bg-red-50';
    }
  };

  const handleReserve = (roomId: string) => {
    setReservedRoom(roomId);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* Live Campus Status Header with Selector */}
      <div className="bg-white px-4 md:px-8 py-6 border-b border-slate-200 flex flex-col gap-4 relative z-20 shadow-sm">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Campus Live</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-green-600 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> En Vivo
                     </span>
                     <span className="text-slate-400 text-xs">•</span>
                     <span className="text-slate-500 text-xs font-medium">Actualizado hace 1 min</span>
                  </div>
              </div>

              {/* CAMPUS SELECTOR */}
              <div className="relative w-full md:w-auto">
                  <button 
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className="w-full md:w-64 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl flex items-center justify-between transition-all shadow-sm active:scale-95 group"
                  >
                      <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`p-1.5 rounded-lg text-white ${primaryColor === 'slate' ? 'bg-slate-800' : 'bg-red-700'}`}>
                              <Building2 className="w-4 h-4" />
                          </div>
                          <div className="text-left truncate">
                              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sede Actual</span>
                              <span className="block font-bold text-sm truncate">{selectedCampus.name}</span>
                          </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isSelectorOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsSelectorOpen(false)}></div>
                        <div className="absolute top-full right-0 mt-2 w-full md:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2">
                                Selecciona tu Campus
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {UNAB_CAMPUSES.map((campus) => (
                                    <button
                                        key={campus.id}
                                        onClick={() => {
                                            setSelectedCampus(campus);
                                            setIsSelectorOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${selectedCampus.id === campus.id ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {campus.name}
                                        {selectedCampus.id === campus.id && <CheckCircle className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                      </>
                  )}
              </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <div className="bg-orange-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-100 shrink-0">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <div>
                      <div className="text-[10px] text-orange-400 font-bold uppercase">Clima</div>
                      <span className="text-sm font-black text-orange-700">{selectedCampus.temp}</span>
                  </div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-blue-100 shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                      <div className="text-[10px] text-blue-400 font-bold uppercase">Ocupación</div>
                      <span className="text-sm font-black text-blue-700">{selectedCampus.occupancy}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm sticky top-0 z-10 px-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('BUS')}
          className={`flex-1 min-w-[120px] py-4 text-xs md:text-sm font-bold border-b-2 flex justify-center items-center gap-2 transition-all ${getTabClass(activeTab === 'BUS')}`}
        >
          <Bus className="w-4 h-4" /> Transporte
        </button>
        <button
          onClick={() => setActiveTab('FOOD')}
          className={`flex-1 min-w-[120px] py-4 text-xs md:text-sm font-bold border-b-2 flex justify-center items-center gap-2 transition-all ${getTabClass(activeTab === 'FOOD')}`}
        >
          <Utensils className="w-4 h-4" /> Casino
        </button>
        <button
          onClick={() => setActiveTab('ROOMS')}
          className={`flex-1 min-w-[120px] py-4 text-xs md:text-sm font-bold border-b-2 flex justify-center items-center gap-2 transition-all ${getTabClass(activeTab === 'ROOMS')}`}
        >
          <MapPin className="w-4 h-4" /> Espacios
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
        {activeTab === 'BUS' && (
          <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg font-bold text-slate-800">Salidas desde {selectedCampus.name}</h2>
            </div>
            
            {currentData.buses.map((bus: any) => (
              <div key={bus.id} className="relative group filter drop-shadow-sm transition-transform hover:scale-[1.01] active:scale-95">
                {/* Visual Ticket Effect */}
                <div className="bg-white p-0 rounded-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 mask-ticket">
                    {/* Left Stub */}
                    <div className="bg-slate-900 p-4 md:w-32 flex flex-row md:flex-col items-center justify-between md:justify-center text-white text-center relative border-b md:border-b-0 md:border-r-2 border-dashed border-slate-700 gap-4">
                        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                        
                        <div className="flex items-center gap-2 md:flex-col">
                            <Bus className="w-6 h-6 md:w-8 md:h-8 opacity-80" />
                            <div className="text-left md:text-center">
                                <span className="block text-xl md:text-2xl font-black tracking-tight">{bus.nextDeparture}</span>
                                <span className="block text-[10px] uppercase font-bold opacity-60">Salida</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Details */}
                    <div className="flex-1 p-5 flex flex-col justify-center relative">
                         <div className="flex justify-between items-start mb-3">
                            <div className="min-w-0">
                               <h3 className="font-bold text-slate-800 text-lg truncate">{bus.name}</h3>
                               <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 flex-wrap">
                                  <span className="font-medium truncate max-w-[80px] md:max-w-none">{bus.origin}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                                  <span className="font-medium truncate max-w-[80px] md:max-w-none">{bus.destination}</span>
                               </div>
                            </div>
                            <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase border ${bus.status === 'Delayed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                               {bus.status === 'Delayed' ? 'Retrasado' : 'A Tiempo'}
                            </div>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-slate-800 w-1/3 rounded-full"></div>
                         </div>
                         <p className="text-[10px] text-slate-400 mt-2 text-right">Llegada estimada: 25 min</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'FOOD' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white relative">
                   <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                       <Utensils className="w-40 h-40" />
                   </div>
                   <h3 className="font-bold text-2xl mb-1">{currentData.menu.name}</h3>
                   <p className="text-white/80 text-sm font-medium">Menú del día • Estado de filas</p>
               </div>
               
               <div className="p-6 grid grid-cols-2 gap-4">
                   <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center justify-center text-center">
                       <Clock className="w-6 h-6 text-green-600 mb-2" />
                       <div className="text-2xl font-black text-green-700 leading-none mb-1">{currentData.menu.wait}</div>
                       <div className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Tiempo de Espera</div>
                   </div>
                   <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 flex flex-col items-center justify-center text-center">
                       <Users className="w-6 h-6 text-yellow-600 mb-2" />
                       <div className="text-2xl font-black text-yellow-700 leading-none mb-1">{selectedCampus.occupancy}</div>
                       <div className="text-[10px] font-bold text-yellow-800 uppercase tracking-wide">Ocupación Mesas</div>
                   </div>
               </div>

               <div className="px-6 pb-6 space-y-3">
                   <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-2">Menú Junaeb ($2.800)</h4>
                   <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                       <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🍗</div>
                       <div>
                           <div className="font-bold text-slate-800">{currentData.menu.junaeb}</div>
                           <div className="text-xs text-slate-500">Con arroz o puré + Ensalada + Jugo</div>
                       </div>
                   </div>
                   <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🥗</div>
                       <div>
                           <div className="font-bold text-slate-800">{currentData.menu.veg} (Veg)</div>
                           <div className="text-xs text-slate-500">Con ensalada surtida + Fruta</div>
                       </div>
                   </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'ROOMS' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           <MapPin className="w-5 h-5 text-indigo-600" /> Buscador de Espacios
                        </h3>
                        <p className="text-sm text-slate-500">Estado en tiempo real de {selectedCampus.name}.</p>
                    </div>
                    <button 
                        onClick={scanRooms} 
                        disabled={isScanning}
                        className="p-2 bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                {isScanning ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <h4 className="font-bold text-slate-700">Escaneando Salas...</h4>
                        <p className="text-xs text-slate-400">Verificando sensores de ocupación IoT</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                    {liveRooms.map((room: any) => (
                        <div 
                            key={room.id}
                            onClick={() => room.status === 'AVAILABLE' && handleReserve(room.id)}
                            className={`relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded-xl transition-all group ${
                                reservedRoom === room.id 
                                    ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
                                    : room.status === 'OCCUPIED' 
                                        ? 'border-slate-100 bg-slate-50 opacity-90' 
                                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer'
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-3 md:mb-0">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                                    reservedRoom === room.id 
                                     ? 'bg-green-600 text-white'
                                     : room.status === 'OCCUPIED'
                                        ? 'bg-slate-200 text-slate-500'
                                        : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {room.id.split('-')[1]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-base">{room.name}</div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                                        <span className="flex items-center gap-1">
                                            {room.noise === 'Bajo' ? <Volume1 className="w-3 h-3 text-green-500" /> : <Volume2 className="w-3 h-3 text-orange-500" />}
                                            Ruido: {room.noise}
                                        </span>
                                        {room.wifi && (
                                            <span className="flex items-center gap-1">
                                                <Wifi className="w-3 h-3 text-blue-500" /> WiFi
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                                <div className="text-right">
                                    {room.status === 'AVAILABLE' ? (
                                        <>
                                            <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Disponible hasta</div>
                                            <div className="font-mono font-bold text-slate-800 text-sm bg-green-100/50 px-2 rounded">{room.time}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ocupada hasta</div>
                                            <div className="font-mono font-bold text-slate-500 text-sm bg-slate-200/50 px-2 rounded">{room.time}</div>
                                        </>
                                    )}
                                </div>
                                
                                {reservedRoom === room.id ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded-full shadow-sm">
                                        <CheckCircle className="w-3.5 h-3.5" /> TUYA
                                    </span>
                                ) : room.status === 'AVAILABLE' ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> LIBRE
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-full border border-slate-300">
                                        OCUPADA
                                    </span>
                                )}
                            </div>
                            
                            {/* Occupancy Bar for visual flair */}
                            {room.status === 'AVAILABLE' && (
                                <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all" style={{ width: `${100 - room.occupancy}%` }}></div>
                            )}
                        </div>
                    ))}
                    </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campus;
