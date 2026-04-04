// src/pages/Dashboard.jsx
import { useState } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "motion/react"; 

// Import components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import TemplateGallery from "../components/TemplateGallery"; 
import MyResumes from "../components/MyResumes";


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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
              <MyResumes />
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Box>
  );
}