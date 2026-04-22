import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import ClearIcon from "@mui/icons-material/Clear";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { apiService } from "../services/apiService";

function normalizeMatchingResult(payload) {
  return {
    score: Number(payload?.score || 0),
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
    return "Unable to analyze this job description right now.";
  }

  try {
    const parsed = JSON.parse(error.message);
    if (parsed?.message) {
      return parsed.message;
    }
  } catch (_) {
    // Ignore JSON parsing errors and use the raw message fallback.
  }

  return error.message;
}

export default function JDInput({ selectedCvId, onAnalyzeResult, onAnalyze }) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleClearJD = () => {
    setJdText("");
    setError("");
    setResult(null);
    if (onAnalyzeResult) {
      onAnalyzeResult(null);
    }
  };

  const handleAnalyzeJD = async () => {
    if (!selectedCvId) {
      setError("Please choose a resume before analyzing the job description.");
      return;
    }

    if (!jdText.trim()) {
      setError("Please paste a Job Description first to analyze.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiService.analyzeJD(selectedCvId, jdText.trim());
      const normalizedResult = normalizeMatchingResult(response);

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
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#52b0c3", mb: 1 }}>
          Job Description Analysis
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
          Paste the Job Description to check how well your CV matches the ATS requirements.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={5}
          placeholder="Paste Job Description here..."
          variant="outlined"
          value={jdText}
          onChange={(e) => {
            setJdText(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          sx={{
            mb: 2,
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
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255,255,255,0.5)",
              opacity: 1,
            },
          }}
        />

        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
            * {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
            {loading ? "Analyzing..." : "Analyze JD"}
          </Button>

          {(jdText || result) && (
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
              Clear
            </Button>
          )}
        </Box>

        {/* MOCK RESULT PLACEHOLDER */}
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
                    ATS Match Score:
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
                  {/* Matched Skills */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleOutlineIcon color="success" fontSize="small" /> Matched Skills
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {result.matchedSkills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" color="success" variant="outlined" sx={{ color: "#4ade80", borderColor: "#4ade80" }} />
                      ))}
                    </Box>
                  </Box>

                  {/* Missing Skills */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <ErrorOutlineIcon color="error" fontSize="small" /> Missing Skills
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {result.missingSkills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" color="error" variant="outlined" sx={{ color: "#f87171", borderColor: "#f87171" }} />
                      ))}
                    </Box>
                  </Box>

                  {/* ATS Warnings */}
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

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Suggestions to Improve
                      </Typography>
                      {result.suggestions.map((sug, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "rgba(255,255,255,0.9)" }}>
                          ✓ {sug}
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