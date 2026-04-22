// Validation utilities (UC6, US12)
export const PASSWORD_MIN_LENGTH = 8;

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email ?? '').trim());
};

export const validateRequired = (value) => {
  return String(value ?? '').trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return String(value ?? '').trim().length >= minLength;
};

export const validatePassword = (password) => {
  return String(password ?? '').length >= PASSWORD_MIN_LENGTH;
};

export const validateMatchingPassword = (password, confirmPassword) => {
  return String(password ?? '') === String(confirmPassword ?? '');
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const rawMessage = error?.message;
  if (!rawMessage) return fallback;

  try {
    const parsed = JSON.parse(rawMessage);
    return parsed?.message || fallback;
  } catch {
    return rawMessage;
  }
};
