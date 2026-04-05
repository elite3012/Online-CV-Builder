// src/pages/Dashboard.jsx
import { useState } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";

// Import components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import TemplateGallery from "../components/TemplateGallery";
import MyResumes from "../components/MyResumes";
import Editor from "../components/Editor";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("Overview");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView("Editor");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", display: "flex" }}>
      
      {/* Chỉ hiện Sidebar nếu không phải là Editor */}
      {currentView !== "Editor" && (
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      )}

      {/* CONTENT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // Thu hồi margin-left về 0px nếu là Editor để chiếm full màn hình
          ml: currentView === "Editor" ? "0px" : "225px",
          // Nền Editor màu sáng, nền Dashboard màu tối
          bgcolor: currentView === "Editor" ? "#f4f7f6" : "#050505",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          transition: "margin-left 0.3s ease", // Hiệu ứng trượt
        }}
      >
        {currentView !== "Editor" && <TopNavbar title={currentView} />}
        
        <AnimatePresence mode="wait">
          {currentView === "Overview" && (
            <motion.div
              key="overview-view"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <TemplateGallery onUseTemplate={handleUseTemplate} />
            </motion.div>
          )}

          {currentView === "My Resumes" && (
            <motion.div
              key="my-resumes-view"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <MyResumes />
            </motion.div>
          )}

          {currentView === "Editor" && (
            <motion.div
              key="editor-view"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh" }}
            >
              <Editor
                template={selectedTemplate}
                onBack={() => setCurrentView("Overview")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}