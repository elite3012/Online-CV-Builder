// src/template/Modern2Template.jsx
import { Box, Typography, Grid } from "@mui/material";

export default function Modern2Template({ data }) {
  if (!data) return null;

  return (
    <Box sx={{ minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", overflow: "hidden" }}>
      
      {/* HEADER KHỐI MÀU */}
      <Grid container sx={{ height: "180px" }}>
        <Grid item xs={8} sx={{ bgcolor: "#0f172a", p: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 0.5 }}>{data.name}</Typography>
          <Typography variant="h6" color="#10b981">{data.title}</Typography>
        </Grid>
        <Grid item xs={4} sx={{ bgcolor: "#10b981", p: 4, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1 }}>
          <Typography variant="caption" fontWeight="bold" color="#0f172a">EMAIL</Typography>
          <Typography variant="body2" color="white" sx={{ mb: 1 }}>{data.contact.email}</Typography>
          <Typography variant="caption" fontWeight="bold" color="#0f172a">PHONE</Typography>
          <Typography variant="body2" color="white">{data.contact.phone}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ p: 5 }}>
        {/* SUMMARY */}
        <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, mb: 5, pl: 2, borderLeft: "4px solid #10b981" }}>
          {data.summary}
        </Typography>

        <Grid container spacing={6}>
          {/* EXPERIENCE */}
          <Grid item xs={8}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="span" sx={{ width: 12, height: 12, bgcolor: "#10b981", display: "inline-block" }} /> EXPERIENCE
            </Typography>
            {data.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">{exp.role}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" color="#64748b">{exp.company}</Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: "#10b981", bgcolor: "#ecfdf5", px: 1, py: 0.5, borderRadius: 1 }}>
                    {exp.duration}
                  </Typography>
                </Box>
                <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>{exp.desc}</Typography>
              </Box>
            ))}
          </Grid>

          {/* SKILLS */}
          <Grid item xs={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="span" sx={{ width: 12, height: 12, bgcolor: "#10b981", display: "inline-block" }} /> SKILLS
            </Typography>
            {data.skills.map((skill, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography variant="body2" fontWeight="bold" color="#334155" sx={{ mb: 0.5 }}>{skill}</Typography>
                {/* Thanh kỹ năng mô phỏng */}
                <Box sx={{ width: "100%", height: 6, bgcolor: "#e2e8f0", borderRadius: 3 }}>
                  <Box sx={{ width: `${Math.floor(Math.random() * 30) + 70}%`, height: "100%", bgcolor: "#10b981", borderRadius: 3 }} />
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}