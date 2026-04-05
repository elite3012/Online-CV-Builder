// src/template/ClassicTemplate.jsx
import { Box, Typography } from "@mui/material";

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
      {/* ========================================================= */}
      {/* CỘT TRÁI (Nhỏ hơn - Màu tối)                              */}
      {/* ========================================================= */}
      <Box sx={{ width: "30%", bgcolor: "#2c3e50", color: "#ecf0f1", p: 4 }}>
        
        <Box sx={{ width: 120, height: 120, bgcolor: "#bdc3c7", borderRadius: "50%", mx: "auto", mb: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h4" color="#2c3e50">
            {data.name ? data.name.charAt(0).toUpperCase() : "A"}
          </Typography>
        </Box>

        {/* CONTACT */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ borderBottom: "1px solid #ecf0f1", pb: 0.5, mb: 2 }}>
          CONTACT
        </Typography>
        {data.contact?.phone && <Typography variant="body2" sx={{ mb: 1, wordBreak: "break-word" }}>{data.contact.phone}</Typography>}
        {data.contact?.email && <Typography variant="body2" sx={{ mb: 1, wordBreak: "break-word" }}>{data.contact.email}</Typography>}
        {data.contact?.address && <Typography variant="body2" sx={{ mb: 1, wordBreak: "break-word" }}>{data.contact.address}</Typography>}
        {data.contact?.linkedin && <Typography variant="body2" sx={{ mb: 1, wordBreak: "break-word" }}>{data.contact.linkedin}</Typography>}
        {data.contact?.website && <Typography variant="body2" sx={{ mb: 3, wordBreak: "break-word" }}>{data.contact.website}</Typography>}

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ borderBottom: "1px solid #ecf0f1", pb: 0.5, mb: 2, mt: 3 }}>
              SKILLS
            </Typography>
            {data.skills.map((skill, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 0.5, wordBreak: "break-word" }}>
                • {skill}
              </Typography>
            ))}
          </>
        )}
      </Box>

      {/* ========================================================= */}
      {/* CỘT PHẢI (Rộng hơn - Nội dung chính)                      */}
      {/* ========================================================= */}
      <Box sx={{ width: "70%", p: 5, color: "#2c3e50" }}>
        
        {/* HEADER TÊN & CHỨC DANH */}
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, color: "#2c3e50", wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, fontStyle: "italic", color: "#7f8c8d", wordBreak: "break-word" }}>
          {data.title}
        </Typography>

        {/* PROFILE SUMMARY */}
        {data.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}>
              PROFILE
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word", textAlign: "justify" }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}>
              EXPERIENCE
            </Typography>
            {data.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ wordBreak: "break-word" }}>{exp.role}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic", wordBreak: "break-word", pr: 2 }}>{exp.company}</Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ flexShrink: 0 }}>{exp.duration}</Typography>
                </Box>
                {exp.desc && <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{exp.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}>
              EDUCATION
            </Typography>
            {data.education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ wordBreak: "break-word" }}>{edu.degree}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic", wordBreak: "break-word", pr: 2 }}>{edu.school}</Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ flexShrink: 0 }}>{edu.duration}</Typography>
                </Box>
                {edu.desc && <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{edu.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}>
              PROJECTS
            </Typography>
            {data.projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ wordBreak: "break-word", pr: 2 }}>{proj.name}</Typography>
                  {proj.link && <Typography variant="caption" sx={{ fontStyle: "italic", color: "#7f8c8d", wordBreak: "break-word", flexShrink: 0 }}>{proj.link}</Typography>}
                </Box>
                {proj.role && <Typography variant="subtitle2" sx={{ fontStyle: "italic", mb: 1, wordBreak: "break-word" }}>Role: {proj.role}</Typography>}
                {proj.desc && <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* CERTIFICATES */}
        {data.certificates && data.certificates.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid #2c3e50", pb: 0.5, mb: 2 }}>
              CERTIFICATIONS
            </Typography>
            {data.certificates.map((cert, idx) => (
              <Box key={idx} sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Box sx={{ pr: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2, wordBreak: "break-word" }}>{cert.name}</Typography>
                  {cert.organization && <Typography variant="body2" sx={{ fontStyle: "italic", color: "#7f8c8d", wordBreak: "break-word" }}>{cert.organization}</Typography>}
                </Box>
                {cert.date && <Typography variant="caption" fontWeight="bold" sx={{ flexShrink: 0 }}>{cert.date}</Typography>}
              </Box>
            ))}
          </Box>
        )}

      </Box>
    </Box>
  );
}