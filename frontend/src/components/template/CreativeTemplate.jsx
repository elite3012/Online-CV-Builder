// src/template/CreativeTemplate.jsx
import { Box, Typography, Chip, Grid } from "@mui/material";

export default function CreativeTemplate({ data }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        minHeight: "1122px",
        width: "794px",
        bgcolor: "white",
        boxShadow: 3,
        mx: "auto",
      }}
    >
      {/* HEADER RỰC RỠ */}
      <Box
        sx={{ bgcolor: "#f43f5e", color: "white", p: 5, textAlign: "center" }}
      >
        <Typography
          variant="h2"
          fontWeight="900"
          sx={{ letterSpacing: "2px", mb: 1 }}
        >
          {data.name.toUpperCase()}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="medium"
          sx={{ opacity: 0.9, mb: 3 }}
        >
          {data.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
            opacity: 0.8,
          }}
        >
          <Typography variant="body2">{data.contact.email}</Typography>
          <Typography variant="body2">•</Typography>
          <Typography variant="body2">{data.contact.phone}</Typography>
          <Typography variant="body2">•</Typography>
          <Typography variant="body2">{data.contact.address}</Typography>
        </Box>
      </Box>

      {/* BODY */}
      <Box sx={{ p: 5 }}>
        <Typography
          variant="body1"
          sx={{
            color: "#475569",
            lineHeight: 1.8,
            fontSize: "1.1rem",
            textAlign: "center",
            mb: 5,
            fontStyle: "italic",
          }}
        >
          "{data.summary}"
        </Typography>

        <Grid container spacing={5}>
          {/* CỘT KINH NGHIỆM */}
          <Grid item xs={7}>
            <Typography
              variant="h5"
              fontWeight="900"
              sx={{ color: "#f43f5e", mb: 3 }}
            >
              WORK EXPERIENCE
            </Typography>
            {data.experience.map((exp, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 4,
                  position: "relative",
                  pl: 3,
                  borderLeft: "2px solid #fda4af",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "-6px",
                    top: 0,
                    width: 10,
                    height: 10,
                    bgcolor: "#f43f5e",
                    borderRadius: "50%",
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                  {exp.role}
                </Typography>
                <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>
                  {exp.company} | {exp.duration}
                </Typography>
                <Typography
                  variant="body2"
                  color="#475569"
                  sx={{ lineHeight: 1.6 }}
                >
                  {exp.desc}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* CỘT KỸ NĂNG */}
          <Grid item xs={5}>
            <Typography
              variant="h5"
              fontWeight="900"
              sx={{ color: "#f43f5e", mb: 3 }}
            >
              EXPERTISE
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {data.skills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  sx={{
                    bgcolor: "#fff1f2",
                    color: "#e11d48",
                    fontWeight: "bold",
                    justifyContent: "flex-start",
                    p: 1,
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
