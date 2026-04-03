// src/pages/Dashboard.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Chip,
  Tab,
  Tabs,
  Container,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
//import DarkVeil from "../components/reactbits/DarkVeil";
import BorderGlow from "../components/reactbits/BorderGlow";

// MOCK DATA CHO CÁC MẪU CV
const templates = [
  {
    id: 1,
    name: "Modern",
    desc: "Clean design with a colored header, perfect for tech professionals.",
    type: "Tech",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Modern", "Tech"],
  },
  {
    id: 2,
    name: "Classic",
    desc: "Traditional two-column layout with a sidebar for key information.",
    type: "Business",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Classic", "Corporate"],
  },
  {
    id: 3,
    name: "Minimal",
    desc: "Simple and clean design focusing purely on content clarity.",
    type: "Creative",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Minimal", "Simple"],
  },
  {
    id: 4,
    name: "Professional",
    desc: "Business-focused design with a highly balanced layout.",
    type: "Business",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Professional", "Business"],
  },
  {
    id: 5,
    name: "Creative",
    desc: "Bold accent colors and unique typography for creative roles.",
    type: "Creative",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Creative", "Design"],
  },
  {
    id: 6,
    name: "Elegant",
    desc: "Sophisticated centered design with highly refined typography.",
    type: "Creative",
    image:
      "https://res.cloudinary.com/drmcnkjkn/image/upload/v1764768247/peppa_ywb0wg.png",
    tags: ["Elegant", "Sophisticated"],
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  // CARD HIỂN THỊ TỪNG TEMPLATE
  const TemplateCard = ({ item }) => (
    <BorderGlow
      edgeSensitivity={30}
      backgroundColor="none"
      glowColor="190 80 80"
      borderRadius={12}
      glowRadius={80}
      glowIntensity={1.7}
      coneSpread={26}
      colors={["#1c7c54", "#52b0c3", "#def4c6"]}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          borderRadius: "12px 12px 0 0",
          zIndex: -1,
        }}
      />

      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="#102a43"
          sx={{ fontFamily: "'Helvetica', sans-serif" }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mb: 1.5,
            flexGrow: 1,
            fontSize: "0.5rem",
            lineHeight: 1.4,
          }}
        >
          {item.desc}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
          {item.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                fontSize: "0.65rem",
                height: 20,
                bgcolor: "#f0f4f8",
                color: "#102a43",
              }}
            />
          ))}
        </Box>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            textTransform: "none",
            color: "#52b0c3",
            borderColor: "#52b0c3",
            "&:hover": {
              borderColor: "#3d94a7",
              bgcolor: "rgba(82, 176, 195, 0.04)",
            },
          }}
        >
          Use Template
        </Button>
      </Box>
    </BorderGlow>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb" }}>
      {/*  SIDEBAR MENU */}
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

      {/* CONTENT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ml: "225px",
          bgcolor: "#050505",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/*} 
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <DarkVeil
            hueShift={45}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={1.5}
            scanlineFrequency={4.5}
            warpAmount={2.4}
          />
        </Box>
        */}
        {/* Internal Top Navbar  */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "0 0",
            alignItems: "center",
            p: 3,
            bgcolor: "#373f47ed", // Kính siêu mờ
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
                    <SearchIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <Avatar sx={{ bgcolor: "#52b0c3", width: 40, height: 40 }}>
              quý10z
            </Avatar>
          </Box>
        </Box>

        {/* MAIN BODY: GALLERY SECTION */}
        <Box
          sx={{
            p: 4,
            flexGrow: 1,
            mt: "80px",
            minHeight: "100vh",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              mb: 4,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#52b0c3"
                sx={{ fontFamily: "'Helvetica', sans-serif", mb: 1 }}
              >
                Choose Your Template
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Select a professional template that matches your style. You can
                change it anytime.
              </Typography>
            </Box>

            {/* Filter Tabs */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                borderBottom: 1,
                borderColor: "divider",
                mb: 4,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: "#52b0c3" } }}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: "medium",
                    color: "text.secondary",
                    "&.Mui-selected": { color: "#102a43", fontWeight: "bold" },
                  },
                }}
              >
                <Tab label="All Templates" />
                <Tab label="Modern" />
                <Tab label="Minimal" />
                <Tab label="Classic" />
                <Tab label="Creative" />
                <Tab label="Professional" />
                <Tab label="Elegant" />
              </Tabs>
            </Box>
            <Container maxWidth="md" disableGutters sx={{ mx: "auto" }}>
              {/* templates Grid */}
              <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-evenly" }}
              >
                {templates.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                    <TemplateCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
