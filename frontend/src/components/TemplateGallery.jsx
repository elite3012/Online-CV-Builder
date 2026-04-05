// src/components/TemplateGallery.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "motion/react";

import { templates } from "../data/templates";
import { TemplateCard } from "./TemplateCard";

import CVRenderer from "../components/template/CVRenderer";
import { mockResumesData } from "../data/mockResumes";

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

  // State lưu trữ Template đang được Preview (null = không bật popup)
  const [previewItem, setPreviewItem] = useState(null);

  const filteredTemplates = templates.filter((template) => {
    if (activeTab === 0) return true;
    const selectedCategory = tabCategories[activeTab];
    return template.tags.includes(selectedCategory);
  });

  return (
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
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid #e0e0e0",
          mb: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#52b0c3"
            sx={{ fontFamily: "'Helvetica', sans-serif", mb: 1 }}
          >
            Choose Your Template
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select a professional template that matches your style. You can
            change it anytime.
          </Typography>
        </Box>

        {/* Tabs Filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderBottom: 1,
            borderColor: "divider",
            mb: 4,
            gap: { xs: 1, sm: 2 },
          }}
        >
          {tabCategories.map((tabLabel, index) => {
            const isActive = activeTab === index;
            const displayLabel =
              tabLabel === "All" ? "All Templates" : tabLabel;

            return (
              <Box
                key={tabLabel}
                onClick={() => setActiveTab(index)}
                sx={{
                  position: "relative",
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: isActive ? "#102a43" : "text.secondary",
                  fontWeight: isActive ? "bold" : "medium",
                  transition: "color 0.2s ease",
                  userSelect: "none",
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
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Templates Grid */}
        <Box sx={{ width: "100%" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, 250px)", // Tự động tạo cột vừa bằng chiều rộng thẻ (250px)
                  gap: 4,
                  justifyContent: "center",
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                {filteredTemplates.map((item) => (
                  <Box key={item.id}>
                    <TemplateCard
                      item={item}
                      onPreview={() => setPreviewItem(item)}
                      onUse={() => onUseTemplate(item)}
                    />
                  </Box>
                ))}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>

      {/*POPUP PREVIEW*/}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {previewItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPreviewItem(null)} // Bấm ra viền xám để đóng
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  backdropFilter: "blur(8px)", // Nền tối mờ 
                  zIndex: 99999,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 20px",
                  overflowY: "auto",
                  cursor: "zoom-out",
                }}
              >
                {/* Nút X đóng góc trên */}
                <IconButton
                  onClick={() => setPreviewItem(null)}
                  sx={{
                    position: "fixed",
                    top: 20,
                    right: 30,
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()} //
                  style={{ cursor: "default", marginBottom: "40px" }}
                >
                  <CVRenderer
                    templateName={previewItem.name}
                    data={mockResumesData[previewItem.id]}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Box>
  );
}
