import { Box, Typography, Grid, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import HomeHeader from "../../components/home/HomeHeader";

export default function TemplatesPage() {
  const navigate = useNavigate();

  // Component vẽ các khối hình học đại diện cho CV
  const TemplatePlaceholder = () => (
    <Box sx={{ width: "100%", height: "350px", bgcolor: "#121212", borderRadius: 3, p: 3, position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
      <Stack spacing={2}>
        <Box sx={{ width: "40%", height: "20px", bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }} />
        <Box sx={{ width: "100%", height: "10px", bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }} />
        <Box sx={{ width: "90%", height: "10px", bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }} />
        <Box sx={{ width: "100%", height: "80px", bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, mt: 2 }} />
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} key={i}>
              <Box sx={{ width: "100%", height: "40px", bgcolor: "rgba(255,255,255,0.03)", borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Stack>
      {/* Overlay khóa */}
      <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(5,5,5,0.2)", borderRadius: 3, backdropFilter: "blur(2px)" }}>
        <LockIcon sx={{ color: "rgba(82, 176, 195, 0.5)", fontSize: 40 }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "white" }}>
      
      <HomeHeader />

      <Box sx={{ flexGrow: 1, py: 12, bgcolor: "#050505", color: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon sx={{ color: "#52b0c3", fontSize: 20 }} />
              <Typography variant="overline" sx={{ letterSpacing: 3, color: "#52b0c3", fontWeight: "bold" }}>
                Premium Collection
              </Typography>
            </Stack>
            <Typography variant="h2" fontWeight="900" sx={{ mb: 3, fontSize: { xs: "2.5rem", md: "3.5rem" } }}>
              9 Ready-to-Use <br /> Professionally Crafted
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.5)", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
              All templates are optimized for ATS systems and can be fully customized after logging in.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.02)" } }}>
                  <TemplatePlaceholder />
                  <Typography variant="subtitle2" sx={{ mt: 2, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                    Template Structure 0{i + 1}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate("/login")}
              sx={{ 
                bgcolor: "#52b0c3", px: 8, py: 2, borderRadius: 2, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem",
                boxShadow: "0 0 20px rgba(82, 176, 195, 0.3)",
                "&:hover": { bgcolor: "#3d94a7", boxShadow: "0 0 30px rgba(82, 176, 195, 0.5)" }
              }}
            >
              Log In to Unlock All Templates
            </Button>
            <Typography variant="body2" sx={{ mt: 3, color: "rgba(255,255,255,0.4)" }}>
              Free trials • No credit card required
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}