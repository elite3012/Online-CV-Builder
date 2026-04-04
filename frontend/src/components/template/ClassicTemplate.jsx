// src/template/ClassicTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function ClassicTemplate({ data }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "1122px",
        width: "794px",
        bgcolor: "#faf9f6",
        boxShadow: 3,
        mx: "auto",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* CỘT TRÁI (Nhỏ hơn) */}
      <Box sx={{ width: "30%", bgcolor: "#2c3e50", color: "#ecf0f1", p: 4 }}>
        <Box
          sx={{
            width: 120,
            height: 120,
            bgcolor: "#bdc3c7",
            borderRadius: "50%",
            mx: "auto",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" color="#2c3e50">
            {data.name.charAt(0)}
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ borderBottom: "1px solid #ecf0f1", pb: 0.5, mb: 2 }}
        >
          CONTACT
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {data.contact.phone}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, wordBreak: "break-word" }}>
          {data.contact.email}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {data.contact.address}
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ borderBottom: "1px solid #ecf0f1", pb: 0.5, mb: 2 }}
        >
          SKILLS
        </Typography>
        {data.skills.map((skill, idx) => (
          <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
            • {skill}
          </Typography>
        ))}
      </Box>

      {/* CỘT PHẢI */}
      <Box sx={{ width: "70%", p: 5, color: "#2c3e50" }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: 1, color: "#2c3e50" }}
        >
          {data.name.toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, fontStyle: "italic", color: "#7f8c8d" }}
        >
          {data.title}
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}
        >
          PROFILE
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6 }}>
          {data.summary}
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}
        >
          EXPERIENCE
        </Typography>
        {data.experience.map((exp, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {exp.role}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
                {exp.company}
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {exp.duration}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {exp.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
