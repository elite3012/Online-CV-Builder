// src/api.js
import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Nếu bạn có token lưu trong localStorage/sessionStorage thì gắn vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
