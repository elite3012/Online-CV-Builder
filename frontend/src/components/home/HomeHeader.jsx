import { Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomeHeader() {
  const navigate = useNavigate();

  const headerLinkStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    "&:hover": { color: "#102a43" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        borderBottom: "1px solid #e0e0e0",
        height: 18,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        onClick={() => navigate("/")}
        sx={{
          color: "#102a43",
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            backgroundColor: "#52b0c3",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          =
        </span>
        CV Builder
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Link onClick={() => navigate("/templates")} underline="none" color="text.secondary" sx={headerLinkStyle}>
          Templates
        </Link>
        <Link onClick={() => navigate("/features")} underline="none" color="text.secondary" sx={headerLinkStyle}>
          Features
        </Link>
        <Link onClick={() => navigate("/help")} underline="none" color="text.secondary" sx={headerLinkStyle}>
          Help
        </Link>
      </Box>
    </Box>
  );
}