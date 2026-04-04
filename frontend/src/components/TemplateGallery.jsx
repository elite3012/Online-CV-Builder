// src/components/TemplateGallery.jsx
import { useState } from "react";
import { Box, Typography, Grid, Paper, Container } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import { templates } from "../data/templates";
import { TemplateCard } from "./TemplateCard";

const tabCategories = [
  "All",
  "Modern",
  "Minimal",
  "Classic",
  "Creative",
  "Professional",
  "Elegant",
];

export default function TemplateGallery() {
  const [activeTab, setActiveTab] = useState(0);

  // Logic lọc dữ liệu
  const filteredTemplates = templates.filter((template) => {
    if (activeTab === 0) return true;
    const selectedCategory = tabCategories[activeTab];
    return template.tags.includes(selectedCategory);
  });

  return (
    <Box sx={{ p: 4, flexGrow: 1, mt: "80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid #e0e0e0", mb: 4 }}>
        
        {/* Header Title */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#52b0c3" sx={{ fontFamily: "'Helvetica', sans-serif", mb: 1 }}>
            Choose Your Template
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select a professional template that matches your style. You can change it anytime.
          </Typography>
        </Box>

        {/* Custom Animated Filter Tabs */}
        <Box sx={{ display: "flex", justifyContent: "center", borderBottom: 1, borderColor: "divider", mb: 4, gap: { xs: 1, sm: 2 } }}>
          {tabCategories.map((tabLabel, index) => {
            const isActive = activeTab === index;
            const displayLabel = tabLabel === "All" ? "All Templates" : tabLabel;

            return (
              <Box
                key={tabLabel}
                onClick={() => setActiveTab(index)}
                sx={{
                  position: "relative", padding: "10px 16px", cursor: "pointer",
                  color: isActive ? "#102a43" : "text.secondary",
                  fontWeight: isActive ? "bold" : "medium",
                  transition: "color 0.2s ease", userSelect: "none",
                }}
              >
                {displayLabel}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 3, backgroundColor: "#52b0c3", borderRadius: "3px 3px 0 0" }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Templates Grid kèm Animation */}
        <Container maxWidth="md" disableGutters sx={{ mx: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
                {filteredTemplates.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                    <TemplateCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>
        </Container>

      </Paper>
    </Box>
  );
}