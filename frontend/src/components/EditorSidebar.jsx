import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function EditorSidebar({ sections, activeSection, setActiveSection, checkSectionStatus }) {
  return (
    <Box sx={{ width: "250px", minWidth: "250px", bgcolor: "white", borderRight: "1px solid #e0e0e0", p: 3, overflowY: "auto" }}>
      <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, letterSpacing: 1, display: "block" }}>SECTIONS</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sections.map((sec) => {
          const isActive = activeSection === sec;
          return (
            <Box key={sec} onClick={() => setActiveSection(sec)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, borderRadius: 2, cursor: "pointer", transition: "all 0.2s", bgcolor: isActive ? "rgba(82, 176, 195, 0.1)" : "transparent", color: isActive ? "#52b0c3" : "#455a64", fontWeight: isActive ? "bold" : "medium", "&:hover": { bgcolor: isActive ? "rgba(82, 176, 195, 0.1)" : "#f5f5f5" } }}>
              <Typography variant="body2" sx={{ fontWeight: "inherit" }}>{sec}</Typography>
              {checkSectionStatus(sec) ? <CheckCircleIcon color="success" sx={{ fontSize: 16 }} /> : <ErrorIcon color="error" sx={{ fontSize: 16, opacity: 0.5 }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}