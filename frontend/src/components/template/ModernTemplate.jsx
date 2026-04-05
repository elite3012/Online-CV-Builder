// src/template/ModernTemplate.jsx
import { Box, Typography, Divider, Chip } from "@mui/material";

export default function ModernTemplate({ data }) {
  if (!data) return null;

  // Component tiêu đề dùng chung để giữ đồng nhất hiệu ứng gạch chân xanh dương
  const SectionHeader = ({ title }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ 
          color: "#1e293b", 
          borderBottom: "2px solid #38bdf8", 
          pb: 1, 
          display: "inline-block", 
          textTransform: "uppercase" 
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", overflow: "hidden" }}>
      
      {/* ========================================================= */}
      {/* CỘT TRÁI - SIDEBAR TỐI MÀU                                */}
      {/* ========================================================= */}
      <Box sx={{ width: "35%", bgcolor: "#1e293b", color: "white", p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* HEADER */}
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1, wordBreak: "break-word" }}>
            {data.name?.toUpperCase()}
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ color: "#cbd5e1", wordBreak: "break-word" }}>
            {data.title}
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* CONTACT */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1, textTransform: "uppercase" }}>Contact</Typography>
          {data.contact?.email && <Typography variant="body2" sx={{ mb: 0.5, wordBreak: "break-word" }}>📧 {data.contact.email}</Typography>}
          {data.contact?.phone && <Typography variant="body2" sx={{ mb: 0.5 }}>📱 {data.contact.phone}</Typography>}
          {data.contact?.address && <Typography variant="body2" sx={{ mb: 0.5, wordBreak: "break-word" }}>📍 {data.contact.address}</Typography>}
          {data.contact?.linkedin && <Typography variant="body2" sx={{ mb: 0.5, wordBreak: "break-word" }}>🔗 {data.contact.linkedin}</Typography>}
          {data.contact?.website && <Typography variant="body2" sx={{ wordBreak: "break-word" }}>🌐 {data.contact.website}</Typography>}
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#38bdf8", mb: 1, textTransform: "uppercase" }}>Skills</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {data.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} size="small" sx={{ bgcolor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", borderRadius: 1, height: 'auto', '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', py: 0.5 } }} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* ========================================================= */}
      {/* CỘT PHẢI - NỘI DUNG CHÍNH                                 */}
      {/* ========================================================= */}
      <Box sx={{ width: "65%", p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        
        {/* SUMMARY */}
        {data.summary && (
          <Box>
            <SectionHeader title="Profile Summary" />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Box>
            <SectionHeader title="Experience" />
            {data.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" sx={{ wordBreak: "break-word", pr: 2 }}>{exp.role}</Typography>
                  <Typography variant="caption" fontWeight="bold" color="#38bdf8" sx={{ flexShrink: 0 }}>{exp.duration}</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontStyle: "italic", wordBreak: "break-word" }}>{exp.company}</Typography>
                {exp.desc && <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {exp.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <Box>
            <SectionHeader title="Education" />
            {data.education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" sx={{ wordBreak: "break-word", pr: 2 }}>{edu.degree}</Typography>
                  <Typography variant="caption" fontWeight="bold" color="#38bdf8" sx={{ flexShrink: 0 }}>{edu.duration}</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontStyle: "italic", wordBreak: "break-word" }}>{edu.school}</Typography>
                {edu.desc && <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {edu.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <Box>
            <SectionHeader title="Projects" />
            {data.projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" sx={{ wordBreak: "break-word", pr: 2 }}>{proj.name}</Typography>
                  {proj.link && <Typography variant="caption" fontWeight="bold" color="#38bdf8" sx={{ textDecoration: "underline", wordBreak: "break-word", ml: 2, textAlign: 'right' }}>{proj.link}</Typography>}
                </Box>
                {proj.role && <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontStyle: "italic", wordBreak: "break-word" }}>Role: {proj.role}</Typography>}
                {proj.desc && <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>• {proj.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* CERTIFICATES */}
        {data.certificates && data.certificates.length > 0 && (
          <Box>
            <SectionHeader title="Certifications" />
            {data.certificates.map((cert, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="#1e293b" sx={{ wordBreak: "break-word", pr: 2 }}>{cert.name}</Typography>
                  {cert.date && <Typography variant="caption" fontWeight="bold" color="#38bdf8" sx={{ flexShrink: 0 }}>{cert.date}</Typography>}
                </Box>
                {cert.organization && <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", wordBreak: "break-word" }}>{cert.organization}</Typography>}
              </Box>
            ))}
          </Box>
        )}

      </Box>
    </Box>
  );
}