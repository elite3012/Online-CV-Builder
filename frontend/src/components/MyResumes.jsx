// src/components/MyResumes.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Box, Typography, Button, Grid, Paper, IconButton, Chip } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import BorderGlow from "./reactbits/BorderGlow";
import CVRenderer from "./template/CVRenderer"; 
import { myResumes } from "../data/myResumes"; 

// Helper function để chuyển đổi formData sang định dạng cho CVRenderer
const getPreviewData = (formData) => ({
  name: formData.personalInfo?.fullName,
  title: formData.personalInfo?.jobTitle,
  contact: { 
    email: formData.personalInfo?.email, 
    phone: formData.personalInfo?.phone, 
    address: formData.personalInfo?.location, 
    linkedin: formData.personalInfo?.linkedin, 
    website: formData.personalInfo?.website 
  },
  summary: formData.summary,
  experience: formData.experience?.filter(e => e.company).map(exp => ({ 
    company: exp.company, 
    role: exp.role, 
    duration: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`, 
    desc: exp.description 
  })),
  skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
  education: formData.education?.filter(e => e.school).map(edu => ({ 
    school: edu.school, 
    degree: edu.degree, 
    duration: `${edu.startDate}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate}`, 
    desc: edu.description 
  })),
  projects: formData.projects?.filter(p => p.name).map(proj => ({ 
    name: proj.name, 
    role: proj.role, 
    link: proj.link, 
    desc: proj.description 
  })),
  certificates: formData.certificates?.filter(c => c.name).map(cert => ({ 
    name: cert.name, 
    organization: cert.organization, 
    date: cert.date 
  })),
});

export default function MyResumes({ setCurrentView }) {
  const [resumeList, setResumeList] = useState(myResumes);
  const [previewOpenId, setPreviewOpenId] = useState(null);
  const navigate = useNavigate();
  
  const hasResumes = resumeList.length > 0;

  const handleDelete = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setResumeList(resumeList.filter((cv) => cv.id !== idToDelete));
    }
  };

  const handleEdit = (cv) => {
    navigate('/editor', { state: { resumeToEdit: cv } });
  };

  const handleCreateNew = () => {
    if (setCurrentView) {
      setCurrentView('Overview'); 
    } else {
      navigate('/dashboard'); // just in case
    }
  };

 
  return (
    <Box sx={{ p: 4, flexGrow: 1, mt: "80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontFamily: "'Helvetica', sans-serif", mb: 0.5 }}>
            My Resumes
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.7)">
            Manage and edit your created resumes here.
          </Typography>
        </Box>
        
        {hasResumes && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleCreateNew}
            sx={{ bgcolor: "#52b0c3", textTransform: "none", "&:hover": { bgcolor: "#3d94a7" } }}
          >
            Create New
          </Button>
        )}
      </Box>

      {/* RẼ NHÁNH HIỂN THỊ */}
      {hasResumes ? (
        <Grid container spacing={4}>
          {resumeList.map((cv, index) => {
            // Kiểm tra an toàn xem cv.formData có tồn tại không trước khi render
            const previewData = cv.formData ? getPreviewData(cv.formData) : {};

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id} sx={{ display: "flex", justifyContent: "center" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  
                  <BorderGlow
                    edgeSensitivity={30}
                    backgroundColor="none"
                    glowColor="190 80 80"
                    borderRadius={12}
                    glowRadius={80}
                    glowIntensity={1.0}
                    coneSpread={10}
                    colors={["#1c7c54", "#52b0c3", "#def4c6"]}
                    style={{ width: 250, display: "flex" }} 
                  >
                    <Box sx={{ width: 250, display: "flex", flexDirection: "column", flexGrow: 1, bgcolor: "white", borderRadius: "12px", position: "relative" }}>
                      
                      {/* NÚT XÓA (Góc phải trên) */}
                      <IconButton 
                        onClick={() => handleDelete(cv.id)} 
                        sx={{ position: "absolute", top: 8, right: 8, zIndex: 10, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#ffebee" } }}
                        size="small"
                      >
                        <DeleteIcon color="error" fontSize="small" />
                      </IconButton>

                      {/* KHU VỰC LIVE THUMBNAIL */}
                      <Box sx={{ width: "100%", height: 220, overflow: "hidden", position: "relative", borderRadius: "12px 12px 0 0", zIndex: 0, bgcolor: "#f0f4f8", borderBottom: "1px solid #e0e0e0" }}>
                        <Box sx={{ width: 794, height: 1122, transform: "scale(0.315)", transformOrigin: "top left", pointerEvents: "none" }}>
                          <CVRenderer templateName={cv.templateName} data={previewData} />
                        </Box>
                      </Box>

                      {/* KHU VỰC THÔNG TIN */}
                      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="#102a43" sx={{ fontFamily: "'Helvetica', sans-serif" }} noWrap>
                          {cv.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, mb: 1.5, flexGrow: 1, fontSize: "0.7rem", fontStyle: "italic" }}>
                          Last edited: {cv.lastEdited}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                          <Chip label={cv.templateName} size="small" sx={{ fontSize: "0.65rem", height: 20, bgcolor: "#f0f4f8", color: "#102a43" }} />
                        </Box>

                        {/* KHU VỰC ACTION BUTTONS */}
                        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setPreviewOpenId(cv.id)}
                            sx={{ flex: 1, textTransform: "none", color: "#607d8b", borderColor: "#e0e0e0", "&:hover": { bgcolor: "#f5f5f5", borderColor: "#cfd8dc" } }}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(cv)}
                            sx={{ flex: 1, textTransform: "none", bgcolor: "#52b0c3", color: "white", boxShadow: "none", "&:hover": { bgcolor: "#3d94a7", boxShadow: "none" } }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </BorderGlow>

                  {/* POPUP PREVIEW RIÊNG CHO TỪNG CV */}
                  {typeof document !== "undefined" && createPortal(
                    <AnimatePresence>
                      {previewOpenId === cv.id && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                          onClick={() => setPreviewOpenId(null)}
                          style={{
                            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                            backgroundColor: "rgba(30, 30, 30, 0.85)", backdropFilter: "blur(5px)", zIndex: 99999,
                            display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", cursor: "zoom-out",
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              maxHeight: "90vh", maxWidth: "95vw", overflow: "auto",
                              borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", cursor: "default", backgroundColor: "white",
                            }}
                          >
                            <CVRenderer templateName={cv.templateName} data={previewData} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}

                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* TRƯỜNG HỢP 2: CHƯA CÓ CV (Empty State) */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <Paper sx={{ p: 5, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.05)", border: "1px dashed rgba(255, 255, 255, 0.2)", borderRadius: 3, width: "100%", maxWidth: 500 }}>
              <Typography color="white" variant="h6" sx={{ mb: 1 }}>You haven't created any resumes yet.</Typography>
              <Typography color="rgba(255,255,255,0.5)" variant="body2" sx={{ mb: 3 }}>Start building your professional profile today.</Typography>
              <Button variant="contained" onClick={handleCreateNew} sx={{ bgcolor: "#52b0c3", "&:hover": { bgcolor: "#3d94a7" } }}>Create New Resume</Button>
            </Paper>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}