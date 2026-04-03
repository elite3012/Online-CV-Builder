// Main App Component
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn gốc "/" giờ sẽ hiển thị trang HomePage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Đường dẫn "/login" vẫn giữ nguyên cái form lúc nãy mình làm */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}