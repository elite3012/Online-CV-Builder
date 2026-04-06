// src/pages/support/Contact.jsx
import { Box, Typography, Container, TextField, Button, Paper } from "@mui/material";

export default function Contact() {
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&:hover fieldset": { borderColor: "#52b0c3" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
  };

  return (
    <Box sx={{ py: 12, bgcolor: "#050505", minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 5, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>Get in Touch</Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mb: 4 }}>Have questions? We'd love to hear from you.</Typography>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField fullWidth label="Name" sx={inputStyle} />
            <TextField fullWidth label="Email" sx={inputStyle} />
            <TextField fullWidth label="Message" multiline rows={4} sx={inputStyle} />
            <Button variant="contained" size="large" sx={{ bgcolor: "#52b0c3", mt: 2, fontWeight: "bold" }}>Send Message</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}