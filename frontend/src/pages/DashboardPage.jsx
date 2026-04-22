// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";

// Import components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import TemplateGallery from "../components/TemplateGallery";
import MyResumes from "../components/MyResumes";
import Editor from "../components/Editor";
import ATSChecker from "../components/ATSChecker";
import Settings from "../components/Settings";

export default function Dashboard() {
  const location = useLocation();

  const defaultView = location.state?.activeTab || "Overview";
  const [currentView, setCurrentView] = useState(defaultView);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchableViews = new Set(["Overview", "My Resumes"]);
  const isSearchEnabled = searchableViews.has(currentView);

  useEffect(() => {
    if (location.state?.activeTab) {
      setCurrentView(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    setSearchQuery("");
  }, [currentView]);

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView("Editor");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", display: "flex" }}>
      {currentView !== "Editor" && (
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ml: currentView === "Editor" ? "0px" : "225px",
          bgcolor: currentView === "Editor" ? "#f4f7f6" : "#050505",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          transition: "margin-left 0.3s ease",
        }}
      >
        {currentView !== "Editor" && (
          <TopNavbar
            title={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchEnabled={isSearchEnabled}
          />
        )}

        <AnimatePresence mode="wait">
          {currentView === "Overview" && (
            <motion.div
              key="overview-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <TemplateGallery
                onUseTemplate={handleUseTemplate}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}

          {currentView === "My Resumes" && (
            <motion.div
              key="my-resumes-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <MyResumes
                setCurrentView={setCurrentView}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}

          {currentView === "Editor" && (
            <motion.div
              key="editor-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              <Editor
                template={selectedTemplate}
                onBack={() => setCurrentView("Overview")}
              />
            </motion.div>
          )}
          {currentView === "ATS Checker" && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <ATSChecker />
            </motion.div>
          )}

          {currentView === "Settings" && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
