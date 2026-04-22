// src/components/auth/Login.jsx
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { apiService } from '../../services/apiService';
import {
  PASSWORD_MIN_LENGTH,
  getApiErrorMessage,
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!validateRequired(normalizedEmail)) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(normalizedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!validateRequired(password)) {
      nextErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      nextErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    return nextErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    setServerError('');

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const data = await apiService.login({
        email: email.trim().toLowerCase(),
        password,
      });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
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
      <Box sx={{ mb: -1 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          textAlign="center"
          color="#102a43"
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Please enter your details to sign in.
        </Typography>
      </Box>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setServerError('');
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        required
        fullWidth
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setServerError('');
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
          required
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: '#c2cbd4', '&.Mui-checked': { color: '#52b0c3' } }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember me
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <MuiLink
            component={Link}
            to="/forgot-password"
            sx={{
              fontSize: '0.85rem',
              color: '#627d98',
              textDecoration: 'none',
              '&:hover': { color: '#52b0c3' },
            }}
          >
            Forgot password?
          </MuiLink>
        </Box>
      </Box>

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
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Don't have an account?{' '}
        <MuiLink
          component={Link}
          to="/register"
          sx={{ color: '#52b0c3', fontWeight: 'bold', textDecoration: 'none' }}
        >
          Sign up
        </MuiLink>
      </Typography>
    </Box>
  );
}
