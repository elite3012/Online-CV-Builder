import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import ClearIcon from "@mui/icons-material/Clear";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { apiService } from "../services/apiService";

const emptyJdFields = {
  jobTitle: "",
  company: "",
  responsibilities: "",
  requiredSkills: "",
  niceToHave: "",
  qualifications: "",
};

const fieldConfig = [
  {
    key: "jobTitle",
    label: "Target Job Title",
    placeholder: "Frontend Developer, Business Analyst, Product Manager...",
    minRows: 1,
  },
  {
    key: "company",
    label: "Company / Industry",
    placeholder: "Fintech, SaaS, ecommerce, consulting...",
    minRows: 1,
  },
  {
    key: "responsibilities",
    label: "Main Responsibilities",
    placeholder:
      "Paste 4-8 responsibilities. Keep verbs and domain keywords from the JD.",
    minRows: 4,
  },
  {
    key: "requiredSkills",
    label: "Required Skills",
    placeholder:
      "React, Spring Boot, SQL, stakeholder management, Figma, Agile...",
    minRows: 3,
  },
  {
    key: "qualifications",
    label: "Qualifications / Experience",
    placeholder:
      "Bachelor degree, 3+ years experience, English communication, certifications...",
    minRows: 3,
  },
  {
    key: "niceToHave",
    label: "Nice-to-have Keywords",
    placeholder:
      "Cloud, Docker, microservices, analytics, leadership, domain tools...",
    minRows: 3,
  },
];

function normalizeMatchingResult(payload, mode) {
  return {
    mode,
    score: Number(payload?.score || 0),
    atsPassed: Boolean(payload?.atsPassed),
    matchedSkills: Array.isArray(payload?.matchedSkills)
      ? payload.matchedSkills
      : [],
    missingSkills: Array.isArray(payload?.missingSkills)
      ? payload.missingSkills
      : [],
    atsWarnings: Array.isArray(payload?.atsWarnings) ? payload.atsWarnings : [],
    suggestions: Array.isArray(payload?.suggestions) ? payload.suggestions : [],
  };
}

function parseApiErrorMessage(error) {
  if (!error || !error.message) {
    return "Unable to analyze this resume right now.";
  }

  try {
    const parsed = JSON.parse(error.message);
    if (parsed?.message) {
      return parsed.message;
    }
  } catch {
    // Use the raw message below.
  }

  return error.message;
}

function buildStructuredJd(fields) {
  return [
    `Job Title: ${fields.jobTitle}`,
    `Company / Industry: ${fields.company}`,
    `Responsibilities: ${fields.responsibilities}`,
    `Required Skills: ${fields.requiredSkills}`,
    `Qualifications: ${fields.qualifications}`,
    `Nice-to-have: ${fields.niceToHave}`,
  ]
    .filter((line) => line.split(":").slice(1).join(":").trim())
    .join("\n\n");
}

