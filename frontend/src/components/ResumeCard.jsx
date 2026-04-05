// src/components/ResumeCard.jsx
import { Box, Typography, Button, IconButton, Chip } from "@mui/material";
import { motion } from "motion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderGlow from "./reactbits/BorderGlow";
import CVRenderer from "./template/CVRenderer";

export default function ResumeCard({ cv, index, previewData, onDelete, onEdit, onPreview }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <BorderGlow
        edgeSensitivity={30}
        backgroundColor="none"
        glowColor="190 80 80"
        borderRadius={12}
        glowRadius={80}
        glowIntensity={1.0}
        coneSpread={10}
        colors={["#1c7c54", "#52b0c3", "#def4c6"]}
        style={{ width: 250, display: "flex" }}
      >
        <Box sx={{ width: 250, display: "flex", flexDirection: "column", flexGrow: 1, bgcolor: "white", borderRadius: "12px", position: "relative" }}>
          
          {/* NÚT XÓA */}
          <IconButton 
            onClick={() => onDelete(cv.id)} 
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 10, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#ffebee" } }}
            size="small"
          >
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>

          {/* LIVE THUMBNAIL */}
          <Box sx={{ width: "100%", height: 220, overflow: "hidden", position: "relative", borderRadius: "12px 12px 0 0", zIndex: 0, bgcolor: "#f0f4f8", borderBottom: "1px solid #e0e0e0" }}>
            <Box sx={{ width: 794, height: 1122, transform: "scale(0.315)", transformOrigin: "top left", pointerEvents: "none" }}>
              <CVRenderer templateName={cv.templateName} data={previewData} />
            </Box>
          </Box>

          {/* THÔNG TIN */}
          <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#102a43" sx={{ fontFamily: "'Helvetica', sans-serif" }} noWrap>
              {cv.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, mb: 1.5, flexGrow: 1, fontSize: "0.7rem", fontStyle: "italic" }}>
              Last edited: {cv.lastEdited}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
              <Chip label={cv.templateName} size="small" sx={{ fontSize: "0.65rem", height: 20, bgcolor: "#f0f4f8", color: "#102a43" }} />
            </Box>

            {/* ACTION BUTTONS */}
            <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
              <Button variant="outlined" size="small" onClick={() => onPreview(cv.id)} sx={{ flex: 1, textTransform: "none", color: "#607d8b", borderColor: "#e0e0e0", "&:hover": { bgcolor: "#f5f5f5", borderColor: "#cfd8dc" } }}>
                Preview
              </Button>
              <Button variant="contained" size="small" onClick={() => onEdit(cv)} sx={{ flex: 1, textTransform: "none", bgcolor: "#52b0c3", color: "white", boxShadow: "none", "&:hover": { bgcolor: "#3d94a7", boxShadow: "none" } }}>
                Edit
              </Button>
            </Box>
          </Box>

        </Box>
      </BorderGlow>
    </motion.div>
  );
}