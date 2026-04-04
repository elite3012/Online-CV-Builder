// src/templates/MinimalTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function MinimalTemplate({ data }) {
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
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER TẬP TRUNG */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="900"
          sx={{ color: "#111827", letterSpacing: "-1px", mb: 1 }}
        >
          {data.name.toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#6b7280", fontWeight: 400, mb: 2 }}
        >
          {data.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", justifyContent: "center", gap: 2 }}
        >
          <span>{data.contact.email}</span> | <span>{data.contact.phone}</span>{" "}
          | <span>{data.contact.address}</span>
        </Typography>
      </Box>

      <Divider sx={{ mb: 4, borderColor: "#000", borderWidth: 1 }} />

      {/* SUMMARY */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: "1px",
            mb: 1,
          }}
        >
          Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.8 }}>
          {data.summary}
        </Typography>
      </Box>

      {/* EXPERIENCE */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: "1px",
            mb: 2,
          }}
        >
          Professional Experience
        </Typography>
        {data.experience.map((exp, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color="#111827">
                {exp.role} @ {exp.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.duration}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#374151", lineHeight: 1.6 }}
            >
              - {exp.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* SKILLS */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: "1px",
            mb: 1,
          }}
        >
          Core Competencies
        </Typography>
        <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.8 }}>
          {data.skills.join(" • ")}
        </Typography>
      </Box>
    </Box>
  );
}
