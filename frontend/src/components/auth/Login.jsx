// Login Component (US1)
import { useState } from 'react';
// Import các component làm sẵn cực đẹp của MUI
import { Box, TextField, Button, Typography } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Đang thử đăng nhập với:', { email, password });
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleLogin}
      // Đây chính là sức mạnh của sx prop!
      sx={{ 
        maxWidth: 400,          // Chiều rộng tối đa
        margin: '0 auto',       // Canh giữa màn hình
        padding: 4,             // Thụtt lề bên trong (khoảng cách x4)
        boxShadow: 3,           // Đổ bóng siêu đẹp
        borderRadius: 2,        // Bo góc
        display: 'flex',        // Dùng Flexbox để xếp dọc
        flexDirection: 'column',
        gap: 3,                 // Khoảng cách giữa các ô nhập
        backgroundColor: '#fff',
        marginTop: '10vh'       // Đẩy xuống một chút so với mép trên
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
        Log In
      </Typography>

      <TextField 
        label="Email" 
        type="email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField 
        label="Password" 
        type="password" 
        variant="outlined" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      <Button 
        type="submit" 
        variant="contained" 
        size="large"
        // Thêm sx cho nút nếu muốn custom riêng
        sx={{ 
          marginTop: 1, 
          padding: '10px 0',
          textTransform: 'none', // Bỏ viết hoa toàn bộ chữ
          fontSize: '1.1rem'
        }}
      >
        Log in to CV Builder
      </Button>
    </Box>
  );
}