// Register Component (US1)
// src/components/auth/Register.jsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom'; // Dùng để chuyển trang không bị reload

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Oops! Mật khẩu xác nhận không khớp, bạn kiểm tra lại nhé!");
      return;
    }
    console.log('Đang thử đăng ký với:', formData);
    // Xử lý gọi API ở đây sau
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleRegister}
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
      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
        Create Account
      </Typography>

      <TextField 
        label="Full Name" 
        name="fullName"
        variant="outlined" 
        value={formData.fullName}
        onChange={handleChange}
        required
        fullWidth
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
        Sign up
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Already have an account?{' '}
        <MuiLink component={Link} to="/login" sx={{ color: '#52b0c3', fontWeight: 'bold', textDecoration: 'none' }}>
          Log in
        </MuiLink>
      </Typography>
    </Box>
  );
}