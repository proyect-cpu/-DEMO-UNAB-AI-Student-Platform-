
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  GUEST = 'GUEST'
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  NOTIFICATIONS = 'NOTIFICATIONS',
  MANAGEMENT = 'MANAGEMENT', // New View
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

export type ThemeColor = 'red' | 'blue' | 'emerald' | 'purple' | 'slate';

export interface Grade {
  subject: string;
  score: number; // 1.0 to 7.0
  weight: number; // percentage
  date: string;
}

export interface UserState {
  id: string; // Unique University ID
  email: string;
  role: UserRole;
  name: string; 
  nickname?: string; 
  bio?: string; 
  interests?: string[]; 
  themeColor: ThemeColor; 
  avatar?: string; 
  coins: number;
  streak: number;
  stressLevel: number; 
  dyslexiaMode: boolean;
  grades?: Grade[]; // New Grades field
}
