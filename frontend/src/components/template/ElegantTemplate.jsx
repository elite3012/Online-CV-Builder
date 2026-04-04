// src/template/ElegantTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function ElegantTemplate({ data }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        minHeight: "1122px",
        width: "794px",
        bgcolor: "white",
        boxShadow: 3,
        mx: "auto",
        p: 8,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          fontWeight="300"
          sx={{ letterSpacing: "4px", color: "#1f2937", mb: 1 }}
        >
          {data.name.toUpperCase()}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            letterSpacing: "2px",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          {data.title}
        </Typography>
        <Divider
          sx={{ my: 2, width: "100px", mx: "auto", borderColor: "#d1d5db" }}
        />
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          {data.contact.address} • {data.contact.phone} • {data.contact.email}
        </Typography>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="body1"
          sx={{ color: "#374151", lineHeight: 2, textAlign: "justify" }}
        >
          {data.summary}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        fontWeight="300"
        sx={{
          letterSpacing: "2px",
          color: "#1f2937",
          mb: 3,
          borderBottom: "1px solid #e5e7eb",
          pb: 1,
        }}
      >
        EXPERIENCE
      </Typography>
      {data.experience.map((exp, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: "#374151" }}
            >
              {exp.role}
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              {exp.duration}
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 1 }}>
            {exp.company}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#4b5563", lineHeight: 1.8 }}
          >
            {exp.desc}
          </Typography>
        </Box>
      ))}

      <Typography
        variant="h6"
        fontWeight="300"
        sx={{
          letterSpacing: "2px",
          color: "#1f2937",
          mb: 3,
          mt: 5,
          borderBottom: "1px solid #e5e7eb",
          pb: 1,
        }}
      >
        CORE SKILLS
      </Typography>
      <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 2 }}>
        {data.skills.join("   |   ")}
      </Typography>
    </Box>
  );
}
