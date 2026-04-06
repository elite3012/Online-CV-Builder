// src/pages/AuthPage.jsx
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword"; // 1. IMPORT VÀO ĐÂY
import Grainient from "../components/reactbits/Grainient";

export default function AuthPage() {
  const location = useLocation();
  
  // 2. HÀM CHỌN COMPONENT ĐỂ HIỂN THỊ
  const renderAuthComponent = () => {
    switch (location.pathname) {
      case "/login":
        return <Login />;
      case "/forgot-password":
        return <ForgotPassword />;
      case "/register":
      default:
        return <Register />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingBottom: "5vh",
        overflow: "hidden", 
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, 
        }}
      >
        <Grainient
          color1="#52b0c3"
          color2="#151414"
          color3="#def4c6"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname} 
          initial={{ opacity: 0, y: 30, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: -30, scale: 0.95 }} 
          transition={{ duration: 0.3, ease: "easeOut" }} 
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {renderAuthComponent()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}