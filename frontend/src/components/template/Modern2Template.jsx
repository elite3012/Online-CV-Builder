// src/template/Modern2Template.jsx
import { Box, Typography, Grid } from "@mui/material";

export default function Modern2Template({ data }) {
  if (!data) return null;

  // Gom các thông tin liên lạc có dữ liệu để map ra tự động
  const contacts = [
    { label: "EMAIL", value: data.contact?.email },
    { label: "PHONE", value: data.contact?.phone },
    { label: "LOCATION", value: data.contact?.address },
    { label: "LINKEDIN", value: data.contact?.linkedin },
    { label: "WEBSITE", value: data.contact?.website },
  ].filter((c) => c.value);

  // Component tiêu đề mục (có ô vuông màu xanh lá làm điểm nhấn)
  const SectionTitle = ({ text }) => (
    <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 3, display: "flex", alignItems: "center", gap: 1, textTransform: "uppercase" }}>
      <Box component="span" sx={{ width: 12, height: 12, bgcolor: "#10b981", display: "inline-block" }} /> {text}
    </Typography>
  );

  return (
    <Box sx={{ minHeight: "1122px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", overflow: "hidden" }}>
      
      {/* ========================================================= */}
      {/* HEADER KHỐI MÀU (Dùng minHeight thay vì height cố định)   */}
      {/* ========================================================= */}
      <Grid container sx={{ minHeight: "180px" }}>
        
        {/* KHỐI TÊN & CHỨC DANH */}
        <Grid item xs={8} sx={{ bgcolor: "#0f172a", p: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 0.5, wordBreak: "break-word" }}>
            {data.name?.toUpperCase()}
          </Typography>
          <Typography variant="h6" color="#10b981" sx={{ wordBreak: "break-word" }}>
            {data.title}
          </Typography>
        </Grid>

        {/* KHỐI CONTACT */}
        <Grid item xs={4} sx={{ bgcolor: "#10b981", p: 4, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.5 }}>
          {contacts.map((item, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight="bold" color="#0f172a" sx={{ display: "block" }}>
                {item.label}
              </Typography>
              <Typography variant="body2" color="white" sx={{ wordBreak: "break-word", lineHeight: 1.2 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Grid>

      </Grid>

      {/* ========================================================= */}
      {/* BODY CHÍNH                                                */}
      {/* ========================================================= */}
      <Box sx={{ p: 5 }}>
        
        {/* SUMMARY */}
        {data.summary && (
          <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, mb: 5, pl: 2, borderLeft: "4px solid #10b981", textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        )}

        <Grid container spacing={6}>
          {/* ----------------------------------------------------- */}
          {/* CỘT TRÁI (Kinh nghiệm, Học vấn, Dự án)                */}
          {/* ----------------------------------------------------- */}
          <Grid item xs={8}>
            
            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle text="Experience" />
                {data.experience.map((exp, idx) => (
                  <Box key={idx} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{exp.role}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                      <Typography variant="subtitle2" color="#64748b" sx={{ wordBreak: "break-word", pr: 2 }}>{exp.company}</Typography>
                      {exp.duration && (
                        <Typography variant="caption" fontWeight="bold" sx={{ color: "#10b981", bgcolor: "#ecfdf5", px: 1, py: 0.5, borderRadius: 1, flexShrink: 0 }}>
                          {exp.duration}
                        </Typography>
                      )}
                    </Box>
                    {exp.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{exp.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle text="Education" />
                {data.education.map((edu, idx) => (
                  <Box key={idx} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{edu.degree}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                      <Typography variant="subtitle2" color="#64748b" sx={{ wordBreak: "break-word", pr: 2 }}>{edu.school}</Typography>
                      {edu.duration && (
                        <Typography variant="caption" fontWeight="bold" sx={{ color: "#10b981", bgcolor: "#ecfdf5", px: 1, py: 0.5, borderRadius: 1, flexShrink: 0 }}>
                          {edu.duration}
                        </Typography>
                      )}
                    </Box>
                    {edu.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{edu.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* PROJECTS */}
            {data.projects && data.projects.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle text="Projects" />
                {data.projects.map((proj, idx) => (
                  <Box key={idx} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{proj.name}</Typography>
                      {proj.link && <Typography variant="caption" sx={{ color: "#10b981", textDecoration: "underline", wordBreak: "break-word", ml: 2, textAlign: 'right' }}>{proj.link}</Typography>}
                    </Box>
                    {proj.role && <Typography variant="subtitle2" color="#64748b" sx={{ mb: 0.5, wordBreak: "break-word" }}>Role: {proj.role}</Typography>}
                    {proj.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

          </Grid>

          {/* ----------------------------------------------------- */}
          {/* CỘT PHẢI (Kỹ năng, Chứng chỉ)                         */}
          {/* ----------------------------------------------------- */}
          <Grid item xs={4}>
            
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <SectionTitle text="Skills" />
                {data.skills.map((skill, idx) => (
                  <Box key={idx} sx={{ mb: 1.5 }}>
                    <Typography variant="body2" fontWeight="bold" color="#334155" sx={{ mb: 0.5, wordBreak: "break-word" }}>{skill}</Typography>
                    <Box sx={{ width: "100%", height: 6, bgcolor: "#e2e8f0", borderRadius: 3 }}>
                      <Box sx={{ width: `${Math.floor(Math.random() * 30) + 70}%`, height: "100%", bgcolor: "#10b981", borderRadius: 3 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* CERTIFICATES */}
            {data.certificates && data.certificates.length > 0 && (
              <Box>
                <SectionTitle text="Certifications" />
                {data.certificates.map((cert, idx) => (
                  <Box key={idx} sx={{ mb: 2.5 }}>
                    <Typography variant="body2" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{cert.name}</Typography>
                    {cert.organization && <Typography variant="caption" display="block" color="#64748b" sx={{ mt: 0.5, wordBreak: "break-word" }}>{cert.organization}</Typography>}
                    {cert.date && <Typography variant="caption" fontWeight="bold" color="#10b981">{cert.date}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

          </Grid>
        </Grid>

      </Box>
    </Box>
  );
}