// src/components/TopNavbar.jsx
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";

export default function TopNavbar({
  title,
  searchQuery = "",
  onSearchChange,
  searchEnabled = true,
}) {
  const searchPlaceholder = title === "Overview"
    ? "Search templates..."
    : `Search in ${title}...`;

  const handleSearchInputChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        bgcolor: "#183c54e7",
        backdropFilter: "blur(100px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        zIndex: 1000,
        width: "calc(100% - 225px)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="900"
        color="white"
        sx={{
          fontFamily: "'Helvetica', sans-serif",
          textTransform: "capitalize"
        }}
      >
        {title === "Overview" ? "Templates Gallery" : title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <TextField
          size="small"
          value={searchQuery}
          onChange={handleSearchInputChange}
          disabled={!searchEnabled}
          placeholder={
            searchEnabled
              ? searchPlaceholder
              : "Search unavailable in this section"
          }
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
        <Avatar
          sx={{
            bgcolor: "#52b0c3",
            width: 40,
            height: 40,
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}
        >
          QUY
        </Avatar>
      </Box>
    </Box>
  );
}