// API Configuration
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.persona-app.com';

export const API_ENDPOINTS = {
  QUIZ: '/quiz',
  QUIZ_RESULTS: '/quiz/results',
  CAREERS: '/careers',
  CAREER_DETAILS: (id: string) => `/careers/${id}`,
  CAREER_RECOMMENDATIONS: '/careers/recommendations',
};

export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  secondary: '#5856D6',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const COMPANY_SIZES = {
  STARTUP: 'startup',
  MID: 'mid',
  ENTERPRISE: 'enterprise',
} as const;
