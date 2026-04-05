// src/templates/MinimalTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function MinimalTemplate({ data }) {
  if (!data) return null;

  // Lọc và gộp thông tin liên lạc, cách nhau bởi dấu " | "
  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.address,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean).join("  |  ");

  // Component hỗ trợ render tiêu đề cho từng mục để code gọn và đồng nhất
  const SectionHeader = ({ title }) => (
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{ color: "#111827", textTransform: "uppercase", letterSpacing: "1px", mb: 2 }}
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
        p: 6,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ========================================================= */}
      {/* HEADER TẬP TRUNG                                          */}
      {/* ========================================================= */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" fontWeight="900" sx={{ color: "#111827", letterSpacing: "-1px", mb: 1, wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="h6" sx={{ color: "#6b7280", fontWeight: 400, mb: 2, wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", wordBreak: "break-word" }}>
          {contactItems}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4, borderColor: "#000", borderWidth: 1 }} />

      {/* ========================================================= */}
      {/* BODY CHÍNH                                                */}
      {/* ========================================================= */}

      {/* SUMMARY */}
      {data.summary && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Summary" />
          <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "break-word", textAlign: "justify" }}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Professional Experience" />
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#111827" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {exp.role} {exp.company && `@ ${exp.company}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {exp.duration}
                </Typography>
              </Box>
              {exp.desc && (
                <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  - {exp.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Education" />
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#111827" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {edu.degree} {edu.school && `@ ${edu.school}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {edu.duration}
                </Typography>
              </Box>
              {edu.desc && (
                <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  - {edu.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Selected Projects" />
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#111827" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {proj.name} {proj.role && `— ${proj.role}`}
                </Typography>
                {proj.link && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", wordBreak: "break-word", ml: 2, textAlign: 'right' }}>
                    {proj.link}
                  </Typography>
                )}
              </Box>
              {proj.desc && (
                <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  - {proj.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* CERTIFICATES */}
      {data.certificates && data.certificates.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Certifications" />
          {data.certificates.map((cert, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#111827" sx={{ wordBreak: "break-word", pr: 2 }}>{cert.name}</Typography>
                {cert.date && <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>{cert.date}</Typography>}
              </Box>
              {cert.organization && (
                <Typography variant="body2" sx={{ color: "#374151", wordBreak: "break-word" }}>{cert.organization}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <Box>
          <SectionHeader title="Core Competencies" />
          <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.8, wordBreak: "break-word" }}>
            {data.skills.join(" • ")}
          </Typography>
        </Box>
      )}

    </Box>
  );
}