export default function JDInput({ selectedCvId, onAnalyzeResult, onAnalyze }) {
  const [mode, setMode] = useState("match");
  const [jdFields, setJdFields] = useState(emptyJdFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const structuredJd = useMemo(() => buildStructuredJd(jdFields), [jdFields]);
  const hasStructuredInput = structuredJd.trim().length > 0;

  const handleClearJD = () => {
    setJdFields(emptyJdFields);
    setError("");
    setResult(null);
    if (onAnalyzeResult) {
      onAnalyzeResult(null);
    }
  };

  const handleFieldChange = (field, value) => {
    setJdFields((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleAnalyzeJD = async () => {
    if (!selectedCvId) {
      setError("Please choose a resume before analyzing.");
      return;
    }

    if (mode === "match" && !hasStructuredInput) {
      setError("Fill in at least one Job Description field before matching.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response =
        mode === "ats"
          ? await apiService.analyzeJD(selectedCvId, "", { atsOnly: true })
          : await apiService.analyzeJD(selectedCvId, structuredJd);
      const normalizedResult = normalizeMatchingResult(response, mode);

      setResult(normalizedResult);

      if (onAnalyzeResult) {
        onAnalyzeResult(normalizedResult);
      }
      if (onAnalyze) {
        onAnalyze(normalizedResult);
      }
    } catch (err) {
      setError(parseApiErrorMessage(err));
      setResult(null);
      if (onAnalyzeResult) {
        onAnalyzeResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const isAtsOnly = mode === "ats";

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.05)",
          color: "white",
          border: "2px dashed rgba(255,255,255,0.2)",
          transition: "0.2s",
          "&:hover": {
            borderColor: "#52b0c3",
            bgcolor: "rgba(82, 176, 195, 0.05)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#52b0c3", mb: 1 }}>
              Job Description Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Use ATS-only for resume structure, or fill focused JD fields for better matching.
            </Typography>
          </Box>

          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(_, nextMode) => {
              if (!nextMode) return;
              setMode(nextMode);
              setError("");
              setResult(null);
              if (onAnalyzeResult) onAnalyzeResult(null);
            }}
            size="small"
            sx={{
              bgcolor: "rgba(0,0,0,0.24)",
              borderRadius: 2,
              "& .MuiToggleButton-root": {
                color: "rgba(255,255,255,0.72)",
                borderColor: "rgba(255,255,255,0.16)",
                textTransform: "none",
                px: 2,
              },
              "& .Mui-selected": {
                color: "white !important",
                bgcolor: "rgba(82,176,195,0.28) !important",
              },
            }}
          >
            <ToggleButton value="match">
              <WorkOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              Match JD
            </ToggleButton>
            <ToggleButton value="ats">
              <FactCheckIcon fontSize="small" sx={{ mr: 1 }} />
              ATS only
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Alert
          severity={isAtsOnly ? "info" : "success"}
          sx={{
            mb: 3,
            bgcolor: isAtsOnly ? "rgba(82,176,195,0.12)" : "rgba(74,222,128,0.1)",
            color: "white",
            "& .MuiAlert-icon": { color: isAtsOnly ? "#52b0c3" : "#4ade80" },
          }}
        >
          {isAtsOnly
            ? "ATS-only checks resume structure, completeness, and keyword density without requiring a job description."
            : "For best matching, paste exact wording from the JD: responsibilities, required skills, qualifications, and repeated keywords."}
        </Alert>

        {!isAtsOnly && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            {fieldConfig.map((field) => (
              <TextField
                key={field.key}
                fullWidth
                multiline={field.minRows > 1}
                minRows={field.minRows}
                label={field.label}
                placeholder={field.placeholder}
                variant="outlined"
                value={jdFields[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                disabled={loading}
                sx={{
                  gridColumn:
                    field.key === "responsibilities" || field.key === "requiredSkills"
                      ? { md: "span 2" }
                      : "auto",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.2)",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#52b0c3",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.68)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#52b0c3" },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.45)",
                    opacity: 1,
                  },
                }}
              />
            ))}
          </Box>
        )}

        {!isAtsOnly && (
          <Box sx={{ mb: 2, color: "rgba(255,255,255,0.72)" }}>
            <Typography variant="subtitle2" sx={{ color: "#def4c6", mb: 1 }}>
              How to enter a high-quality JD
            </Typography>
            <Typography variant="body2">
              Keep the original keywords, split must-have skills from nice-to-have skills, include seniority and tools, and avoid rewriting the JD into generic text.
            </Typography>
          </Box>
        )}

        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
            * {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={handleAnalyzeJD}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{
              bgcolor: "#52b0c3",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#3d94a7" },
            }}
          >
            {loading ? "Analyzing..." : isAtsOnly ? "Check ATS Only" : "Analyze JD Match"}
          </Button>

          {(hasStructuredInput || result) && !isAtsOnly && (
            <Button
              variant="outlined"
              onClick={handleClearJD}
              startIcon={<ClearIcon />}
              disabled={loading}
              sx={{
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.3)",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { borderColor: "white", color: "white", bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              Clear JD
            </Button>
          )}
        </Box>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 4, pt: 3, borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {result.mode === "ats" ? "ATS Structure Score:" : "ATS Match Score:"}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ ml: 2, color: result.score >= 80 ? "#4ade80" : "#fbbf24" }}
                  >
                    {result.score}%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {result.mode !== "ats" && (
                    <>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleOutlineIcon color="success" fontSize="small" /> Matched Keywords
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {result.matchedSkills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="success" variant="outlined" sx={{ color: "#4ade80", borderColor: "#4ade80" }} />
                          ))}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                          <ErrorOutlineIcon color="error" fontSize="small" /> Missing Keywords
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {result.missingSkills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="error" variant="outlined" sx={{ color: "#f87171", borderColor: "#f87171" }} />
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                  {result.atsWarnings.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningAmberIcon color="warning" fontSize="small" /> ATS Warnings
                      </Typography>
                      {result.atsWarnings.map((warn, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#fbbf24" }}>
                          - {warn}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {result.suggestions.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Suggestions to Improve
                      </Typography>
                      {result.suggestions.map((sug, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "rgba(255,255,255,0.9)" }}>
                          - {sug}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </Box>
  );
}
