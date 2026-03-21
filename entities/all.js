import { base44 } from './base44Client';

// Quiz Entity
export const Quiz = base44.entities("Quiz");

// QuizAttempt Entity  
export const QuizAttempt = base44.entities("QuizAttempt");

// User Entity (built-in Base44 user)
export const User = base44.auth;