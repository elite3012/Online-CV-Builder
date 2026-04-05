{
  /* Internal Top Navbar  */
}
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";

export default function TopNavbar() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "0 0",
        alignItems: "center",
        p: 3,
        bgcolor: "#183c54e7", // Kính siêu mờ
        backdropFilter: "blur(5px)", // Hiệu ứng Glassmorphism
        border: "1px solid rgba(255, 255, 255, 0.2)",
        position: "fixed",
        zIndex: 1000,
        width: "calc(100% - 225px)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="900"
        color="white"
        sx={{ fontFamily: "'Helvetica', sans-serif" }}
      >
        Templates Gallery
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <TextField
          size="small"
          placeholder="Search templates..."
          variant="outlined"
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              bgcolor: "#def4c6e5",
              "& fieldset": { border: "none" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Avatar sx={{ bgcolor: "#52b0c3", width: 40, height: 40 }}>
          quý10z
        </Avatar>
      </Box>
    </Box>
  );
}
