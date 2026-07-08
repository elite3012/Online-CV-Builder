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
    analysisEngine: payload?.analysisEngine || "unknown",
    semanticScore:
      typeof payload?.semanticScore === "number" ? payload.semanticScore : null,
    keywordCoverage:
      typeof payload?.keywordCoverage === "number" ? payload.keywordCoverage : null,
    sectionCoverage:
      typeof payload?.sectionCoverage === "number" ? payload.sectionCoverage : null,
    strengths: Array.isArray(payload?.strengths) ? payload.strengths : [],
    focusAreas: Array.isArray(payload?.focusAreas) ? payload.focusAreas : [],
    evidenceHighlights: Array.isArray(payload?.evidenceHighlights)
      ? payload.evidenceHighlights
      : [],
    traceId: payload?.traceId || "",
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

export default function JDInput({ selectedCvId, onAnalyzeResult, onAnalyze }) {
  const [mode, setMode] = useState("match");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const normalizedJdText = useMemo(() => jdText.trim(), [jdText]);
  const hasJdInput = normalizedJdText.length > 0;

  const handleClearJD = () => {
    setJdText("");
    setError("");
    setResult(null);
    if (onAnalyzeResult) {
      onAnalyzeResult(null);
    }
  };

  const handleJdTextChange = (value) => {
    setJdText(value);
    if (error) setError("");
  };

  const handleAnalyzeJD = async () => {
    if (!selectedCvId) {
      setError("Please choose a resume before analyzing.");
      return;
    }

    if (mode === "match" && !hasJdInput) {
      setError("Paste the full job description before matching.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response =
        mode === "ats"
          ? await apiService.analyzeJD(selectedCvId, "", { atsOnly: true, engine: "auto" })
          : await apiService.analyzeJD(selectedCvId, normalizedJdText, { engine: "auto" });
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
              AI Resume Intelligence
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Run ATS readiness checks or compare your resume with a job description using semantic matching.
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
              Semantic Match
            </ToggleButton>
            <ToggleButton value="ats">
              <FactCheckIcon fontSize="small" sx={{ mr: 1 }} />
              ATS Readiness
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
            ? "ATS readiness checks structure, completeness, skills visibility, and evidence density without requiring a job description."
            : "Semantic matching compares your resume language, skills, and experience evidence against the target JD for stronger AI-assisted feedback."}
        </Alert>

        {!isAtsOnly && (
          <TextField
            fullWidth
            multiline
            minRows={12}
            label="Paste Full Job Description"
            placeholder={`Paste the complete JD here. Include the original title, responsibilities, requirements, skills, qualifications, and nice-to-have notes if they exist.\n\nThe AI will detect sections and important language automatically.`}
            variant="outlined"
            value={jdText}
            onChange={(event) => handleJdTextChange(event.target.value)}
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
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.68)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#52b0c3" },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.45)",
                opacity: 1,
              },
            }}
          />
        )}

        {!isAtsOnly && (
          <Box sx={{ mb: 2, color: "rgba(255,255,255,0.72)" }}>
            <Typography variant="subtitle2" sx={{ color: "#def4c6", mb: 1 }}>
              How it works
            </Typography>
            <Typography variant="body2">
              Paste the JD as-is. The AI language pipeline will identify responsibilities, requirements, tools, seniority, and keyword signals automatically.
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
            {loading ? "Analyzing..." : isAtsOnly ? "Check ATS Readiness" : "Run Semantic Match"}
          </Button>

          {(hasJdInput || result) && !isAtsOnly && (
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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 3, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {result.mode === "ats" ? "ATS Readiness Score:" : "AI Match Score:"}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ ml: 2, color: result.score >= 80 ? "#4ade80" : "#fbbf24" }}
                  >
                    {result.score}%
                  </Typography>
                  </Box>
                  <Chip
                    label={result.analysisEngine}
                    size="small"
                    sx={{
                      color: "#c4f1f9",
                      borderColor: "rgba(82,176,195,0.45)",
                      bgcolor: "rgba(82,176,195,0.12)",
                    }}
                    variant="outlined"
                  />
                  {result.traceId && (
                    <Chip
                      label={`trace ${result.traceId.slice(0, 8)}`}
                      size="small"
                      sx={{
                        color: "#fde68a",
                        borderColor: "rgba(253,230,138,0.45)",
                        bgcolor: "rgba(253,230,138,0.12)",
                      }}
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(result.semanticScore !== null ||
                    result.keywordCoverage !== null ||
                    result.sectionCoverage !== null) && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        gap: 1.5,
                      }}
                    >
                      {result.semanticScore !== null && (
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                            Semantic Similarity
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {result.semanticScore}%
                          </Typography>
                        </Box>
                      )}
                      {result.keywordCoverage !== null && (
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                            Keyword Coverage
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {result.keywordCoverage}%
                          </Typography>
                        </Box>
                      )}
                      {result.sectionCoverage !== null && (
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                            Section Coverage
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {result.sectionCoverage}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {result.mode !== "ats" && (
                    <>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleOutlineIcon color="success" fontSize="small" /> Matched Signals
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {result.matchedSkills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="success" variant="outlined" sx={{ color: "#4ade80", borderColor: "#4ade80" }} />
                          ))}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                          <ErrorOutlineIcon color="error" fontSize="small" /> Missing Signals
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

                  {result.strengths.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Strengths
                      </Typography>
                      {result.strengths.map((item, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#bbf7d0" }}>
                          - {item}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {result.focusAreas.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Focus Areas
                      </Typography>
                      {result.focusAreas.map((item, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#fecaca" }}>
                          - {item}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {result.evidenceHighlights.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Grounded Evidence
                      </Typography>
                      {result.evidenceHighlights.map((item, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 4, color: "#bfdbfe" }}>
                          - {item}
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
