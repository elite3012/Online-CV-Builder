// src/template/ModernTemplate.jsx
import { Box, Typography, Divider, Chip } from "@mui/material";

export default function ModernTemplate({ data }) {
  if (!data) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", overflow: "hidden" }}>
      {/* CỘT TRÁI - SIDEBAR TỐI MÀU */}
      <Box sx={{ width: "35%", bgcolor: "#1e293b", color: "white", p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1 }}>
            {data.name}
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ color: "#cbd5e1" }}>
            {data.title}
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1, textTransform: "uppercase" }}>Contact</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>📧 {data.contact.email}</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>📱 {data.contact.phone}</Typography>
          <Typography variant="body2">📍 {data.contact.address}</Typography>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1, textTransform: "uppercase" }}>Skills</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {data.skills.map((skill, idx) => (
              <Chip key={idx} label={skill} size="small" sx={{ bgcolor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", borderRadius: 1 }} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* CỘT PHẢI - NỘI DUNG CHÍNH */}
      <Box sx={{ width: "65%", p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#1e293b", borderBottom: "2px solid #38bdf8", pb: 1, mb: 2, display: "inline-block" }}>
            Profile Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {data.summary}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#1e293b", borderBottom: "2px solid #38bdf8", pb: 1, mb: 2, display: "inline-block" }}>
            Experience
          </Typography>
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">{exp.role}</Typography>
                <Typography variant="caption" fontWeight="bold" color="#38bdf8">{exp.duration}</Typography>
              </Box>
              <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontStyle: "italic" }}>{exp.company}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>• {exp.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}