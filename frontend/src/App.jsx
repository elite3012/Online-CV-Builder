// Main App Component
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tạm thời mình cài đặt: Nếu vào trang chủ "/" thì tự động hất văng sang "/login" để bạn dễ test nhé */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Đây là route chính thức cho trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}