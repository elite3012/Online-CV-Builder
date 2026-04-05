import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function EditorToolbar({
  onBack,
  cvTitle,
  setCvTitle,
  isEditingTitle,
  setIsEditingTitle,
  templateName,
  saveStatus,
  onPreview,
  onExport,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
        zIndex: 10,
        borderRadius: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={onBack}
          size="small"
          sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        {isEditingTitle ? (
          <TextField
            size="small"
            value={cvTitle}
            autoFocus
            onChange={(e) => setCvTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            sx={{ width: 150 }}
          />
        ) : (
          <Typography
            variant="h6"
            fontWeight="bold"
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {cvTitle}
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={() => setIsEditingTitle(!isEditingTitle)}
        >
          <EditIcon fontSize="small" color="action" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Template: <b>{templateName || "Unknown"}</b>
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography
          variant="body2"
          color={saveStatus === "Saved" ? "success.main" : "warning.main"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            width: 95,
            whiteSpace: "nowrap",
          }}
        >
          {saveStatus === "Saved" ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <ErrorIcon fontSize="small" />
          )}{" "}
          {saveStatus}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onPreview}
          sx={{
            color: "#102a43",
            borderColor: "#e0e0e0",
            textTransform: "none",
          }}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onExport}
          sx={{
            bgcolor: "#52b0c3",
            "&:hover": { bgcolor: "#3d94a7" },
            textTransform: "none",
          }}
        >
          Export
        </Button>
      </Box>
    </Paper>
  );
}
