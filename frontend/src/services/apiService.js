// API Service - handles HTTP requests to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiService = {
  // Auth endpoints
  login: (credentials) => {},
  register: (userData) => {},
  logout: () => {},
  
  // CV endpoints
  getCVList: () => {},
  getCV: (cvId) => {},
  createCV: (cvData) => {},
  updateCV: (cvId, cvData) => {},
  deleteCV: (cvId) => {},
  
  // Template endpoints
  getTemplates: () => {},
  
  // Export endpoints
  exportPDF: (cvId) => {},
  exportDOCX: (cvId) => {},
};
