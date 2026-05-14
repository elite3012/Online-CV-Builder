// API Service - handles HTTP requests to backend
function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (port === '5173') {
      return 'http://localhost:8081/api';
    }
    return `${protocol}//${hostname}${window.location.port ? `:${window.location.port}` : ''}/api`;
  }

  return 'http://localhost:8081/api';
}

const API_BASE_URL = resolveApiBaseUrl();

const TOKEN_KEY = 'token';
const USER_KEY = 'authUser';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function isTokenExpired(token = getToken()) {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveAuthSession(authData) {
  if (!authData?.token) return;

  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
    }),
  );
}

function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

function handleAuthFailure() {
  clearAuthSession();
  redirectToLogin();
}

async function request(path, options = {}) {
  let token = getToken();
  const isPublicAuthRequest =
    path === '/auth/login' || path === '/auth/register' || path === '/auth/logout';
  const isFormDataRequest =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (token && isTokenExpired(token)) {
    clearAuthSession();
    token = null;

    if (!isPublicAuthRequest) {
      redirectToLogin();
      throw new Error(JSON.stringify({ message: 'Your session has expired. Please log in again.' }));
    }
  }

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (!isFormDataRequest && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');

    if (response.status === 401) {
      handleAuthFailure();
    }

    throw new Error(errorText || JSON.stringify({ message: `HTTP error ${response.status}` }));
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

export const apiService = {
  isTokenExpired,
  getStoredUser,
  saveAuthSession,
  clearAuthSession,

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

  getCurrentUser: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  updateCurrentUser: (profile) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  changePassword: (passwordData) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),

  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      clearAuthSession();
    }

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

  importCV: ({ file, templateId, title }, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateId', String(templateId));
    if (title?.trim()) {
      formData.append('title', title.trim());
    }

    return request('/cv/import', {
      method: 'POST',
      body: formData,
      ...options,
    });
  },

  deleteCV: (cvId) =>
    request(`/cv/${cvId}`, {
      method: 'DELETE',
    }),

  // Template endpoints
  getTemplates: () =>
    request('/template', {
      method: 'GET',
    }),

  // AI endpoints
  analyzeJD: (cvId, jdText, options = {}) =>
    request('/ai/analyze-jd', {
      method: 'POST',
      body: JSON.stringify({
        cvId,
        jdText,
        atsOnly: Boolean(options.atsOnly),
        engine: options.engine || 'auto',
      }),
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
