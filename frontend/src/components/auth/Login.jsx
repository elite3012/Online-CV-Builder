// src/components/auth/Login.jsx
import { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Link as MuiLink, 
  InputAdornment, IconButton, FormControlLabel, Checkbox 
} from '@mui/material';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [rememberMe, setRememberMe] = useState(false); // State lưu trạng thái tickbox

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Đang thử đăng nhập với:', { email, password, rememberMe });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box 
      component="form" 
      onSubmit={handleLogin}
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
          Welcome Back
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
          Please enter your details to sign in.
        </Typography>
      </Box>

      <TextField 
        label="Email" 
        type="email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField 
          label="Password" 
          type={showPassword ? 'text' : 'password'} 
          variant="outlined" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
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
            )
          }}
        />
        
        {/* Remember me và Forgot password*/}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox 
                size="small"
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                sx={{ color: '#c2cbd4', '&.Mui-checked': { color: '#52b0c3' } }} 
              />
            }
            label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
            sx={{ m: 0 }} 
          />

          <MuiLink 
            component={Link} 
            to="/forgot-password" 
            sx={{ fontSize: '0.85rem', color: '#627d98', textDecoration: 'none', '&:hover': { color: '#52b0c3' } }}
          >
            Forgot password?
          </MuiLink>
        </Box>
      </Box>

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
        Log in
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Don't have an account?{' '}
        <MuiLink component={Link} to="/register" sx={{ color: '#52b0c3', fontWeight: 'bold', textDecoration: 'none' }}>
          Sign up
        </MuiLink>
      </Typography>
    </Box>
  );
}