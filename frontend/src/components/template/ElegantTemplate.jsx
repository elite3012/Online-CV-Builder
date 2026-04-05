// src/template/ElegantTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function ElegantTemplate({ data }) {
  if (!data) return null;

  // Tự động gom các thông tin liên lạc, cách nhau bởi dấu " • "
  const contactItems = [
    data.contact?.address,
    data.contact?.phone,
    data.contact?.email,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean).join("  •  ");

  // Component hỗ trợ render tiêu đề cho từng mục để code gọn và đồng nhất
  const SectionHeader = ({ title }) => (
    <Typography
      variant="h6"
      fontWeight="300"
      sx={{
        letterSpacing: "2px",
        color: "#1f2937",
        mb: 3,
        mt: 4,
        borderBottom: "1px solid #e5e7eb",
        pb: 1,
        textTransform: "uppercase"
      }}
    >
      {title}
    </Typography>
  );

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
      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" fontWeight="300" sx={{ letterSpacing: "4px", color: "#1f2937", mb: 1, wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="subtitle1" sx={{ letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Divider sx={{ my: 2, width: "100px", mx: "auto", borderColor: "#d1d5db" }} />
        <Typography variant="body2" sx={{ color: "#6b7280", lineHeight: 1.8, wordBreak: "break-word" }}>
          {contactItems}
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* BODY CHÍNH                                                */}
      {/* ========================================================= */}

      {/* SUMMARY */}
      {data.summary && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="body1" sx={{ color: "#374151", lineHeight: 2, textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <Box>
          <SectionHeader title="Experience" />
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#374151", wordBreak: "break-word", pr: 2 }}>{exp.role}</Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af", flexShrink: 0 }}>{exp.duration}</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 1, wordBreak: "break-word" }}>{exp.company}</Typography>
              {exp.desc && <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "break-word" }}>{exp.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <Box>
          <SectionHeader title="Education" />
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#374151", wordBreak: "break-word", pr: 2 }}>{edu.degree}</Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af", flexShrink: 0 }}>{edu.duration}</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 1, wordBreak: "break-word" }}>{edu.school}</Typography>
              {edu.desc && <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "break-word" }}>{edu.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <Box>
          <SectionHeader title="Projects" />
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#374151", wordBreak: "break-word", pr: 2 }}>{proj.name}</Typography>
                {proj.link && <Typography variant="body2" sx={{ color: "#9ca3af", fontStyle: "italic", wordBreak: "break-word", ml: 2, textAlign: 'right' }}>{proj.link}</Typography>}
              </Box>
              {proj.role && <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 1, wordBreak: "break-word" }}>{proj.role}</Typography>}
              {proj.desc && <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* CERTIFICATES */}
      {data.certificates && data.certificates.length > 0 && (
        <Box>
          <SectionHeader title="Certifications" />
          {data.certificates.map((cert, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#374151", wordBreak: "break-word" }}>{cert.name}</Typography>
                {cert.organization && <Typography variant="subtitle2" sx={{ color: "#6b7280", wordBreak: "break-word" }}>{cert.organization}</Typography>}
              </Box>
              {cert.date && <Typography variant="body2" sx={{ color: "#9ca3af", flexShrink: 0 }}>{cert.date}</Typography>}
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <Box>
          <SectionHeader title="Core Skills" />
          <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 2, wordBreak: "break-word" }}>
            {data.skills.join("   |   ")}
          </Typography>
        </Box>
      )}

    </Box>
  );
}