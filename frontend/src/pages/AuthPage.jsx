// src/pages/AuthPage.jsx
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";
import Grainient from "../components/reactbits/Grainient";

export default function AuthPage() {
  const location = useLocation();
  
  const renderAuthComponent = () => {
    switch (location.pathname) {
      case "/login": return <Login />;
      case "/forgot-password": return <ForgotPassword />;
      case "/register": return <Register />;
      default: return <Login />;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      
      {/* LỚP NỀN: Luôn cố định, không bị ảnh hưởng bởi Animation */}
      <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <Grainient
          color1="#52b0c3"
          color2="#151414"
          color3="#def4c6"
          timeSpeed={0.05} // Giảm tốc độ một chút cho mượt
          gridSize={2}     // Đảm bảo có tham số này nếu component yêu cầu
          // ... giữ nguyên các thông số cũ của sếp ...
          noiseScale={2}
          contrast={1.5}
        />
      </Box>

      {/* LỚP NỘI DUNG: Nằm trên nền (zIndex: 1) */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "5vh",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {renderAuthComponent()}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}