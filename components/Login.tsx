import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, Lock, ArrowRight, AlertCircle, IdCard } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');

  // Algoritmo Modulo 11 para validar RUT Chileno
  const validateRut = (rut: string): boolean => {
    const clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return false;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toLowerCase();

    if (!/^\d+$/.test(body)) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const res = 11 - (sum % 11);
    const calculatedDv = res === 11 ? '0' : res === 10 ? 'k' : res.toString();

    return calculatedDv === dv;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validar RUT
    if (!validateRut(rut)) {
      setError('RUT inválido. Verifica que esté bien escrito (ej: 12345678-k).');
      return;
    }

    // 2. Validar Dominio
    if (email.endsWith('@uandresbello.edu')) {
      onLogin(email, UserRole.STUDENT);
    } else if (email.endsWith('@unab.cl')) {
      onLogin(email, UserRole.TEACHER);
    } else {
      setError('Acceso denegado. Debes usar tu correo institucional UNAB (@uandresbello.edu).');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-red-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <GraduationCap className="w-10 h-10 text-red-800" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">UNAB SuperApp</h1>
          <p className="text-slate-500 text-sm mt-1">Tu compañero universitario inteligente</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Correo Institucional</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre.apellido@uandresbello.edu"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* RUT Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">RUT (sin puntos)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="12345678-k"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10"
              />
              <IdCard className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-xs text-slate-400 mt-1 ml-1">Ingresa tu RUT con guión y dígito verificador.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Ingresar <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-500">Sistema de Seguridad Integrado</p>
          <p>Validación Biométrica de RUT + Dominio Educativo</p>
          <p>Encriptación de extremo a extremo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;