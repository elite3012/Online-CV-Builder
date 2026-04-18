// API Service - handles HTTP requests to backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `HTTP error ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

export const apiService = {
  // Auth endpoints
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => {
    request('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
    return null;
  },

  // CV endpoints
  getCVList: () =>
    request('/cv', {
      method: 'GET',
    }),

  getCV: (cvId) =>
    request(`/cv/${cvId}`, {
      method: 'GET',
    }),

  createCV: (cvData, options = {}) =>
    request('/cv', {
      method: 'POST',
      body: JSON.stringify(cvData),
      ...options,
    }),

  updateCV: (cvId, cvData, options = {}) =>
    request(`/cv/${cvId}`, {
      method: 'PUT',
      body: JSON.stringify(cvData),
      ...options,
    }),

  deleteCV: (cvId) =>
    request(`/cv/${cvId}`, {
      method: 'DELETE',
    }),

  // Template endpoints
  getTemplates: () =>
    request('/templates', {
      method: 'GET',
    }),

  // AI endpoints (Sprint 4 preparation)
  analyzeJD: (cvId, jdText) =>
    request(`/ai/analyze-jd`, {
      method: 'POST',
      body: JSON.stringify({ cvId, jdText }),
    }),

  // Export endpoints
  exportPDF: (cvId) =>
    request(`/export/pdf/${cvId}`, {
      method: 'GET',
    }),

  exportDOCX: (cvId) =>
    request(`/export/docx/${cvId}`, {
      method: 'GET',
    }),
};
