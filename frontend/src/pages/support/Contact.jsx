// src/pages/support/Contact.jsx
import { useState } from 'react';
import { Alert, Box, Typography, Container, TextField, Button, Paper } from '@mui/material';
import {
  validateEmail,
  validateMinLength,
  validateRequired,
} from '../../utils/validation';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#52b0c3' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiFormHelperText-root': { color: '#f87171' },
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!validateRequired(formData.name)) {
      nextErrors.name = 'Name is required.';
    } else if (!validateMinLength(formData.name, 2)) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    if (!validateRequired(formData.email)) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!validateRequired(formData.message)) {
      nextErrors.message = 'Message is required.';
    } else if (!validateMinLength(formData.message, 10)) {
      nextErrors.message = 'Message must be at least 10 characters.';
    }

    return nextErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStatus('');
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('Message ready to send.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box sx={{ py: 12, bgcolor: '#050505', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mb: 4 }}>
            Have questions? We'd love to hear from you.
          </Typography>
          {status && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {status}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Name"
              sx={inputStyle}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              sx={inputStyle}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              sx={inputStyle}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              error={Boolean(errors.message)}
              helperText={errors.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ bgcolor: '#52b0c3', mt: 2, fontWeight: 'bold' }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
