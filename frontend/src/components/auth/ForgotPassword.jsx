// src/components/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Đang gửi link reset password tới:', email);
    // Giả lập gọi API thành công
    setIsSubmitted(true);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
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
        <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" color="#102a43">
          Reset Password
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
          {isSubmitted 
            ? "We have sent a password reset link to your email. Please check your inbox."
            : "Enter your email address and we'll send you a link to reset your password."}
        </Typography>
      </Box>

      {!isSubmitted ? (
        <>
          <TextField 
            label="Email" 
            type="email" 
            variant="outlined" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              marginTop: 1, 
              padding: '10px 0',
              textTransform: 'none', 
              fontSize: '1.1rem',
              bgcolor: '#52b0c3', 
              '&:hover': { bgcolor: '#3d94a7' }
            }}
          >
            Send Reset Link
          </Button>
        </>
      ) : (
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => setIsSubmitted(false)}
          sx={{ 
            marginTop: 1, 
            padding: '10px 0',
            textTransform: 'none', 
            fontSize: '1.1rem',
            color: '#52b0c3',
            borderColor: '#52b0c3',
            '&:hover': { borderColor: '#3d94a7', bgcolor: 'rgba(82, 176, 195, 0.04)' }
          }}
        >
          Try another email
        </Button>
      )}

      <Typography textAlign="center" variant="body2" sx={{ mt: 1 }}>
        <MuiLink 
          component={Link} 
          to="/login" 
          sx={{ 
            color: '#627d98', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 0.5,
            fontWeight: 500,
            '&:hover': { color: '#52b0c3' } 
          }}
        >
          <ArrowBackIcon fontSize="small" /> Back to log in
        </MuiLink>
      </Typography>
    </Box>
  );
}