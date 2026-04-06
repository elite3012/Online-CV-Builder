import { Box, Typography, Container, Grid, Paper, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import SpeedIcon from "@mui/icons-material/Speed";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SecurityIcon from "@mui/icons-material/Security";
import DevicesIcon from "@mui/icons-material/Devices";

import HomeHeader from "../../components/home/HomeHeader";

const FEATURES = [
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "AI ATS Checker",
    desc: "Simulate how major Applicant Tracking Systems view your resume. Get instant feedback and keyword suggestions to rank higher in recruiter searches."
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "9+ Premium Templates",
    desc: "Access a curated collection of professional, recruiter-approved templates designed to highlight your strengths and career achievements."
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "Real-time Editor",
    desc: "Experience seamless resume building with our live preview editor. Craft a high-quality resume in under 10 minutes with zero technical hassle."
  },
  {
    icon: <PictureAsPdfIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "One-click Export",
    desc: "Download your resume as a high-fidelity, A4-standard PDF. Our export engine ensures text remains fully searchable for ATS software."
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "Fully Responsive",
    desc: "Access and edit your professional profile anytime, anywhere. Our platform works flawlessly across mobile, tablet, and desktop devices."
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "#52b0c3" }} />,
    title: "Data Privacy",
    desc: "Your information is protected with industry-standard encryption. We value your privacy and never share your personal data with third parties."
  }
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "white" }}>
      
      <HomeHeader /> 
        <Box sx={{ flexGrow: 1, py: 12, bgcolor: "#050505", color: "white" }}>
        <Container maxWidth="lg">
          {/* HEADER SECTION */}
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography variant="overline" sx={{ letterSpacing: 4, color: "#52b0c3", fontWeight: "bold" }}>
              POWERFUL TOOLS
            </Typography>
            <Typography variant="h2" fontWeight="900" sx={{ mt: 2, mb: 3, fontSize: { xs: "2.8rem", md: "3.5rem" } }}>
              Everything you need <br /> to land your dream job
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: "#52b0c3", mx: "auto", borderRadius: 2 }} />
          </Box>

          {/* FEATURES GRID */}
          <Grid container spacing={4}>
            {FEATURES.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 5, 
                    height: "100%",
                    borderRadius: 5, 
                    bgcolor: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      bgcolor: "rgba(255,255,255,0.04)", 
                      borderColor: "#52b0c3",
                      transform: "translateY(-8px)",
                      boxShadow: "0 10px 30px rgba(82, 176, 195, 0.1)"
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* CTA SECTION */}
          <Box sx={{ mt: 15, textAlign: "center" }}>
            <Stack spacing={4} alignItems="center">
              <Typography variant="h4" fontWeight="bold">
                Ready to stand out from the crowd?
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate("/login")}
                sx={{ 
                  bgcolor: "#52b0c3", px: 6, py: 1.8, borderRadius: 2, fontWeight: "bold", 
                  textTransform: "none", fontSize: "1.1rem",
                  "&:hover": { bgcolor: "#3d94a7" } 
                }}
              >
                Start Building Your Resume Now
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}