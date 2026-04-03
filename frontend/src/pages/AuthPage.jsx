// src/pages/AuthPage.jsx
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Grainient from "../components/reactbits/Grainient";

export default function AuthPage() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingBottom: "5vh",
        overflow: "hidden", // Ngăn thanh cuộn (scrollbar) xuất hiện chớp nhoáng khi animation chạy
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Đẩy layer này xuống dưới đáy
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

      {/* AnimatePresence để bắt được sự kiện khi component bị xóa đi */}
      <AnimatePresence mode="wait">
        {/* Thay thế Box/div bằng motion.div để gắp animation vào */}
        <motion.div
          key={location.pathname} // Framer biết khi nào URL đổi để chạy hiệu ứng
          initial={{ opacity: 0, y: 30, scale: 0.95 }} // Trạng thái bắt đầu
          animate={{ opacity: 1, y: 0, scale: 1 }} // Trạng thái xuất hiện
          exit={{ opacity: 0, y: -30, scale: 0.95 }} // Trạng thái biến mất
          transition={{ duration: 0.3, ease: "easeOut" }} // Thời gian 0.3s, hiệu ứng nhanh dần rồi chậm lại (mượt)
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {isLogin ? <Login /> : <Register />}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
