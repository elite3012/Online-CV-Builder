// src/template/Professional2Template.jsx
import { Box, Typography } from "@mui/material";

export default function Professional2Template({ data }) {
  if (!data) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
      
      {/* CỘT TRÁI (Nội dung chính) */}
      <Box sx={{ width: "65%", p: 5, pr: 4 }}>
        <Typography variant="h3" fontWeight="900" sx={{ color: "#0A2540", mb: 1, letterSpacing: "-1px" }}>
          {data.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "#636B74", mb: 4 }}>
          {data.title}
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ color: "#0A2540", borderBottom: "2px solid #0A2540", pb: 0.5, mb: 2 }}>
          EXECUTIVE SUMMARY
        </Typography>
        <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6, mb: 4 }}>
          {data.summary}
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ color: "#0A2540", borderBottom: "2px solid #0A2540", pb: 0.5, mb: 2 }}>
          WORK EXPERIENCE
        </Typography>
        {data.experience.map((exp, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540" }}>{exp.role}</Typography>
            <Typography variant="subtitle2" sx={{ color: "#636B74", mb: 1 }}>{exp.company} | {exp.duration}</Typography>
            <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6 }}>- {exp.desc}</Typography>
          </Box>
        ))}
      </Box>

      {/* CỘT PHẢI (Sidebar màu xám nhạt) */}
      <Box sx={{ width: "35%", bgcolor: "#F6F9FC", p: 5, pl: 4, borderLeft: "1px solid #E3E8EE" }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", mb: 2 }}>
          CONTACT INFO
        </Typography>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="body2" color="#3C4257">✉️ {data.contact.email}</Typography>
          <Typography variant="body2" color="#3C4257">📞 {data.contact.phone}</Typography>
          <Typography variant="body2" color="#3C4257">🏢 {data.contact.address}</Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", mb: 2 }}>
          EXPERTISE
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {data.skills.map((skill, idx) => (
            <Typography key={idx} variant="body2" sx={{ color: "#3C4257", bgcolor: "white", p: 1, border: "1px solid #E3E8EE", borderRadius: 1 }}>
              {skill}
            </Typography>
          ))}
        </Box>
      </Box>

    </Box>
  );
}