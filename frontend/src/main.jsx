import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline } from '@mui/material'; // Thêm cái này để reset CSS mặc định của trình duyệt

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline> {/* Đặt ở đây để áp dụng reset cho toàn bộ ứng dụng */}
    <App />
    </CssBaseline>
  </React.StrictMode>,
);
