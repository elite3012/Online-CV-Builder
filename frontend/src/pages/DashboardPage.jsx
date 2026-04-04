// src/pages/Dashboard.jsx
import { useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { motion, AnimatePresence } from "motion/react"; // Thêm dòng import này

// Import components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import TemplateGallery from "../components/TemplateGallery"; 

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("Overview");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb" }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* CONTENT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ml: "225px",
          bgcolor: "#050505",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TopNavbar />

        {/* Bọc AnimatePresence ở ngoài cùng để quản lý hiệu ứng ra/vào */}
        <AnimatePresence mode="wait">
          
          {/* ========================================= */}
          {/* TRƯỜNG HỢP 1: NẾU ĐANG CHỌN OVERVIEW      */}
          {/* ========================================= */}
          {currentView === "Overview" && (
            <motion.div
              key="overview-view"
              initial={{ opacity: 0, y: 20 }} // Trạng thái bắt đầu: Mờ và nằm tuột ở dưới
              animate={{ opacity: 1, y: 0 }}  // Trạng thái xuất hiện: Rõ nét và trượt lên vị trí gốc
              exit={{ opacity: 0, y: -20 }}   // Trạng thái biến mất: Mờ dần và trượt lên trên
              transition={{ duration: 0.3, ease: "easeOut" }} // Tốc độ trượt
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <TemplateGallery />
            </motion.div>
          )}

          {/* ========================================= */}
          {/* TRƯỜNG HỢP 2: NẾU ĐANG CHỌN MY RESUMES    */}
          {/* ========================================= */}
          {currentView === "My Resumes" && (
            <motion.div
              key="my-resumes-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  p: 4,
                  flexGrow: 1,
                  mt: "80px",
                  minHeight: "100vh",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontFamily: "'Helvetica', sans-serif", mb: 1 }}>
                  My Resumes
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.7)" sx={{ mb: 3 }}>
                  Here are all the awesome resumes you have created.
                </Typography>
                
                <Paper sx={{ p: 5, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.05)", border: "1px dashed rgba(255, 255, 255, 0.2)", borderRadius: 3 }}>
                  <Typography color="white">You haven't created any resumes yet.</Typography>
                  <Button variant="contained" sx={{ mt: 2, bgcolor: "#52b0c3", "&:hover": { bgcolor: "#3d94a7" } }}>
                    Create New Resume
                  </Button>
                </Paper>
              </Box>
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Box>
  );
}