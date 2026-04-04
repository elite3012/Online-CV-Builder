// src/pages/Dashboard.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tab,
  Tabs,
  Container,
} from "@mui/material";

//import data
import { templates } from "../data/templates";

//import components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { TemplateCard } from "../components/TemplateCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const tabCategories = [
    "All",
    "Modern",
    "Minimal",
    "Classic",
    "Creative",
    "Professional",
    "Elegant",
  ];

  // Tạo mảng mới chỉ chứa các template thỏa mãn điều kiện
  const filteredTemplates = templates.filter((template) => {
    if (activeTab === 0) return true; // Nếu chọn "All Templates" thì lấy hết

    const selectedCategory = tabCategories[activeTab];
    return template.tags.includes(selectedCategory); // Chỉ lấy template có chứa tag đang chọn
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb" }}>
      <Sidebar />

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

        {/* TOP NAVBAR */}
        <TopNavbar />

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
                {filteredTemplates.map((item) => (
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
