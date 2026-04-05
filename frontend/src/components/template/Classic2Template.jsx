// src/template/Classic2Template.jsx
import { Box, Typography } from "@mui/material";

export default function Classic2Template({ data }) {
  if (!data) return null;

  // Tự động gom các thông tin liên lạc có sẵn, cách nhau bởi dấu " | "
  const contactItems = [
    data.contact?.address,
    data.contact?.phone,
    data.contact?.email,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean).join(" | ");

  return (
    <Box sx={{ minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", p: 7, fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* HEADER */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#722F37", mb: 1, textTransform: "uppercase", wordBreak: "break-word" }}>
          {data.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "#333", fontStyle: "italic", mb: 1, wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ wordBreak: "break-word" }}>
          {contactItems}
        </Typography>
      </Box>

      {/* Đường kẻ đôi cổ điển */}
      <Box sx={{ borderTop: "2px solid #722F37", borderBottom: "1px solid #722F37", height: "4px", mb: 4 }} />

      {/* SUMMARY */}
      {data.summary && (
        <>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 1 }}>
            Profile Summary
          </Typography>
          <Typography variant="body1" sx={{ color: "#000", lineHeight: 1.6, mb: 4, textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        </>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
            Professional Experience
          </Typography>
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#000", wordBreak: "break-word" }}>{exp.company}</Typography>
                <Typography variant="body2" sx={{ color: "#000", fontWeight: "bold", flexShrink: 0, ml: 2 }}>{exp.duration}</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "#444", mb: 0.5, wordBreak: "break-word" }}>{exp.role}</Typography>
              {exp.desc && <Typography variant="body2" sx={{ color: "#000", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {exp.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
            Education
          </Typography>
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#000", wordBreak: "break-word" }}>{edu.school}</Typography>
                <Typography variant="body2" sx={{ color: "#000", fontWeight: "bold", flexShrink: 0, ml: 2 }}>{edu.duration}</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "#444", mb: 0.5, wordBreak: "break-word" }}>{edu.degree}</Typography>
              {edu.desc && <Typography variant="body2" sx={{ color: "#000", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {edu.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
            Key Projects
          </Typography>
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#000", wordBreak: "break-word" }}>{proj.name}</Typography>
                {proj.link && <Typography variant="body2" sx={{ color: "#000", fontStyle: "italic", wordBreak: "break-word", flexShrink: 0, ml: 2 }}>{proj.link}</Typography>}
              </Box>
              {proj.role && <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "#444", mb: 0.5, wordBreak: "break-word" }}>{proj.role}</Typography>}
              {proj.desc && <Typography variant="body2" sx={{ color: "#000", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {proj.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* CERTIFICATES */}
      {data.certificates && data.certificates.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
            Certifications
          </Typography>
          {data.certificates.map((cert, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
              <Typography variant="body1" sx={{ color: "#000", fontWeight: "bold", wordBreak: "break-word", pr: 2 }}>♦ {cert.name}</Typography>
              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                {cert.organization && <Typography variant="body2" component="span" sx={{ fontStyle: "italic", color: "#444", mr: 1, wordBreak: "break-word" }}>{cert.organization}</Typography>}
                {cert.date && <Typography variant="body2" component="span" sx={{ color: "#000" }}>({cert.date})</Typography>}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#722F37", textTransform: "uppercase", mb: 2 }}>
            Core Proficiencies
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {data.skills.map((skill, idx) => (
              <Typography key={idx} variant="body2" sx={{ color: "#000", width: "45%", wordBreak: "break-word" }}>
                ♦ {skill}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
}