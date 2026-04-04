import { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Typography, Chip, Button } from "@mui/material";
import BorderGlow from "./reactbits/BorderGlow";
import { AnimatePresence, motion } from "motion/react";

export const TemplateCard = ({ item }) => {
  // Trạng thái mở/đóng Popup Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
            width: 250,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderRadius: "12px 12px 0 0",
              zIndex: -1,
            }}
          />

          <Box
            sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="#102a43"
              sx={{ fontFamily: "'Helvetica', sans-serif" }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 1.5,
                flexGrow: 1,
                fontSize: "0.5rem",
                lineHeight: 1.4,
              }}
            >
              {item.desc}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
              {item.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: "0.65rem",
                    height: 20,
                    bgcolor: "#f0f4f8",
                    color: "#102a43",
                  }}
                />
              ))}
            </Box>

            {/* --- CẬP NHẬT: Chia thành 2 nút Preview và Use Template --- */}
            <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsPreviewOpen(true)}
                sx={{
                  flex: 1,
                  textTransform: "none",
                  color: "#607d8b",
                  borderColor: "#e0e0e0",
                  "&:hover": { bgcolor: "#f5f5f5", borderColor: "#cfd8dc" },
                }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  flex: 1,
                  textTransform: "none",
                  bgcolor: "#52b0c3",
                  color: "white",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#3d94a7", boxShadow: "none" },
                }}
              >
                Use
              </Button>
            </Box>
          </Box>
        </Box>
      </BorderGlow>

      {/* --- PHẦN POPUP PREVIEW (Được dịch chuyển ra ngoài body bằng createPortal) --- */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsPreviewOpen(false)} // Bấm vào vùng xám sẽ thoát
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(30, 30, 30, 0.85)", // Khung xám đen
                  backdropFilter: "blur(5px)", // Hiệu ứng mờ nền xịn xò
                  zIndex: 99999, // Đảm bảo đè lên mọi thứ Navbar, Sidebar
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  cursor: "zoom-out", // Trỏ chuột thành kính lúp dấu trừ
                }}
              >
                <motion.img
                  src={item.image}
                  alt={item.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                  onClick={(e) => e.stopPropagation()} // Bấm vào bức ảnh sẽ KHÔNG bị thoát
                  style={{
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    cursor: "default",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};