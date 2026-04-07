// src/template/CreativeTemplate.jsx
import { Box, Typography, Chip } from "@mui/material";

export default function CreativeTemplate({ data }) {
  if (!data) return null;

  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.address,
    data.contact?.linkedin,
    data.contact?.website
  ].filter(Boolean);

  return (
    // FIX: Ép chuẩn kích thước A4 (794x1123)
    <Box sx={{ minHeight: "1123px", width: "794px", bgcolor: "white", boxShadow: 3, mx: "auto", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: "#f43f5e", color: "white", p: 5, textAlign: "center", flexShrink: 0 }}>
        <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: "2px", mb: 1, wordBreak: "break-word" }}>
          {data.name?.toUpperCase()}
        </Typography>
        <Typography variant="h5" fontWeight="medium" sx={{ opacity: 0.9, mb: 3, wordBreak: "break-word" }}>
          {data.title}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap", opacity: 0.8 }}>
          {contactItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2">{item}</Typography>
              {index < contactItems.length - 1 && <Typography variant="body2">•</Typography>}
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
          <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, fontSize: "1.1rem", textAlign: "center", mb: 5, fontStyle: "italic", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            "{data.summary}"
          </Typography>
        )}

        {/* FIX: THAY GRID BẰNG FLEXBOX ĐỂ CHỐNG LỖI TRÀN LỀ (MARGIN ÂM) */}
        <Box sx={{ display: "flex", gap: 5 }}>
          
          {/* ----------------------------------------------------- */}
          {/* CỘT TRÁI (Kinh nghiệm, Học vấn, Dự án)                */}
          {/* ----------------------------------------------------- */}
          <Box sx={{ flex: 7, minWidth: 0 }}>
            
            {/* EXPERIENCE (Timeline Style) */}
            {data.experience && data.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  WORK EXPERIENCE
                </Typography>
                {data.experience.map((exp, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    <Typography variant="h6" fontWeight="bold" color="#1e293b">{exp.role}</Typography>
                    <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>{exp.company} | {exp.duration}</Typography>
                    {exp.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{exp.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* EDUCATION (Timeline Style) */}
            {data.education && data.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  EDUCATION
                </Typography>
                {data.education.map((edu, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    <Typography variant="h6" fontWeight="bold" color="#1e293b">{edu.degree}</Typography>
                    <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>{edu.school} | {edu.duration}</Typography>
                    {edu.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{edu.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            {/* PROJECTS (Timeline Style) */}
            {data.projects && data.projects.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  KEY PROJECTS
                </Typography>
                {data.projects.map((proj, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: "relative", pl: 3, borderLeft: "2px solid #fda4af" }}>
                    <Box sx={{ position: "absolute", left: "-6px", top: 0, width: 10, height: 10, bgcolor: "#f43f5e", borderRadius: "50%" }} />
                    
                    {/* FIX: ÉP TÊN PROJECT CHIẾM FLEX: 1 ĐỂ ĐẨY LINK SANG TẬN CÙNG BÊN PHẢI */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold" color="#1e293b" sx={{ flex: 1, wordBreak: "break-word" }}>
                        {proj.name}
                      </Typography>
                      {proj.link && (
                        <Typography variant="caption" sx={{ color: "#f43f5e", fontStyle: "italic", textDecoration: "underline", wordBreak: "break-all", textAlign: "right", maxWidth: "50%" }}>
                          {proj.link}
                        </Typography>
                      )}
                    </Box>

                    {proj.role && <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>Role: {proj.role}</Typography>}
                    {proj.desc && <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{proj.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            )}

          </Box>

          {/* ----------------------------------------------------- */}
          {/* CỘT PHẢI (Kỹ năng, Chứng chỉ)                         */}
          {/* ----------------------------------------------------- */}
          <Box sx={{ flex: 5, minWidth: 0 }}>
            
            {/* FIX: SKILLS DÀN NGANG MƯỢT MÀ */}
            {data.skills && data.skills.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  EXPERTISE
                </Typography>
                {/* Đổi flexDirection column thành flexWrap wrap */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {data.skills.map((skill, idx) => (
                    <Chip
                      key={idx} label={skill} size="small"
                      sx={{ bgcolor: "#fff1f2", color: "#e11d48", fontWeight: "bold", borderRadius: 1.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* FIX: CERTIFICATES TINH GỌN (NGÀY THÁNG LÊN CÙNG DÒNG VỚI TÊN) */}
            {data.certificates && data.certificates.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight="900" sx={{ color: "#f43f5e", mb: 3 }}>
                  CERTIFICATIONS
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {data.certificates.map((cert, idx) => (
                    <Box key={idx} sx={{ bgcolor: "#fff1f2", p: 1.5, borderRadius: 2, borderLeft: "4px solid #f43f5e" }}>
                      
                      {/* Đẩy ngày tháng sang phải, nằm ngang hàng với tên chứng chỉ */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#1e293b" sx={{ flex: 1, wordBreak: "break-word" }}>
                          {cert.name}
                        </Typography>
                        {cert.date && (
                          <Typography variant="caption" color="#f43f5e" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>
                            {cert.date}
                          </Typography>
                        )}
                      </Box>
                      
                      {cert.organization && <Typography variant="caption" color="#64748b" display="block" sx={{ mt: 0.5 }}>{cert.organization}</Typography>}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          </Box>
        </Box>

      </Box>
    </Box>
  );
}