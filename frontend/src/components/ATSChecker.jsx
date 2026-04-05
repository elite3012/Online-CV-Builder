// src/components/ATSChecker.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "motion/react";

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

    // GIẢ LẬP AI QUÉT (Sẽ thay bằng gọi API sau này)
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(true);
      // Giả lập AI tìm thấy 4/6 tiêu chí đạt chuẩn
      const results = [true, true, false, true, false, true];
      setChecklist((prev) =>
        prev.map((item, idx) => ({ ...item, checked: results[idx] })),
      );
    }, 2500);
  };

  const completedCount = checklist.filter((item) => item.checked).length;

  return (
    <Box sx={{ p: 4, mt: "80px", color: "white", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        AI Resume Checker
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
      >
        Upload your resume to see how well it passes through ATS filters.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
        }}
      >
        {/* BÊN TRÁI: UPLOAD SECTION */}
        <Paper
          sx={{
            p: 4,
            flex: 1,
            width: "100%",
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.05)",
            border: "2px dashed rgba(255,255,255,0.2)",
            textAlign: "center",
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
            <Box sx={{ cursor: "pointer", p: 4 }}>
              <CloudUploadIcon sx={{ fontSize: 60, color: "#52b0c3", mb: 2 }} />
              <Typography variant="h6" color="white">
                {file ? file.name : "Drop your CV here or click to upload"}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                Supports PDF (Max 5MB)
              </Typography>
            </Box>
          </label>

          {file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                variant="contained"
                onClick={handleStartScan}
                disabled={isScanning}
                sx={{
                  mt: 2,
                  bgcolor: "#52b0c3",
                  px: 4,
                  borderRadius: 10,
                  "&:hover": { bgcolor: "#3d94a7" },
                }}
              >
                {isScanning ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Check with AI"
                )}
              </Button>
            </motion.div>
          )}
        </Paper>

        {/* BÊN PHẢI: CHECKLIST SECTION */}
        <Paper
          sx={{
            p: 4,
            width: { xs: "100%", md: 450 },
            borderRadius: 4,
            bgcolor: "white",
            color: "#102a43",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#52b0c3", mb: 1 }}
          >
            ATS Resume Checklist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Make sure your resume passes ATS filters
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {checklist.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  transition: "0.3s",
                  bgcolor: item.checked
                    ? "rgba(82, 176, 195, 0.05)"
                    : "transparent",
                }}
              >
                <Checkbox
                  checked={item.checked}
                  readOnly // Người dùng không được tự tick
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        border: "2px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  }
                  checkedIcon={<CheckCircleIcon sx={{ color: "#52b0c3" }} />}
                />
                <Typography
                  variant="body2"
                  sx={{ ml: 1, fontWeight: item.checked ? "bold" : "normal" }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {completedCount} / 6 completed
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setFile(null);
                setChecklist(INITIAL_CHECKLIST);
                setScanResult(false);
              }}
              sx={{ color: "#52b0c3", textTransform: "none" }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
