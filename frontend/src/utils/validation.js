// Validation utilities (UC6, US12)
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};
