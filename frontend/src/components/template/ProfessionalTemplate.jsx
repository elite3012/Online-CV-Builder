// src/template/ProfessionalTemplate.jsx
import { Box, Typography } from "@mui/material";

export default function ProfessionalTemplate({ data }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        minHeight: "1122px",
        width: "794px",
        bgcolor: "white",
        boxShadow: 3,
        mx: "auto",
        p: 6,
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <Box sx={{ borderBottom: "2px solid #000", pb: 2, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="black">
          {data.name}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" color="#555">
          {data.title}
        </Typography>
        <Typography variant="body2" color="#333" sx={{ mt: 1 }}>
          {data.contact.email} | {data.contact.phone} | {data.contact.address}
        </Typography>
      </Box>

      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ textTransform: "uppercase", mb: 1, bgcolor: "#f0f0f0", p: 0.5 }}
      >
        Professional Summary
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 3, lineHeight: 1.5, color: "black" }}
      >
        {data.summary}
      </Typography>

      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ textTransform: "uppercase", mb: 1, bgcolor: "#f0f0f0", p: 0.5 }}
      >
        Experience
      </Typography>
      {data.experience.map((exp, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="black">
              {exp.role}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="black">
              {exp.duration}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="#333"
            sx={{ fontStyle: "italic", mb: 0.5 }}
          >
            {exp.company}
          </Typography>
          <Typography variant="body2" sx={{ color: "black", pl: 2 }}>
            • {exp.desc}
          </Typography>
        </Box>
      ))}

      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          textTransform: "uppercase",
          mb: 1,
          mt: 3,
          bgcolor: "#f0f0f0",
          p: 0.5,
        }}
      >
        Skills & Competencies
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {data.skills.map((skill, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{ width: "33%", mb: 0.5, color: "black" }}
          >
            • {skill}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
