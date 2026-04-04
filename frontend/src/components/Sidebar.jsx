{
  /*  SIDEBAR MENU */
}
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 225,
        bgcolor: "#1c7c54",
        color: "white",
        p: 2,
        display: "flex",
        position: "fixed",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 6,
          mt: 1,
          px: 1,
        }}
      >
        <CheckCircleIcon sx={{ color: "white", fontSize: 32 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontFamily: "Helvetica1c7c54, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          CVBuilder
        </Typography>
      </Box>

      {/* Menu Items */}
      <List
        sx={{
          flexGrow: 1,
          "& .MuiListItemButton-root": { borderRadius: 2, mb: 0.5 },
        }}
      >
        {[
          { text: "Overview", icon: <DashboardIcon /> },
          { text: "My Resumes", icon: <ArticleIcon /> },
          { text: "My Profile", icon: <PersonIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={index === 0}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                },
                "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiTypography-root": {
                  color: "white",
                  fontWeight: index === 0 ? 600 : 400,
                  fontSize: "0.9rem",
                },
                "&.Mui-selected .MuiListItemIcon-root": { color: "white" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Section (Log out) */}
      <Button
        startIcon={<LogoutIcon />}
        fullWidth
        sx={{
          textTransform: "none",
          color: "rgba(255,255,255,0.7)",
          justifyContent: "flex-start",
          px: 2,
          py: 1,
          "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" },
        }}
      >
        Log out
      </Button>
    </Box>
  );
}
