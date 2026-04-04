// src/template/Classic2Template.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function Classic2Template({ data }) {
  if (!data) return null;

  return (
    <Box sx={{ minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", p: 7, fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* HEADER */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#722F37", mb: 1, textTransform: "uppercase" }}>
          {data.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "#333", fontStyle: "italic", mb: 1 }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {data.contact.address} | {data.contact.phone} | {data.contact.email}
        </Typography>
      </Box>

      {/* Đường kẻ đôi cổ điển */}
      <Box sx={{ borderTop: "2px solid #722F37", borderBottom: "1px solid #722F37", height: "4px", mb: 4 }} />

      {/* SUMMARY */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 1 }}>
        Profile Summary
      </Typography>
      <Typography variant="body1" sx={{ color: "#000", lineHeight: 1.6, mb: 4, textAlign: "justify" }}>
        {data.summary}
      </Typography>

      {/* EXPERIENCE */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
        Professional Experience
      </Typography>
      {data.experience.map((exp, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#000" }}>{exp.company}</Typography>
            <Typography variant="body2" sx={{ color: "#000", fontWeight: "bold" }}>{exp.duration}</Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "#444", mb: 0.5 }}>{exp.role}</Typography>
          <Typography variant="body2" sx={{ color: "#000", lineHeight: 1.6 }}>• {exp.desc}</Typography>
        </Box>
      ))}

      {/* SKILLS */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2, mt: 4 }}>
        Core Proficiencies
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {data.skills.map((skill, idx) => (
          <Typography key={idx} variant="body2" sx={{ color: "#000", width: "45%" }}>
            ♦ {skill}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}