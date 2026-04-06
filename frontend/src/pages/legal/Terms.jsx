// src/pages/legal/Terms.jsx (Sample for both)
import { Box, Typography, Container, Paper } from "@mui/material";

export default function Terms() {
  return (
    <Box sx={{ py: 12, bgcolor: "#050505", minHeight: "100vh", color: "white" }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>Terms of Service</Typography>
        <Paper sx={{ p: 4, bgcolor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
          <Typography variant="h6" color="white" gutterBottom>1. Acceptance of Terms</Typography>
          <Typography paragraph>By accessing CVBuilder, you agree to be bound by these terms...</Typography>
          <Typography variant="h6" color="white" gutterBottom sx={{ mt: 3 }}>2. User Responsibilities</Typography>
          <Typography paragraph>Users are responsible for the accuracy of the data entered into their CVs...</Typography>
          {/* Add more sections as needed */}
        </Paper>
      </Container>
    </Box>
  );
}