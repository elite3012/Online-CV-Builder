// src/components/TemplateCard.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Typography, Chip, Button } from "@mui/material";
import BorderGlow from "./reactbits/BorderGlow";
import { AnimatePresence, motion } from "motion/react";

// Import Giao diện và Data
import CVRenderer from "./template/CVRenderer"; // Chú ý đường dẫn ./template
import { mockResumesData } from "../data/mockResumes";

export const TemplateCard = ({ item }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Lấy data tương ứng với id của template
  const resumeData = mockResumesData[item.id];

  return (
    <>
      <BorderGlow
        edgeSensitivity={30}
        backgroundColor="none"
        glowColor="190 80 80"
        borderRadius={12}
        glowRadius={80}
        glowIntensity={1.0}
        coneSpread={10}
        colors={["#1c7c54", "#52b0c3", "#def4c6"]}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: 250, // Cố định chiều rộng thẻ
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            bgcolor: "white",
            borderRadius: "12px",
          }}
        >
          {/* ============================================== */}
          {/* KHU VỰC LIVE THUMBNAIL (THAY THẾ THẺ <img> CŨ) */}
          {/* ============================================== */}
          <Box
            sx={{
              width: "100%",
              height: 220, // Chiều cao khu vực hiển thị thu nhỏ
              overflow: "hidden", // Cắt bỏ phần CV bị dài quá
              position: "relative",
              borderRadius: "12px 12px 0 0",
              zIndex: 0,
              bgcolor: "#f0f4f8",
              borderBottom: "1px solid #e0e0e0"
            }}
          >
            {/* Box bọc bên trong dùng để chứa CV A4 và thu nhỏ nó lại */}
            <Box
              sx={{
                width: 794, // Chiều rộng chuẩn A4 của CV
                height: 1122, // Chiều cao chuẩn A4
                transform: "scale(0.315)", // 250px / 794px ≈ 0.315 (Thu nhỏ vừa y thẻ)
                transformOrigin: "top left", // Bắt đầu thu nhỏ từ góc trái trên cùng
                pointerEvents: "none", // Ngăn chặn việc hover/click vào CV lúc nó đang thu nhỏ
              }}
            >
              <CVRenderer templateName={item.name} data={resumeData} />
            </Box>
          </Box>

          <Box
            sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="subtitle1" fontWeight="bold" color="#102a43" sx={{ fontFamily: "'Helvetica', sans-serif" }}>
              {item.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, mb: 1.5, flexGrow: 1, fontSize: "0.5rem", lineHeight: 1.4 }}>
              {item.desc}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
              {item.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ fontSize: "0.65rem", height: 20, bgcolor: "#f0f4f8", color: "#102a43" }} />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsPreviewOpen(true)}
                sx={{ flex: 1, textTransform: "none", color: "#607d8b", borderColor: "#e0e0e0", "&:hover": { bgcolor: "#f5f5f5", borderColor: "#cfd8dc" } }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ flex: 1, textTransform: "none", bgcolor: "#52b0c3", color: "white", boxShadow: "none", "&:hover": { bgcolor: "#3d94a7", boxShadow: "none" } }}
              >
                Use
              </Button>
            </Box>
          </Box>
        </Box>
      </BorderGlow>

      {/* ============================================== */}
      {/* PHẦN POPUP PREVIEW (HIỆN TOÀN BỘ CV KHI BẤM)   */}
      {/* ============================================== */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                onClick={() => setIsPreviewOpen(false)}
                style={{
                  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                  backgroundColor: "rgba(30, 30, 30, 0.85)", backdropFilter: "blur(5px)", zIndex: 99999,
                  display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", cursor: "zoom-out",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxHeight: "90vh", maxWidth: "95vw", overflow: "auto",
                    borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", cursor: "default", backgroundColor: "white",
                  }}
                >
                  {/* TRONG NÀY GỌI LẠI CVRENDERER NHƯNG KHÔNG CẦN THU NHỎ */}
                  <CVRenderer templateName={item.name} data={resumeData} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};