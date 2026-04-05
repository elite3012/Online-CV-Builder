import { createPortal } from "react-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "motion/react";
import CVRenderer from "./template/CVRenderer";

export default function PreviewModal({ isOpen, onClose, templateName, previewData }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", overflowY: "auto", cursor: "zoom-out" }}>
          <IconButton onClick={onClose} sx={{ position: "fixed", top: 20, right: 30, color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            <CloseIcon />
          </IconButton>
          <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ cursor: "default", marginBottom: "40px", backgroundColor: "white", borderRadius: "8px" }}>
            <CVRenderer templateName={templateName} data={previewData} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>, 
    document.body
  );
}