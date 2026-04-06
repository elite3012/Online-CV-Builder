import { Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomeFooter() {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "flex-end",
        textAlign: "center",
        borderTop: "0px solid #e0e0e0",
        mt: "auto",
        background: "linear-gradient(to bottom, #151414, #174851)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Link onClick={() => navigate("/terms")} underline="none" color="#f7fbff" fontSize="0.8rem" sx={{ cursor: "pointer" }}>
          Terms
        </Link>
        <Link onClick={() => navigate("/privacy")} underline="none" color="#f7fbff" fontSize="0.8rem" sx={{ cursor: "pointer" }}>
          Privacy
        </Link>
        <Link onClick={() => navigate("/contact")} underline="none" color="#f7fbff" fontSize="0.8rem" sx={{ cursor: "pointer" }}>
          Contact
        </Link>
      </Box>
    </Box>
  );
}