// src/template/Professional2Template.jsx
import { Box, Typography } from "@mui/material";

export default function Professional2Template({ data }) {
  if (!data) return null;

  // Component tiêu đề cột trái (Gạch chân đậm)
  const LeftHeader = ({ title }) => (
    <Typography variant="h6" fontWeight="bold" sx={{ color: "#0A2540", borderBottom: "2px solid #0A2540", pb: 0.5, mb: 2, textTransform: "uppercase", mt: 4 }}>
      {title}
    </Typography>
  );

  // Component tiêu đề cột phải
  const RightHeader = ({ title }) => (
    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", mb: 2, mt: 4, textTransform: "uppercase" }}>
      {title}
    </Typography>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
      
      {/* ========================================================= */}
      {/* CỘT TRÁI (Nội dung chính - 65%)                           */}
      {/* ========================================================= */}
      <Box sx={{ width: "65%", p: 5, pr: 4 }}>
        
        {/* HEADER */}
        <Typography variant="h3" fontWeight="900" sx={{ color: "#0A2540", mb: 1, letterSpacing: "-1px", wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="h6" sx={{ color: "#636B74", mb: 4, wordBreak: "break-word" }}>
          {data.title}
        </Typography>

        {/* SUMMARY */}
        {data.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#0A2540", borderBottom: "2px solid #0A2540", pb: 0.5, mb: 2, textTransform: "uppercase" }}>
              EXECUTIVE SUMMARY
            </Typography>
            <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6, textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Box>
            <LeftHeader title="WORK EXPERIENCE" />
            {data.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", wordBreak: "break-word" }}>{exp.role}</Typography>
                <Typography variant="subtitle2" sx={{ color: "#636B74", mb: 1, wordBreak: "break-word" }}>{exp.company} {exp.duration && `| ${exp.duration}`}</Typography>
                {exp.desc && <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>- {exp.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <Box>
            <LeftHeader title="EDUCATION" />
            {data.education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", wordBreak: "break-word" }}>{edu.degree}</Typography>
                <Typography variant="subtitle2" sx={{ color: "#636B74", mb: 1, wordBreak: "break-word" }}>{edu.school} {edu.duration && `| ${edu.duration}`}</Typography>
                {edu.desc && <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>- {edu.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <Box>
            <LeftHeader title="KEY PROJECTS" />
            {data.projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", wordBreak: "break-word", pr: 2 }}>{proj.name}</Typography>
                  {proj.link && <Typography variant="caption" sx={{ color: "#636B74", textDecoration: "underline", wordBreak: "break-word", flexShrink: 0 }}>{proj.link}</Typography>}
                </Box>
                {proj.role && <Typography variant="subtitle2" sx={{ color: "#636B74", mb: 0.5, wordBreak: "break-word" }}>Role: {proj.role}</Typography>}
                {proj.desc && <Typography variant="body2" sx={{ color: "#3C4257", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>- {proj.desc}</Typography>}
              </Box>
            ))}
          </Box>
        )}

      </Box>

      {/* ========================================================= */}
      {/* CỘT PHẢI (Sidebar màu xám nhạt - 35%)                     */}
      {/* ========================================================= */}
      <Box sx={{ width: "35%", bgcolor: "#F6F9FC", p: 5, pl: 4, borderLeft: "1px solid #E3E8EE" }}>
        
        {/* CONTACT INFO */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0A2540", mb: 2 }}>
          CONTACT INFO
        </Typography>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {data.contact?.email && <Typography variant="body2" color="#3C4257" sx={{ wordBreak: "break-word" }}>✉️ {data.contact.email}</Typography>}
          {data.contact?.phone && <Typography variant="body2" color="#3C4257">📞 {data.contact.phone}</Typography>}
          {data.contact?.address && <Typography variant="body2" color="#3C4257" sx={{ wordBreak: "break-word" }}>🏢 {data.contact.address}</Typography>}
          {data.contact?.linkedin && <Typography variant="body2" color="#3C4257" sx={{ wordBreak: "break-word" }}>🔗 {data.contact.linkedin}</Typography>}
          {data.contact?.website && <Typography variant="body2" color="#3C4257" sx={{ wordBreak: "break-word" }}>🌐 {data.contact.website}</Typography>}
        </Box>

        {/* EXPERTISE (SKILLS) */}
        {data.skills && data.skills.length > 0 && (
          <Box>
            <RightHeader title="EXPERTISE" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {data.skills.map((skill, idx) => (
                <Typography key={idx} variant="body2" sx={{ color: "#3C4257", bgcolor: "white", p: 1, border: "1px solid #E3E8EE", borderRadius: 1, wordBreak: "break-word" }}>
                  {skill}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* CERTIFICATES */}
        {data.certificates && data.certificates.length > 0 && (
          <Box>
            <RightHeader title="CERTIFICATIONS" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {data.certificates.map((cert, idx) => (
                <Box key={idx} sx={{ bgcolor: "white", p: 1.5, border: "1px solid #E3E8EE", borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold" color="#0A2540" sx={{ wordBreak: "break-word" }}>{cert.name}</Typography>
                  {cert.organization && <Typography variant="caption" display="block" color="#636B74" sx={{ mt: 0.5, wordBreak: "break-word" }}>{cert.organization}</Typography>}
                  {cert.date && <Typography variant="caption" fontWeight="bold" color="#0A2540" display="block" sx={{ mt: 0.5 }}>{cert.date}</Typography>}
                </Box>
              ))}
            </Box>
          </Box>
        )}

      </Box>

    </Box>
  );
}