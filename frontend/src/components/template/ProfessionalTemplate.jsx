// src/template/ProfessionalTemplate.jsx
import { Box, Typography } from "@mui/material";

export default function ProfessionalTemplate({ data }) {
  if (!data) return null;

  // Dynamically compile contact information
  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.address,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean).join(" | ");

  // Reusable component for the grey section headers
  const SectionHeader = ({ title }) => (
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{ textTransform: "uppercase", mb: 1, mt: 3, bgcolor: "#f0f0f0", p: 0.5, color: "black" }}
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
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}
      <Box sx={{ borderBottom: "2px solid #000", pb: 2, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="black" sx={{ wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" color="#555" sx={{ wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="#333" sx={{ mt: 1, wordBreak: "break-word" }}>
          {contactItems}
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* BODY                                                      */}
      {/* ========================================================= */}

      {/* SUMMARY */}
      {data.summary && (
        <Box>
          <SectionHeader title="Professional Summary" />
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5, color: "black", textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <Box>
          <SectionHeader title="Experience" />
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle2" fontWeight="bold" color="black" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {exp.role}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="black" sx={{ flexShrink: 0 }}>
                  {exp.duration}
                </Typography>
              </Box>
              <Typography variant="body2" color="#333" sx={{ fontStyle: "italic", mb: 0.5, wordBreak: "break-word" }}>
                {exp.company}
              </Typography>
              {exp.desc && (
                <Typography variant="body2" sx={{ color: "black", pl: 2, lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  • {exp.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <Box>
          <SectionHeader title="Education" />
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle2" fontWeight="bold" color="black" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {edu.degree}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="black" sx={{ flexShrink: 0 }}>
                  {edu.duration}
                </Typography>
              </Box>
              <Typography variant="body2" color="#333" sx={{ fontStyle: "italic", mb: 0.5, wordBreak: "break-word" }}>
                {edu.school}
              </Typography>
              {edu.desc && (
                <Typography variant="body2" sx={{ color: "black", pl: 2, lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  • {edu.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <Box>
          <SectionHeader title="Key Projects" />
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle2" fontWeight="bold" color="black" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {proj.name}
                </Typography>
                {proj.link && (
                  <Typography variant="body2" sx={{ color: "#333", textDecoration: "underline", wordBreak: "break-word", flexShrink: 0, ml: 2 }}>
                    {proj.link}
                  </Typography>
                )}
              </Box>
              {proj.role && (
                <Typography variant="body2" color="#333" sx={{ fontStyle: "italic", mb: 0.5, wordBreak: "break-word" }}>
                  Role: {proj.role}
                </Typography>
              )}
              {proj.desc && (
                <Typography variant="body2" sx={{ color: "black", pl: 2, lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  • {proj.desc}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* CERTIFICATES */}
      {data.certificates && data.certificates.length > 0 && (
        <Box>
          <SectionHeader title="Certifications" />
          {data.certificates.map((cert, idx) => (
            <Box key={idx} sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="subtitle2" fontWeight="bold" color="black" sx={{ wordBreak: "break-word", pr: 2 }}>
                  {cert.name}
                </Typography>
                {cert.date && (
                  <Typography variant="body2" fontWeight="bold" color="black" sx={{ flexShrink: 0 }}>
                    {cert.date}
                  </Typography>
                )}
              </Box>
              {cert.organization && (
                <Typography variant="body2" color="#333" sx={{ fontStyle: "italic", wordBreak: "break-word" }}>
                  {cert.organization}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <Box>
          <SectionHeader title="Skills & Competencies" />
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
            {data.skills.map((skill, idx) => (
              <Typography key={idx} variant="body2" sx={{ width: "33%", mb: 0.5, color: "black", wordBreak: "break-word", pr: 1 }}>
                • {skill}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
}