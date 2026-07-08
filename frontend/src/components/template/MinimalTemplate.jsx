// src/templates/MinimalTemplate.jsx
import { Box, Typography, Divider } from "@mui/material";

export default function MinimalTemplate({ data }) {
  if (!data) return null;

  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.address,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean).join("  |  ");

  const SectionHeader = ({ title }) => (
    <Typography
      fontWeight="bold"
      sx={{
        color: "#111827",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: "13px",
        mb: 1.4,
        pb: 0.45,
        borderBottom: "1px solid #111827",
        fontFamily: '"Times New Roman", Georgia, serif',
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
        px: "54px",
        py: "44px",
        fontFamily: '"Times New Roman", Georgia, serif',
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        <Typography sx={{ color: "#111827", fontSize: "30px", lineHeight: 1.05, letterSpacing: "0.04em", fontWeight: 700, mb: 0.9, wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography sx={{ color: "#4b5563", fontSize: "15px", fontWeight: 400, mb: 1, wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Typography sx={{ color: "#4b5563", fontSize: "12px", display: "flex", justifyContent: "center", flexWrap: "wrap", wordBreak: "break-word" }}>
          {contactItems}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, borderColor: "#000", borderWidth: 1 }} />

      {/* SUMMARY */}
      {data.summary && (
        <Box sx={{ mb: 3 }}>
          <SectionHeader title="Summary" />
          <Typography sx={{ color: "#1f2937", fontSize: "13px", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionHeader title="Experience" />
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 1.8 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography fontWeight="bold" color="#111827" sx={{ fontSize: "13px", wordBreak: "break-word", pr: 2 }}>
                  {[exp.role, exp.company].filter(Boolean).join(", ")}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "13px", flexShrink: 0 }}>
                  {exp.duration}
                </Typography>
              </Box>
              {exp.desc && (
                <Typography sx={{ color: "#1f2937", fontSize: "13px", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  {exp.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionHeader title="Education" />
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 1.8 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography fontWeight="bold" color="#111827" sx={{ fontSize: "13px", wordBreak: "break-word", pr: 2 }}>
                  {edu.school || edu.degree}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "13px", flexShrink: 0 }}>
                  {edu.duration}
                </Typography>
              </Box>
              {edu.school && edu.degree && (
                <Typography sx={{ color: "#374151", fontSize: "13px", fontStyle: "italic", mb: 0.4, wordBreak: "break-word" }}>
                  {edu.degree}
                </Typography>
              )}
              {edu.desc && (
                <Typography sx={{ color: "#1f2937", fontSize: "13px", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  {edu.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionHeader title="Selected Projects" />
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 1.8 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography fontWeight="bold" color="#111827" sx={{ fontSize: "13px", wordBreak: "break-word", pr: 2 }}>
                  {proj.name} {proj.role && `— ${proj.role}`}
                </Typography>
                {proj.link && (
                  <Typography color="text.secondary" sx={{ fontSize: "12px", fontStyle: "italic", wordBreak: "break-word", ml: 2, textAlign: 'right' }}>
                    {proj.link}
                  </Typography>
                )}
              </Box>
              {proj.desc && (
                <Typography sx={{ color: "#1f2937", fontSize: "13px", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  {proj.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* CERTIFICATES */}
      {data.certificates && data.certificates.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SectionHeader title="Certifications" />
          {data.certificates.map((cert, idx) => (
            <Box key={idx} sx={{ mb: 1.2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                <Typography fontWeight="bold" color="#111827" sx={{ fontSize: "13px", wordBreak: "break-word", pr: 2 }}>{cert.name}</Typography>
                {cert.date && <Typography color="text.secondary" sx={{ fontSize: "13px", flexShrink: 0 }}>{cert.date}</Typography>}
              </Box>
              {cert.organization && (
                <Typography sx={{ color: "#374151", fontSize: "13px", fontStyle: "italic", wordBreak: "break-word" }}>{cert.organization}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <Box>
          <SectionHeader title="Core Competencies" />
          <Typography sx={{ color: "#1f2937", fontSize: "13px", lineHeight: 1.55, wordBreak: "break-word" }}>
            {data.skills.join(" • ")}
          </Typography>
        </Box>
      )}

    </Box>
  );
}
