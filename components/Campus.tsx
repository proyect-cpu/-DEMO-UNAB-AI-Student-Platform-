
import React, { useState, useEffect } from 'react';
import { Bus, Utensils, MapPin, Clock, Users, ArrowRight, Ticket, Coffee, Info, CheckCircle, Sun, Cloud, Droplets, ChevronDown, Building2, RefreshCw, Volume1, Volume2, Wifi, Zap, Box, Lock, MousePointer2, Car, Train, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Navigation, Siren, Phone, ExternalLink, Map } from 'lucide-react';
import { BusRoute, ThemeColor } from '../types';

interface CampusProps {
  primaryColor: ThemeColor;
}

const UNAB_CAMPUSES = [
    { id: 'casona', name: 'Casona', temp: '24°C', occupancy: 'Alta', type: 'BUS_HEAVY' },
    { id: 'republica', name: 'República', temp: '26°C', occupancy: 'Media', type: 'URBAN' },
    { id: 'antoniovaras', name: 'A. Varas', temp: '25°C', occupancy: 'Baja', type: 'URBAN' },
    { id: 'bellavista', name: 'Bellavista', temp: '26°C', occupancy: 'Alta', type: 'URBAN' },
    { id: 'vina', name: 'Viña', temp: '19°C', occupancy: 'Media', type: 'INTER_SITE' },
    { id: 'concepcion', name: 'Conce', temp: '16°C', occupancy: 'Baja', type: 'PUBLIC' },
];

// Rich Data Structure based on User Feedback
const CAMPUS_DATA: any = {
  casona: {
    transportType: 'BUS_HEAVY',
    officialBuses: [
      { id: 'c1', name: 'Bus Casona -> Metro Los Domínicos', origin: 'Estacionamiento Ed. C', destination: 'Metro L. Domínicos', schedules: ['13:10', '14:10', '15:00', '15:50', '16:50', '17:40', '18:40', '20:35'], status: 'CONFIRMADO' },
    ],
    publicOptions: [
        { name: 'Red C02 / C02c', detail: 'Paradero Camino Las Flores', freq: '8 min', price: '$800' }
    ],
    carOptions: [
        { name: 'Uber / Didi', detail: '3 autos cerca', time: '15 min', price: '~$5.500' }
    ]
  },
  vina: {
    transportType: 'INTER_SITE',
    officialBuses: [
      { id: 'v1', name: 'Inter-Sedes: Viña <-> Reñaca', origin: 'Calle Quillota', destination: 'Sede Reñaca (V6)', schedules: ['08:00', '09:30', '13:30', '19:00'], status: 'SERVICIO ACTIVO' }
    ],
    publicOptions: [],
    carOptions: []
  },
  concepcion: {
    transportType: 'PUBLIC',
    officialBuses: [],
    publicOptions: [
        { name: 'Biobus (B02)', detail: 'Conexión Biotrén (Est. El Arenal)', freq: 'Sincronizado', price: '$600' },
        { name: 'Línea 10 (Vía Láctea)', detail: 'Directo al Centro', freq: '5 min', price: '$550' },
        { name: 'Línea 20 (N. Llacolén)', detail: 'Hacia San Pedro', freq: '12 min', price: '$550' }
    ],
    carOptions: []
  },
  republica: { transportType: 'URBAN', metroStation: 'República (L1)', walkTime: '3 min', riskZone: true },
  bellavista: { transportType: 'URBAN', metroStation: 'Baquedano (L1/L5)', walkTime: '5 min', riskZone: true },
  antoniovaras: { transportType: 'URBAN', metroStation: 'Manuel Montt (L1)', walkTime: '10 min', riskZone: false },
};

const FALLBACK_DATA = { transportType: 'URBAN', metroStation: 'Cercano', walkTime: '5 min' };

// Generar horarios cada 2 horas desde las 8:00 hasta las 18:00
const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

// Tipos para los Boxes
interface BoxSlot {
    time: string;
    status: 'FREE' | 'BUSY' | 'YOURS';
}

interface StudyBox {
    id: string;
    name: string;
    capacity: number;
    features: string[];
    slots: BoxSlot[];
}

