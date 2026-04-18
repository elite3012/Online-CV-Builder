// src/components/TemplateGallery.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "motion/react";

import { TemplateCard } from "./TemplateCard";
import CVRenderer from "../components/template/CVRenderer";
import api from "../data/api"; // axios instance với baseURL = http://localhost:8080/api

const tabCategories = [
  "All",
  "Modern",
  "Minimal",
  "Classic",
  "Creative",
  "Professional",
  "Elegant",
];

export default function TemplateGallery({ onUseTemplate }) {
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // Fetch templates từ backend
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await api.get("/template"); // gọi /api/template
        setTemplates(res.data);
      } catch (err) {
        console.error("Failed to load templates", err);
      }
    }
    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    if (activeTab === 0) return true;
    const selectedCategory = tabCategories[activeTab];
    return template.tags?.includes(selectedCategory);
  });

  async function handlePreview(item) {
    setPreviewItem(item);
    try {
      const res = await api.get(`/template/${item.id}`); // gọi /api/template/{id}
      setPreviewData(res.data); // dữ liệu template từ backend
    } catch (err) {
      setPreviewData({ error: "Preview failed" });
    }
  }

  return (
    <Box sx={{ p: 4, mt: "80px", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#52b0c3">
            Choose Your Template
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a professional template that matches your style.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          {tabCategories.map((tabLabel, index) => {
            const isActive = activeTab === index;
            const displayLabel =
              tabLabel === "All" ? "All Templates" : tabLabel;
            return (
              <Box
                key={tabLabel}
                onClick={() => setActiveTab(index)}
                sx={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: isActive ? "#102a43" : "text.secondary",
                  fontWeight: isActive ? "bold" : "medium",
                  position: "relative",
                }}
              >
                {displayLabel}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: "#52b0c3",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Templates Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, 250px)", gap: 4, justifyContent: "center" }}>
          {filteredTemplates.map((item) => (
            <Box key={item.id}>
              <TemplateCard
                item={item}
                onPreview={() => handlePreview(item)}
                onUse={() => onUseTemplate(item)}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* POPUP PREVIEW */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {previewItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 20px",
                  overflowY: "auto",
                }}
                onClick={() => setPreviewItem(null)}
              >
                <IconButton
                  onClick={() => setPreviewItem(null)}
                  sx={{ position: "fixed", top: 20, right: 30, color: "white" }}
                >
                  <CloseIcon />
                </IconButton>

                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CVRenderer
                    templateName={previewItem.name}
                    data={previewData}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </Box>
  );
}
