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

function createUnauthorizedError(message = 'Please log in to continue.') {
  return new Error(JSON.stringify({ status: 401, message }));
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveAuthSession(authData) {
  if (!authData) return;

  localStorage.removeItem(TOKEN_KEY);
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

function parseErrorPayload(error) {
  if (!error) return {};

  if (typeof error === 'string') {
    try {
      return JSON.parse(error);
    } catch {
      return { message: error };
    }
  }

  try {
    return JSON.parse(error.message);
  } catch {
    return { message: error.message || 'Request failed.' };
  }
}

function extractFilename(disposition, fallbackName) {
  const match = disposition?.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  if (!match?.[1]) {
    return fallbackName;
  }

  return decodeURIComponent(match[1]).replace(/"/g, '').trim() || fallbackName;
}

async function downloadFile(path, fallbackName) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');

    if (response.status === 401) {
      handleAuthFailure();
      throw createUnauthorizedError('Your session is no longer valid. Please log in again.');
    }

    throw new Error(errorText || JSON.stringify({ message: `HTTP error ${response.status}` }));
  }

  const blob = await response.blob();
  const fileName = extractFilename(
    response.headers.get('content-disposition'),
    fallbackName,
  );
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);

  return { fileName };
}

async function request(path, options = {}) {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const isFormDataRequest =
    typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

  const headers = {
    ...(fetchOptions.headers || {}),
  };

  if (!isFormDataRequest && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');

    if (response.status === 401) {
      if (skipAuthRedirect) {
        throw new Error(errorText || JSON.stringify({ message: 'Invalid credentials' }));
      }

      handleAuthFailure();
      throw createUnauthorizedError('Your session is no longer valid. Please log in again.');
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
  isUnauthorizedError: (error) => Number(parseErrorPayload(error).status) === 401,
  parseErrorPayload,
  getStoredUser,
  saveAuthSession,
  clearAuthSession,

  // Auth endpoints
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuthRedirect: true,
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuthRedirect: true,
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
    downloadFile(`/export/pdf/${cvId}`, `cv-${cvId}.pdf`),

  exportDOCX: (cvId) =>
    downloadFile(`/export/docx/${cvId}`, `cv-${cvId}.docx`),
};
