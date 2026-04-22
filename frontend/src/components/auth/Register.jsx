// Register Component (US1)
// src/components/auth/Register.jsx
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import {
  PASSWORD_MIN_LENGTH,
  getApiErrorMessage,
  validateEmail,
  validateMatchingPassword,
  validateMinLength,
  validatePassword,
  validateRequired,
} from '../../utils/validation';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (values = formData) => {
    const nextErrors = {};
    const fullName = values.fullName.trim();
    const email = values.email.trim();

    if (!validateRequired(fullName)) {
      nextErrors.fullName = 'Full name is required.';
    } else if (!validateMinLength(fullName, 2)) {
      nextErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!validateRequired(email)) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!validatePassword(values.password)) {
      nextErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    if (!validateRequired(values.confirmPassword)) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (!validateMatchingPassword(values.password, values.confirmPassword)) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setServerError('');
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    setServerError('');

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const data = await apiService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        'Could not create account. Please try again.',
      );

      if (message.toLowerCase().includes('email already exists')) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered.',
        }));
      } else {
        setServerError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      noValidate
      sx={{
        width: '100%',
        maxWidth: 400,
        padding: 4,
        boxShadow: 10,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: '#fff',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        textAlign="center"
      >
        Create Account
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <TextField
        label="Full Name"
        name="fullName"
        variant="outlined"
        value={formData.fullName}
        onChange={handleChange}
        required
        fullWidth
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        variant="outlined"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
        error={Boolean(errors.password)}
        helperText={errors.password || `Minimum ${PASSWORD_MIN_LENGTH} characters.`}
      />

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        variant="outlined"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        fullWidth
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{
          marginTop: 1,
          padding: '10px 0',
          textTransform: 'none',
          fontSize: '1.1rem',
          bgcolor: '#52b0c3',
          '&:hover': { bgcolor: '#3d94a7' },
        }}
      >
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Already have an account?{' '}
        <MuiLink
          component={Link}
          to="/login"
          sx={{ color: '#52b0c3', fontWeight: 'bold', textDecoration: 'none' }}
        >
          Log in
        </MuiLink>
      </Typography>
    </Box>
  );
}
