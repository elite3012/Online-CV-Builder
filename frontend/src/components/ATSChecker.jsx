// src/components/ATSChecker.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "motion/react";
import JDInput from "./JDInput";

const INITIAL_CHECKLIST = [
  { id: 1, label: "Use standard section headings", checked: false },
  { id: 2, label: "Avoid tables, graphics, and images", checked: false },
  { id: 3, label: "Use keywords from the job description", checked: false },
  { id: 4, label: "Use a simple readable font", checked: false },
  { id: 5, label: "Include measurable achievements", checked: false },
  { id: 6, label: "Save resume as PDF or DOCX", checked: false },
];

export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [scanResult, setScanResult] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setScanResult(false);
      setChecklist(INITIAL_CHECKLIST);
    }
  };

  const handleStartScan = () => {
    if (!file) return alert("Please upload a file first!");

    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(true);
      const results = [true, true, false, true, false, true];
      setChecklist((prev) =>
        prev.map((item, idx) => ({ ...item, checked: results[idx] })),
      );
    }, 2500);
  };

  const completedCount = checklist.filter((item) => item.checked).length;

  return (
    <Box sx={{ p: 4, mt: "80px", color: "white", minHeight: "100vh", maxWidth: "1200px", mx: "auto" }}>
      
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          AI Resume Checker
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Upload your resume and paste a Job Description to see how well you match the ATS filters.
        </Typography>
      </Box>

      {/* MAIN LAYOUT: CHIA 2 CỘT (STRETCH ĐỂ BẰNG NHAU) */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch", 
        }}
      >
        {/* CỘT TRÁI: UPLOAD + JD INPUT                              */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          
          {/* UPLOAD SECTION (Quay lại style nền tối, viền dashed) */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.05)",
              border: "2px dashed rgba(255,255,255,0.2)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "0.2s",
              "&:hover": { borderColor: "#52b0c3", bgcolor: "rgba(82, 176, 195, 0.05)" }
            }}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              id="upload-pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-pdf">
              <Box sx={{ cursor: "pointer", p: 3 }}>
                <CloudUploadIcon sx={{ fontSize: 60, color: "#52b0c3", mb: 2 }} />
                <Typography variant="h6" color="white" fontWeight="medium" sx={{ mb: 0.5 }}>
                  {file ? file.name : "Drop your CV here or click to upload"}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.5)">
                  Supports PDF or DOCX (Max 5MB)
                </Typography>
              </Box>
            </label>

            <AnimatePresence>
              {file && (
                <motion.div
                  key="check-button"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleStartScan}
                      disabled={isScanning}
                      sx={{
                        bgcolor: "#52b0c3",
                        px: 5,
                        py: 1.2,
                        borderRadius: 8,
                        fontWeight: "bold",
                        textTransform: "none", 
                        "&:hover": { bgcolor: "#3d94a7" },
                      }}
                    >
                      {isScanning ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Check with AI"}
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>

          {/* JD INPUT COMPONENT */}
          <Box sx={{ width: "100%" }}>
            <JDInput />
          </Box>
          
        </Box>

        {/* ======================================================== */}
        {/* CỘT PHẢI: ATS CHECKLIST (TỰ ĐỘNG GIÃN VỪA KHÍT CỘT TRÁI) */}
        {/* ======================================================== */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: { xs: "100%", lg: 420 },
            borderRadius: 4,
            bgcolor: "white",
            color: "#102a43",
            display: "flex", 
            flexDirection: "column", // Để sử dụng flexGrow bên trong
          }}
        >
          <Typography variant="h5" fontWeight="900" sx={{ color: "#102a43", mb: 0.5 }}>
            ATS Checklist
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Does your format meet the standards?
          </Typography>

          {/* BÍ KÍP 2: flexGrow: 1 và justifyContent: "space-evenly" để các mục tự động giãn cách đều nhau lấp đầy khoảng trống */}
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-evenly", my: 2, minHeight: "350px" }}>
            {checklist.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: item.checked ? "#52b0c3" : "#e2e8f0",
                  transition: "all 0.3s ease",
                  bgcolor: item.checked ? "rgba(82, 176, 195, 0.08)" : "transparent",
                }}
              >
                <Checkbox
                  checked={item.checked}
                  disableRipple
                  sx={{ p: 0, mr: 1.5 }}
                  icon={<Box sx={{ width: 22, height: 22, border: "2px solid #cbd5e1", borderRadius: 1.5 }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: "#52b0c3", fontSize: 26 }} />}
                />
                <Typography variant="body2" sx={{ fontWeight: item.checked ? "bold" : "medium", color: item.checked ? "#0f172a" : "#475569" }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#52b0c3", bgcolor: "rgba(82, 176, 195, 0.1)", px: 1.5, py: 0.5, borderRadius: 2 }}>
              {completedCount} / 6 passed
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setFile(null);
                setChecklist(INITIAL_CHECKLIST);
                setScanResult(false);
              }}
              sx={{ color: "#94a3b8", textTransform: "none", fontWeight: "bold", "&:hover": { color: "#f43f5e", bgcolor: "transparent" } }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Box>

    </Box>
  );
}