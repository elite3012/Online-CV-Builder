import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import ClearIcon from "@mui/icons-material/Clear";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function JDInput({ onAnalyze }) {
  // --- STATE ---
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  /* Suggested result structure for future AI API integration:
    {
      score: 85,
      matchedSkills: ["React", "JavaScript", "Spring Boot"],
      missingSkills: ["Docker", "Kubernetes"],
      atsWarnings: ["Avoid tables", "Use standard headings"],
      suggestions: ["Add more metrics to your experience section"]
    }
  */

  // --- HANDLERS ---
  const handleClearJD = () => {
    setJdText("");
    setError("");
    setResult(null);
  };

  const handleAnalyzeJD = () => {
    if (!jdText.trim()) {
      setError("Please paste a Job Description first to analyze.");
      return;
    }
    setError("");
    setLoading(true);

    // MOCK API CALL - Replace with real API call (e.g., apiService.analyzeJD) later
    setTimeout(() => {
      setLoading(false);
      setResult({
        score: 82,
        matchedSkills: ["React", "Design Patterns", "UI/UX"],
        missingSkills: ["GraphQL", "CI/CD Pipeline"],
        atsWarnings: ["Missing some core keywords from JD"],
        suggestions: ["Incorporate the missing skills naturally into your work history"],
      });
      
      if (onAnalyze) {
        onAnalyze();
      }
    }, 2000);
  };

  // --- RENDER ---
  return (
    <Box sx={{ mt: 4, width: "100%" }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: "white",
          color: "#102a43",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#52b0c3", mb: 1 }}>
          Job Description Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
            }
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
            disabled={loading}
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
                color: "#64748b",
                borderColor: "#cbd5e1",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { borderColor: "#94a3b8", bgcolor: "transparent" },
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
              <Box sx={{ mt: 4, pt: 3, borderTop: "1px dashed #cbd5e1" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    ATS Match Score:
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ ml: 2, color: result.score >= 80 ? "#22c55e" : "#f59e0b" }}
                  >
                    {result.score}%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Matched Skills */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleOutlineIcon color="success" fontSize="small" /> Matched Skills
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {result.matchedSkills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" color="success" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  {/* Missing Skills */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <ErrorOutlineIcon color="error" fontSize="small" /> Missing Skills
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {result.missingSkills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" color="error" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  {/* ATS Warnings */}
                  {result.atsWarnings.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningAmberIcon color="warning" fontSize="small" /> ATS Warnings
                      </Typography>
                      {result.atsWarnings.map((warn, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#f59e0b" }}>
                          - {warn}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        💡 Suggestions to Improve
                      </Typography>
                      {result.suggestions.map((sug, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#102a43" }}>
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