const INITIAL_BOXES: StudyBox[] = [
    { 
        id: 'box-1', name: 'Box Alpha', capacity: 4, features: ['TV', 'Pizarra'],
        slots: TIME_SLOTS.map(t => ({ time: t, status: Math.random() > 0.7 ? 'BUSY' : 'FREE' })) 
    },
    { 
        id: 'box-2', name: 'Box Beta', capacity: 6, features: ['Proyector'],
        slots: TIME_SLOTS.map(t => ({ time: t, status: Math.random() > 0.6 ? 'BUSY' : 'FREE' })) 
    },
    { 
        id: 'box-3', name: 'Box Gamma', capacity: 2, features: ['Silencio'],
        slots: TIME_SLOTS.map(t => ({ time: t, status: Math.random() > 0.4 ? 'BUSY' : 'FREE' })) 
    },
];

const Campus: React.FC<CampusProps> = ({ primaryColor }) => {
  const [activeTab, setActiveTab] = useState<'BUS' | 'FOOD' | 'BOXES'>('BUS');
  const [selectedCampus, setSelectedCampus] = useState(UNAB_CAMPUSES[0]);
  
  // State for Boxes
  const [boxes, setBoxes] = useState<StudyBox[]>(INITIAL_BOXES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for Transport
  const [transportMode, setTransportMode] = useState<'ROUTES' | 'CARPOOL'>('ROUTES');
  const [reports, setReports] = useState<{fluid: number, full: number}>({ fluid: 12, full: 3 });
  const [userReported, setUserReported] = useState(false);

  const currentData = CAMPUS_DATA[selectedCampus.id] || FALLBACK_DATA;

  // --- LOGIC HELPERS ---
  const getNextBusTime = (schedules: string[]) => {
      // Logic placeholder: returns random next time for demo
      return { time: schedules[1] || '14:10', minutes: 14 };
  };

  const handleReport = (type: 'FLUID' | 'FULL') => {
      if(userReported) return;
      if(type === 'FLUID') setReports(p => ({...p, fluid: p.fluid + 1}));
      else setReports(p => ({...p, full: p.full + 1}));
      setUserReported(true);
  };

  const handleRefreshBoxes = () => {
    setIsRefreshing(true);
    setTimeout(() => {
        const refreshedBoxes = boxes.map(box => ({
            ...box,
            slots: box.slots.map(slot => {
                if (slot.status === 'YOURS') return slot;
                return { ...slot, status: Math.random() > 0.6 ? 'BUSY' : 'FREE' };
            })
        }));
        setBoxes(refreshedBoxes);
        setIsRefreshing(false);
    }, 1200);
  };

  const handleToggleSlot = (boxId: string, time: string) => {
      setBoxes(prev => prev.map(box => {
          if (box.id !== boxId) return box;
          return {
              ...box,
              slots: box.slots.map(slot => {
                  if (slot.time !== time) return slot;
                  if (slot.status === 'BUSY') return slot;
                  return { ...slot, status: slot.status === 'FREE' ? 'YOURS' : 'FREE' };
              })
          }
      }));
  };

  const getThemeText = () => {
    switch (primaryColor) {
      case 'blue': return 'text-blue-600';
      case 'emerald': return 'text-emerald-600';
      case 'purple': return 'text-purple-600';
      case 'slate': return 'text-slate-800';
      case 'red': default: return 'text-red-600';
    }
  };

  // --- RENDER TRANSPORT CONTENT BASED ON TYPE ---
  const renderTransportContent = () => {
      const type = currentData.transportType;

      // 1. CASONA (BUS HEAVY)
      if (type === 'BUS_HEAVY') {
          return (
              <div className="space-y-6 animate-in fade-in">
                  {/* COMPARISON WIDGET */}
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {/* Option A: Official */}
                      <div className="bg-slate-900 text-white p-3 rounded-xl min-w-[140px] flex flex-col justify-between shadow-lg relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                          <div className="flex justify-between items-start">
                              <Bus className="w-5 h-5 text-blue-300" />
                              <span className="text-[10px] font-bold bg-green-500 px-1.5 rounded text-white">GRATIS</span>
                          </div>
                          <div>
                              <div className="text-xs text-slate-300">Bus UNAB</div>
                              <div className="font-bold text-lg leading-tight">14 min</div>
                              <div className="text-[10px] text-slate-400">Próxima salida</div>
                          </div>
                      </div>
                      
                      {/* Option B: Public */}
                      <div className="bg-white border border-slate-200 p-3 rounded-xl min-w-[140px] flex flex-col justify-between">
                           <div className="flex justify-between items-start">
                              <Bus className="w-5 h-5 text-red-500" />
                              <span className="text-[10px] font-bold text-slate-500">$800</span>
                          </div>
                          <div>
                              <div className="text-xs text-slate-400">Red C02/C02c</div>
                              <div className="font-bold text-lg text-slate-800 leading-tight">8 min</div>
                              <div className="text-[10px] text-slate-400">Frecuencia</div>
                          </div>
                      </div>

                      {/* Option C: Car */}
                      <div className="bg-white border border-slate-200 p-3 rounded-xl min-w-[140px] flex flex-col justify-between">
                           <div className="flex justify-between items-start">
                              <Car className="w-5 h-5 text-slate-800" />
                              <span className="text-[10px] font-bold text-slate-500">~$5.500</span>
                          </div>
                          <div>
                              <div className="text-xs text-slate-400">Uber / Didi</div>
                              <div className="font-bold text-lg text-slate-800 leading-tight">3 min</div>
                              <div className="text-[10px] text-slate-400">Espera est.</div>
                          </div>
                      </div>
                  </div>

                  {/* BOARDING PASS CARDS */}
                  {currentData.officialBuses.map((bus: any) => {
                      const { time, minutes } = getNextBusTime(bus.schedules);
                      return (
                        <div key={bus.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                             {/* Cutout effect visual */}
                             <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200 z-10"></div>
                             <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200 z-10"></div>
                             
                             <div className="p-5 border-b border-dashed border-slate-200 flex justify-between items-center relative">
                                 <div className="flex items-center gap-3">
                                     <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                         <Bus className="w-6 h-6" />
                                     </div>
                                     <div>
                                         <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Salida Confirmada</div>
                                         <div className="text-2xl font-black text-slate-800">{time} <span className="text-sm font-medium text-slate-400">hrs</span></div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase mb-1 inline-block">
                                         {bus.status}
                                     </div>
                                     <div className="text-xs font-bold text-slate-500 animate-pulse">Sale en {minutes} min</div>
                                 </div>
                             </div>
                             
                             <div className="p-5 bg-slate-50/50 flex flex-col gap-4">
                                 <div className="flex items-center justify-between text-sm">
                                     <span className="font-bold text-slate-700">{bus.origin}</span>
                                     <div className="flex-1 border-b border-dotted border-slate-300 mx-3 relative top-[-4px]"></div>
                                     <span className="font-bold text-slate-700">{bus.destination}</span>
                                 </div>

                                 {/* WAZE REPORTING */}
                                 <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                                     <div className="text-xs">
                                         <span className="block font-bold text-slate-700">Estado de la fila:</span>
                                         <span className="text-slate-400">Reportado por alumnos</span>
                                     </div>
                                     <div className="flex gap-2">
                                         <button onClick={() => handleReport('FLUID')} className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${userReported ? 'opacity-50' : 'hover:bg-green-50 text-green-600 border border-green-100'}`}>
                                             <ThumbsUp className="w-3 h-3" /> {reports.fluid}
                                         </button>
                                         <button onClick={() => handleReport('FULL')} className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${userReported ? 'opacity-50' : 'hover:bg-red-50 text-red-600 border border-red-100'}`}>
                                             <ThumbsDown className="w-3 h-3" /> {reports.full}
                                         </button>
                                     </div>
                                 </div>
                             </div>
                        </div>
                      )
                  })}
                  
                  {/* MAP CASONA (CSS ONLY) */}
                  <div className="relative h-44 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 group shadow-inner">
                      {/* Simulated Map Design - Campus Area */}
                      <div className="absolute inset-0 bg-[#e5e7eb]"></div>
                      {/* Edificio C (Abstract) */}
                      <div className="absolute top-8 left-1/4 w-32 h-24 bg-blue-100/50 skew-x-12 rounded-lg border-2 border-blue-200 flex items-center justify-center">
                          <span className="text-[10px] font-black text-blue-300 -skew-x-12 opacity-50">EDIFICIO C</span>
                      </div>
                      {/* Parking Area (Abstract) */}
                      <div className="absolute top-16 left-1/3 w-48 h-20 bg-slate-300/50 -skew-x-12 rounded-lg border-2 border-slate-400/30"></div>
                      
                      {/* Meeting Point Marker */}
                      <div className="absolute top-20 left-1/2 -translate-x-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce shadow-lg z-10"></div>
                      
                      {/* Floating Card */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm z-20 flex justify-between items-center">
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Punto de Encuentro</div>
                            <div className="text-[10px] text-slate-500 font-medium">Estacionamientos Edificio C</div>
                          </div>
                          <div className="bg-slate-100 p-1.5 rounded-lg">
                              <Bus className="w-4 h-4 text-slate-600" />
                          </div>
                      </div>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-1 flex items-center justify-center gap-1 font-medium bg-slate-100 py-1 rounded-full">
                       <Clock className="w-3 h-3" /> El bus sale puntual. Llega 5 min antes.
                  </p>
              </div>
          );
      }

      // 2. URBAN (METRO & WALKING & SECURITY)
      if (type === 'URBAN') {
          return (
              <div className="space-y-6 animate-in fade-in">
                  <div className="bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                      <div className="relative z-10">
                          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                              <Navigation className="w-5 h-5 text-yellow-400" /> Ruta Segura
                          </h3>
                          <p className="text-slate-300 text-sm mb-4">
                              El camino recomendado hacia <span className="font-bold text-white">{currentData.metroStation}</span>.
                          </p>
                          <div className="flex items-center gap-4">
                              <div>
                                  <div className="text-2xl font-bold">{currentData.walkTime}</div>
                                  <div className="text-[10px] uppercase font-bold text-slate-400">Caminata</div>
                              </div>
                              <div className="h-8 w-px bg-slate-600"></div>
                              <div>
                                  <div className="text-2xl font-bold flex items-center gap-1 text-green-400">
                                      <ShieldCheck className="w-5 h-5" /> OK
                                  </div>
                                  <div className="text-[10px] uppercase font-bold text-slate-400">Zona Monitoreada</div>
                              </div>
                          </div>
                      </div>
                      <div className="absolute right-0 bottom-0 w-32 h-32 bg-yellow-500 rounded-full blur-[60px] opacity-10"></div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Train className="w-4 h-4 text-red-600" /> Estado del Metro</h4>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-bold text-slate-700">Línea 1</span>
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Operativa</span>
                          </div>
                          {currentData.riskZone && (
                              <div className="flex gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-orange-700 font-medium">Se recomienda caminar en grupos hacia el metro después de las 19:00 hrs.</p>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* SOS BUTTON CARD */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-red-100 rounded-xl text-red-600 shadow-sm animate-pulse">
                              <Siren className="w-6 h-6" />
                          </div>
                          <div>
                              <h4 className="font-black text-red-800 text-sm">SOS Seguridad Campus</h4>
                              <p className="text-xs text-red-700 font-medium">¿Emergencia en trayecto?</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => window.open('tel:+56226618000')}
                        className="bg-red-600 text-white p-3 rounded-xl shadow-md active:scale-95 transition-all hover:bg-red-700 flex items-center gap-2"
                      >
                          <Phone className="w-4 h-4 fill-current" /> 
                          <span className="text-xs font-bold">Llamar</span>
                      </button>
                  </div>
              </div>
          );
      }

      // 3. CONCEPCION (PUBLIC) & VINA (INTER-SITE)
      return (
          <div className="space-y-4 animate-in fade-in">
              {type === 'INTER_SITE' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                      <div>
                          <h4 className="font-bold text-yellow-800 text-sm">Servicio Exclusivo Inter-Sedes</h4>
                          <p className="text-xs text-yellow-700 mt-1">Solo para traslado académico Viña ↔ Reñaca. Requiere credencial.</p>
                      </div>
                  </div>
              )}
              
              {currentData.officialBuses?.map((bus: any) => (
                  <div key={bus.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                           <Bus className="w-5 h-5 text-purple-600" />
                           <span className="font-bold text-slate-800 text-sm">{bus.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                          {bus.schedules.map((t: string) => (
                              <span key={t} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{t}</span>
                          ))}
                      </div>
                  </div>
              ))}

              {currentData.publicOptions?.length > 0 && (
                  <>
                    <h3 className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2 pl-2">Transporte Público</h3>
                    {currentData.publicOptions.map((opt: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Bus className="w-4 h-4" /></div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{opt.name}</div>
                                    <div className="text-[10px] text-slate-500">{opt.detail}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-slate-800">{opt.freq}</div>
                                <div className="text-[10px] text-slate-400">Frecuencia</div>
                            </div>
                        </div>
                    ))}
                    {selectedCampus.id === 'concepcion' && (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center mt-2">
                             <div className="flex items-center gap-2">
                                 <Train className="w-4 h-4 text-orange-600" />
                                 <div className="flex flex-col">
                                     <span className="text-sm font-bold text-orange-800">Estado Biotrén</span>
                                     <span className="text-[9px] text-orange-700">Red EFE Sur</span>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-green-600 bg-white px-2 py-0.5 rounded border border-green-200">Operativo</span>
                                <button className="p-1.5 bg-orange-200/50 rounded-lg text-orange-700 hover:bg-orange-200"><Map className="w-4 h-4" /></button>
                             </div>
                        </div>
                    )}
                  </>
              )}
          </div>
      );
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* CAMPUS SELECTOR */}
      <div className="bg-white pt-4 pb-2 shadow-sm z-20 sticky top-0">
          <div className="px-4 mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <MapPin className={`w-6 h-6 ${getThemeText()}`} /> Campus Live
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{selectedCampus.temp}</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-2">
              {UNAB_CAMPUSES.map(campus => (
                  <button
                    key={campus.id}
                    onClick={() => setSelectedCampus(campus)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                        selectedCampus.id === campus.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                      {campus.name}
                  </button>
              ))}
          </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm border-b border-slate-100">
         <button onClick={() => setActiveTab('BUS')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'BUS' ? `border-blue-500 text-blue-600 bg-blue-50` : 'border-transparent text-slate-400'}`}>
            <Bus className="w-4 h-4" /> Transporte
         </button>
         <button onClick={() => setActiveTab('FOOD')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'FOOD' ? `border-orange-500 text-orange-600 bg-orange-50` : 'border-transparent text-slate-400'}`}>
            <Utensils className="w-4 h-4" /> Casino
         </button>
         <button onClick={() => setActiveTab('BOXES')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'BOXES' ? `border-purple-500 text-purple-600 bg-purple-50` : 'border-transparent text-slate-400'}`}>
            <Box className="w-4 h-4" /> Boxes
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          
          {activeTab === 'BUS' && (
              <div className="flex flex-col h-full">
                  {/* Dynamic Header based on time */}
                  <div className="mb-4">
                      <h2 className="text-xl font-bold text-slate-800">
                          {new Date().getHours() < 12 ? 'Vamos a la U' : 'Regreso a Casa'}
                      </h2>
                      <p className="text-xs text-slate-500">La ruta más eficiente ahora.</p>
                  </div>
                  
                  {/* Sub-Tabs for Transport */}
                  <div className="flex p-1 bg-slate-200 rounded-xl mb-4">
                      <button onClick={() => setTransportMode('ROUTES')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${transportMode === 'ROUTES' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Rutas</button>
                      <button onClick={() => setTransportMode('CARPOOL')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${transportMode === 'CARPOOL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Carpool</button>
                  </div>

                  {transportMode === 'ROUTES' ? (
                      <>
                        {renderTransportContent()}
                        <div className="mt-8 text-center pt-6 border-t border-slate-200">
                            <p className="text-[10px] text-slate-400 leading-tight max-w-xs mx-auto">
                                Información de transporte público provista por terceros (Red/EFE). Los horarios de buses institucionales son referenciales y pueden variar por contingencia o tráfico. App versión Beta 1.0
                            </p>
                        </div>
                      </>
                  ) : (
                      // CARPOOL / ALLRIDE INTEGRATION REFINED
                      <div className="animate-in slide-in-from-right-4 space-y-4">
                          {/* Banner Partnership */}
                          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                               <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                               <div className="relative z-10 text-center">
                                   <div className="flex items-center justify-center gap-2 mb-2">
                                       <span className="font-bold text-lg tracking-tight">AllRide</span>
                                       <span className="text-white/50 text-xs">x</span>
                                       <span className="font-bold text-lg tracking-tight">UNAB</span>
                                   </div>
                                   <h3 className="text-2xl font-black mb-2">Comparte tu viaje</h3>
                                   <p className="text-blue-200 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
                                       Únete a la comunidad verificada. Solo estudiantes y colaboradores con correo @uandresbello.edu.
                                   </p>
                                   <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-50 transition-colors w-full flex items-center justify-center gap-2">
                                       <Car className="w-4 h-4" /> Vincular Cuenta AllRide
                                   </button>
                               </div>
                          </div>
                          
                          <div className="flex items-center gap-2 px-2">
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-bold text-slate-500 uppercase">Rutas Verificadas Hoy</span>
                          </div>

                          {[1, 2].map((i) => (
                              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-indigo-200 transition-colors cursor-pointer">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                                        {i === 1 ? 'JS' : 'MA'}
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                              {i === 1 ? 'Juan Soto' : 'Maria Araneda'} 
                                              <span className="bg-blue-100 text-blue-600 text-[9px] px-1 rounded-sm"><ShieldCheck className="w-2 h-2 inline" /></span>
                                          </div>
                                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                              <MapPin className="w-3 h-3" /> Hacia Metro Escuela Militar
                                          </div>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="font-bold text-slate-800">18:15</div>
                                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">2 cupos</span>
                                  </div>
                              </div>
                          ))}
                          
                          <div className="text-center pt-4">
                              <button className="text-xs text-indigo-600 font-bold hover:underline">Ver todas las rutas disponibles</button>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'FOOD' && (
              <div className="space-y-4 animate-in fade-in">
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <div className="h-28 bg-orange-100 relative">
                          <div className="absolute inset-0 bg-slate-900/40"></div>
                          <div className="absolute bottom-3 left-3 text-white">
                              <h3 className="font-bold text-lg">Casino {selectedCampus.name}</h3>
                              <div className="flex items-center gap-2 text-xs font-bold mt-1">
                                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded"><Clock className="w-3 h-3" /> 15 min espera</span>
                              </div>
                          </div>
                      </div>
                      <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Menú Junaeb</div>
                                  <span className="font-bold text-slate-800 text-sm block">Pollo Arvejado con Arroz</span>
                              </div>
                              <Ticket className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex justify-between items-center">
                              <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">Vegetariano</div>
                                  <span className="font-bold text-slate-800 text-sm block">Tortilla de Acelga</span>
                              </div>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'BOXES' && (
              <div className="space-y-4 animate-in fade-in">
                   <div className="flex justify-between items-center mb-2">
                       <p className="text-xs text-slate-500">Reserva tu espacio de estudio (Bloques de 2hrs).</p>
                       <button 
                        onClick={handleRefreshBoxes} 
                        disabled={isRefreshing}
                        className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors"
                       >
                           <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} /> Actualizar
                       </button>
                   </div>
                   
                   <div className="space-y-4">
                       {boxes.map((box) => (
                           <div key={box.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                               {/* Box Header */}
                               <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                   <div className="flex items-center gap-3">
                                       <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                           <Building2 className="w-4 h-4" />
                                       </div>
                                       <div>
                                           <h4 className="font-bold text-slate-800 text-sm">{box.name}</h4>
                                           <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                               <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> Cap: {box.capacity}</span>
                                               <span>•</span>
                                               <span>{box.features.join(', ')}</span>
                                           </div>
                                       </div>
                                   </div>
                               </div>

                               {/* Time Slots Grid */}
                               <div className="p-3">
                                   <div className="grid grid-cols-3 gap-2">
                                       {box.slots.map((slot) => {
                                           const isBusy = slot.status === 'BUSY';
                                           const isYours = slot.status === 'YOURS';
                                           
                                           return (
                                               <button
                                                   key={slot.time}
                                                   disabled={isBusy}
                                                   onClick={() => handleToggleSlot(box.id, slot.time)}
                                                   className={`
                                                       py-2 px-1 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center relative
                                                       ${isBusy 
                                                           ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed opacity-70' 
                                                           : isYours 
                                                               ? 'bg-green-500 border-green-500 text-white shadow-md scale-[1.02]' 
                                                               : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50'
                                                       }
                                                   `}
                                               >
                                                   <span>{slot.time}</span>
                                                   <span className="text-[8px] font-normal uppercase tracking-wider mt-0.5">
                                                       {isBusy ? 'Ocupado' : isYours ? 'Reservado' : 'Libre'}
                                                   </span>
                                                   {isYours && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                                                   {isBusy && <Lock className="w-3 h-3 absolute top-1 right-1 text-slate-300" />}
                                               </button>
                                           );
                                       })}
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default Campus;
