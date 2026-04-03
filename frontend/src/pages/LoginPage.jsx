// src/pages/LoginPage.jsx
import Login from '../components/auth/Login';
import { Box } from '@mui/material';

export default function LoginPage() {
  return (
    // Box này đóng vai trò như thẻ <div> bọc toàn màn hình
    <Box sx={{ 
      minHeight: '100vh',       // Cao bằng 100% màn hình
      backgroundColor: '#f5f5f5', // Màu nền xám nhạt
      paddingTop: '80px'        // Đẩy form xuống một chút
    }}>
      <Login />
    </Box>
  );
}