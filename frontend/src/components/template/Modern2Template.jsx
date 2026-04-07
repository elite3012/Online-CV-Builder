// src/template/Modern2Template.jsx
import { Box, Typography } from "@mui/material";

export default function Modern2Template({ data }) {
  if (!data) return null;

  const contacts = [
    { label: "EMAIL", value: data.contact?.email },
    { label: "PHONE", value: data.contact?.phone },
    { label: "LOCATION", value: data.contact?.address },
    { label: "LINKEDIN", value: data.contact?.linkedin },
    { label: "WEBSITE", value: data.contact?.website },
  ].filter((c) => c.value);

  const SectionTitle = ({ text }) => (
    <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 3, display: "flex", alignItems: "center", gap: 1, textTransform: "uppercase" }}>
      <Box component="span" sx={{ width: 12, height: 12, bgcolor: "#10b981", display: "inline-block" }} /> {text}
    </Typography>
  );

  return (
    // Ép cứng kích thước A4 (794x1123) để đảm bảo HTML2Canvas chụp không bị hụt
    <Box sx={{ minHeight: "1123px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      
      {/* ========================================================= */}
      {/* HEADER: ĐỔI SANG FLEXBOX ĐỂ ÔM KHÍT 100% CẠNH             */}
      {/* ========================================================= */}
      <Box sx={{ display: "flex", minHeight: "180px", width: "100%" }}>
        
        {/* KHỐI TÊN & CHỨC DANH (Tương đương xs=8 tức 66.66%) */}
        <Box sx={{ width: "66.66%", bgcolor: "#0f172a", p: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 0.5, wordBreak: "break-word" }}>
            {data.name?.toUpperCase()}
          </Typography>
          <Typography variant="h6" color="#10b981" sx={{ wordBreak: "break-word" }}>
            {data.title}
          </Typography>
        </Box>

        {/* KHỐI CONTACT (Tương đương xs=4 tức 33.33%) */}
        <Box sx={{ width: "33.33%", bgcolor: "#10b981", p: 4, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.5 }}>
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
        </Box>

      </Box>

      {/* ========================================================= */}
      {/* BODY CHÍNH                                                */}
      {/* ========================================================= */}
      <Box sx={{ p: 5, flexGrow: 1 }}>
        
        {/* SUMMARY */}
        {data.summary && (
          <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, mb: 5, pl: 2, borderLeft: "4px solid #10b981", textAlign: "justify", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {data.summary}
          </Typography>
        )}

        {/* ----------------------------------------------------- */}
        {/* BODY COLUMNS: ĐỔI SANG FLEXBOX CHỐNG TRÀN MARGIN ÂM   */}
        {/* ----------------------------------------------------- */}
        <Box sx={{ display: "flex", gap: 6 }}>
          
          {/* CỘT TRÁI (Kinh nghiệm, Học vấn, Dự án) */}
          <Box sx={{ flex: 2, minWidth: 0 }}> {/* flex: 2 ~ xs: 8, minWidth: 0 để text không phá vỡ khung */}
            
            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle text="Experience" />
                {data.experience.map((exp, idx) => (
                  <Box key={idx} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{exp.role}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                      <Typography variant="subtitle2" color="#64748b" sx={{ wordBreak: "break-word" }}>{exp.company}</Typography>
                      {exp.duration && (
                        <Typography variant="caption" fontWeight="bold" sx={{ color: "#10b981", bgcolor: "#ecfdf5", px: 1, py: 0.5, borderRadius: 1 }}>
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                      <Typography variant="subtitle2" color="#64748b" sx={{ wordBreak: "break-word" }}>{edu.school}</Typography>
                      {edu.duration && (
                        <Typography variant="caption" fontWeight="bold" sx={{ color: "#10b981", bgcolor: "#ecfdf5", px: 1, py: 0.5, borderRadius: 1 }}>
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="#0f172a" sx={{ wordBreak: "break-word" }}>{proj.name}</Typography>
                      {proj.link && <Typography variant="caption" sx={{ color: "#10b981", textDecoration: "underline", wordBreak: "break-word" }}>{proj.link}</Typography>}
                    </Box>
                    {proj.role && <Typography variant="subtitle2" color="#64748b" sx={{ mb: 0.5, wordBreak: "break-word" }}>Role: {proj.role}</Typography>}
                    {proj.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

          </Box>

          {/* CỘT PHẢI (Kỹ năng, Chứng chỉ) */}
          <Box sx={{ flex: 1, minWidth: 0 }}> {/* flex: 1 ~ xs: 4 */}
            
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

          </Box>
        </Box>

      </Box>
    </Box>
  );
}