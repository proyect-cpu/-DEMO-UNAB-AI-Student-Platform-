export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  GUEST = 'GUEST'
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  AI_CHAT = 'AI_CHAT',
  WELLNESS = 'WELLNESS',
  CAMPUS = 'CAMPUS',
  PROFILE = 'PROFILE'
}

export enum AIMode {
  TUTOR = 'TUTOR', // Socratic method
  PSYCHOLOGIST = 'PSYCHOLOGIST', // Empathetic, crisis detection
  COACH = 'COACH', // Career advice
  BUROCRACY = 'BUROCRACY' // Admin guide
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface BusRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  nextDeparture: string;
  status: 'OnTime' | 'Delayed' | 'Arriving';
}

export interface UserState {
  email: string;
  role: UserRole;
  name: string;
  coins: number;
  streak: number;
  stressLevel: number; // 0-100
  dyslexiaMode: boolean;
}