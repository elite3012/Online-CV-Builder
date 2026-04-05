// src/template/CreativeTemplate.jsx
import { Box, Typography, Chip, Grid } from "@mui/material";

export default function CreativeTemplate({ data }) {
  if (!data) return null;

  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.address,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean);

  return (
    <Box sx={{ minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto" }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: "#f43f5e", color: "white", p: 5, textAlign: "center" }}>
        <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: "2px", mb: 1 }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="h5" fontWeight="medium" sx={{ opacity: 0.9, mb: 3 }}>
          {data.title}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap", opacity: 0.8 }}>
          {contactItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2">{item}</Typography>
              {index < contactItems.length - 1 && <Typography variant="body2">•</Typography>}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ========================================================= */}
      {/* BODY CHÍNH                                                */}
      {/* ========================================================= */}
      <Box sx={{ p: 5 }}>
        
        {/* SUMMARY */}
        {data.summary && (
          <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, fontSize: "1.1rem", textAlign: "center", mb: 5, fontStyle: "italic", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            "{data.summary}"
          </Typography>
        )}

        <Grid container spacing={5}>
          {/* ----------------------------------------------------- */}
          {/* CỘT TRÁI (Kinh nghiệm, Học vấn, Dự án)                */}
          {/* ----------------------------------------------------- */}
          <Grid item xs={7}>
            
            {/* EXPERIENCE (Timeline Style) */}
            {data.experience && data.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  WORK EXPERIENCE
                </Typography>
                {data.experience.map((exp, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    <Typography variant="h6" fontWeight="bold" color="#1e293b">{exp.role}</Typography>
                    <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>{exp.company} | {exp.duration}</Typography>
                    {exp.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{exp.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* EDUCATION (Timeline Style) */}
            {data.education && data.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  EDUCATION
                </Typography>
                {data.education.map((edu, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    <Typography variant="h6" fontWeight="bold" color="#1e293b">{edu.degree}</Typography>
                    <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>{edu.school} | {edu.duration}</Typography>
                    {edu.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{edu.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* PROJECTS (Timeline Style) */}
            {data.projects && data.projects.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  KEY PROJECTS
                </Typography>
                {data.projects.map((proj, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography variant="h6" fontWeight="bold" color="#1e293b">{proj.name}</Typography>
                      {proj.link && <Typography variant="caption" sx={{ color: "#f43f5e", fontStyle: "italic", textDecoration: "underline", wordBreak: "break-word" }}>{proj.link}</Typography>}
                    </Box>
                    {proj.role && <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>Role: {proj.role}</Typography>}
                    {proj.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

          </Grid>

          {/* ----------------------------------------------------- */}
          {/* CỘT PHẢI (Kỹ năng, Chứng chỉ)                         */}
          {/* ----------------------------------------------------- */}
          <Grid item xs={5}>
            
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  EXPERTISE
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {data.skills.map((skill, idx) => (
                    <Chip
                      key={idx} label={skill}
                      sx={{ bgcolor: "#fff1f2", color: "#e11d48", fontWeight: "bold", justifyContent: "flex-start", p: 1, borderRadius: 2 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* CERTIFICATES (Card Style) */}
            {data.certificates && data.certificates.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  CERTIFICATIONS
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {data.certificates.map((cert, idx) => (
                    <Box key={idx} sx={{ bgcolor: "#fff1f2", p: 2, borderRadius: 2, borderLeft: "4px solid #f43f5e" }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="#1e293b">{cert.name}</Typography>
                      {cert.organization && <Typography variant="caption" color="#64748b" display="block" sx={{ mt: 0.5 }}>{cert.organization}</Typography>}
                      {cert.date && <Typography variant="caption" color="#f43f5e" fontWeight="bold" display="block">{cert.date}</Typography>}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          </Grid>
        </Grid>

      </Box>
    </Box>
  );
}