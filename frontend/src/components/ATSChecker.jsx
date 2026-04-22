// src/components/ATSChecker.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "motion/react";
import { apiService } from "../services/apiService";
import JDInput from "./JDInput";

const INITIAL_CHECKLIST = [
  { id: 1, label: "Use standard section headings", checked: false },
  { id: 2, label: "Avoid tables, graphics, and images", checked: false },
  { id: 3, label: "Use keywords from the job description", checked: false },
  { id: 4, label: "Use a simple readable font", checked: false },
  { id: 5, label: "Include measurable achievements", checked: false },
  { id: 6, label: "Save resume as PDF or DOCX", checked: false },
];

function buildChecklistFromResult(result) {
  const warnings = (result?.atsWarnings || []).map((warning) =>
    String(warning).toLowerCase(),
  );
  const matchedSkills = result?.matchedSkills?.length || 0;
  const missingSkills = result?.missingSkills?.length || 0;
  const score = Number(result?.score || 0);

  const hasFormattingWarning = warnings.some((warning) =>
    /format|font|table|image|read/.test(warning),
  );

  return [
    {
      id: 1,
      label: "Use standard section headings",
      checked: score >= 50 && !hasFormattingWarning,
    },
    {
      id: 2,
      label: "Avoid tables, graphics, and images",
      checked: !hasFormattingWarning,
    },
    {
      id: 3,
      label: "Use keywords from the job description",
      checked: matchedSkills >= missingSkills,
    },
    {
      id: 4,
      label: "Use a simple readable font",
      checked: !hasFormattingWarning,
    },
    {
      id: 5,
      label: "Include measurable achievements",
      checked: score >= 70 || matchedSkills >= 8,
    },
    {
      id: 6,
      label: "Save resume as PDF or DOCX",
      checked: true,
    },
  ];
}

export default function ATSChecker() {
  const [cvOptions, setCvOptions] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [loadingCvList, setLoadingCvList] = useState(true);
  const [cvListError, setCvListError] = useState("");

  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    let active = true;

    const loadResumes = async () => {
      try {
        const data = await apiService.getCVList();
        if (!active) {
          return;
        }

        const mapped = (data || []).map((cv) => ({
          id: cv.id,
          title: cv.title || `Resume #${cv.id}`,
        }));

        setCvOptions(mapped);
        if (mapped.length > 0) {
          setSelectedCvId(String(mapped[0].id));
        }
      } catch (err) {
        if (active) {
          setCvListError("Unable to load your resumes. Please try again.");
        }
      } finally {
        if (active) {
          setLoadingCvList(false);
        }
      }
    };

    loadResumes();
    return () => {
      active = false;
    };
  }, []);

  const completedCount = useMemo(
    () => checklist.filter((item) => item.checked).length,
    [checklist],
  );

  const handleAnalyzeResult = (result) => {
    setAnalysisResult(result);

    if (!result) {
      setChecklist(INITIAL_CHECKLIST);
      return;
    }

    setChecklist(buildChecklistFromResult(result));
  };

  const handleResetChecklist = () => {
    setChecklist(INITIAL_CHECKLIST);
    setAnalysisResult(null);
  };

  const handleMarkAllItems = () => {
    setChecklist((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const hasResumeOptions = cvOptions.length > 0;

  return (
    <Box sx={{ p: 4, mt: "80px", color: "white", minHeight: "100vh", maxWidth: "1200px", mx: "auto" }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          ATS Resume Checker
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Choose one of your saved resumes and analyze it against a job description.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
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
              gap: 2,
              transition: "0.2s",
              "&:hover": {
                borderColor: "#52b0c3",
                bgcolor: "rgba(82, 176, 195, 0.05)",
              },
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#52b0c3" }}>
              Select Resume
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Pick the resume you want to compare with the job description.
            </Typography>

            <TextField
              select
              fullWidth
              value={selectedCvId}
              onChange={(event) => setSelectedCvId(event.target.value)}
              disabled={loadingCvList || !hasResumeOptions}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                  "&.Mui-focused fieldset": { borderColor: "#52b0c3" },
                },
                "& .MuiSvgIcon-root": { color: "white" },
              }}
            >
              {cvOptions.map((cv) => (
                <MenuItem key={cv.id} value={String(cv.id)}>
                  {cv.title}
                </MenuItem>
              ))}
            </TextField>

            {loadingCvList && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} sx={{ color: "#52b0c3" }} />
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Loading your resumes...
                </Typography>
              </Box>
            )}

            {cvListError && (
              <Typography variant="caption" color="error">
                {cvListError}
              </Typography>
            )}

            {!loadingCvList && !hasResumeOptions && !cvListError && (
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                You do not have any saved resumes yet. Create one first to run ATS analysis.
              </Typography>
            )}
          </Paper>

          <Box sx={{ width: "100%" }}>
            <JDInput
              selectedCvId={selectedCvId ? Number(selectedCvId) : null}
              onAnalyzeResult={handleAnalyzeResult}
            />
          </Box>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: { xs: "100%", lg: 420 },
            borderRadius: 4,
            bgcolor: "white",
            color: "#102a43",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" fontWeight="900" sx={{ color: "#102a43", mb: 0.5 }}>
            ATS Checklist
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Does your format meet the standards?
          </Typography>

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

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#52b0c3", bgcolor: "rgba(82, 176, 195, 0.1)", px: 1.5, py: 0.5, borderRadius: 2 }}>
              {completedCount} / 6 passed
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                onClick={handleMarkAllItems}
                sx={{
                  color: "#52b0c3",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "rgba(82,176,195,0.1)" },
                }}
              >
                Mark all
              </Button>
              <Button
                size="small"
                onClick={handleResetChecklist}
                sx={{
                  color: "#94a3b8",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { color: "#f43f5e", bgcolor: "transparent" },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          {analysisResult && (
            <Typography variant="caption" sx={{ mt: 2, color: "#64748b" }}>
              Latest ATS score: {analysisResult.score}%
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}