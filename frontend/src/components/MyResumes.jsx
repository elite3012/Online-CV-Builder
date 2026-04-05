// src/components/MyResumes.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { motion } from "motion/react";
import AddIcon from "@mui/icons-material/Add";

import ResumeCard from "./ResumeCard";
import PreviewModal from "./PreviewModal"; 
import { myResumes } from "../data/myResumes"; 

// Helper function để chuyển đổi formData sang định dạng cho CVRenderer
const getPreviewData = (formData) => ({
  name: formData.personalInfo?.fullName,
  title: formData.personalInfo?.jobTitle,
  contact: { email: formData.personalInfo?.email, phone: formData.personalInfo?.phone, address: formData.personalInfo?.location, linkedin: formData.personalInfo?.linkedin, website: formData.personalInfo?.website },
  summary: formData.summary,
  experience: formData.experience?.filter(e => e.company).map(exp => ({ company: exp.company, role: exp.role, duration: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`, desc: exp.description })),
  skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
  education: formData.education?.filter(e => e.school).map(edu => ({ school: edu.school, degree: edu.degree, duration: `${edu.startDate}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate}`, desc: edu.description })),
  projects: formData.projects?.filter(p => p.name).map(proj => ({ name: proj.name, role: proj.role, link: proj.link, desc: proj.description })),
  certificates: formData.certificates?.filter(c => c.name).map(cert => ({ name: cert.name, organization: cert.organization, date: cert.date })),
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

  const handleEdit = (cv) => navigate('/editor', { state: { resumeToEdit: cv } });
  
  const handleCreateNew = () => setCurrentView ? setCurrentView('Overview') : navigate('/dashboard');

  // Tìm CV đang được chọn để lấy data truyền vào Modal Preview
  const activeResume = resumeList.find(cv => cv.id === previewOpenId);
  const activePreviewData = activeResume?.formData ? getPreviewData(activeResume.formData) : {};

  return (
    <Box sx={{ p: 4, flexGrow: 1, mt: "80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontFamily: "'Helvetica', sans-serif", mb: 0.5 }}>Your Collection</Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.7)">Manage and edit your created resumes here.</Typography>
        </Box>
        {hasResumes && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateNew} sx={{ bgcolor: "#52b0c3", textTransform: "none", "&:hover": { bgcolor: "#3d94a7" } }}>
            Create New
          </Button>
        )}
      </Box>

      {/* RẼ NHÁNH HIỂN THỊ */}
      {hasResumes ? (
        <Grid container spacing={4}>
          {resumeList.map((cv, index) => {
            const previewData = cv.formData ? getPreviewData(cv.formData) : {};
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id} sx={{ display: "flex", justifyContent: "center" }}>
                <ResumeCard 
                  cv={cv} index={index} previewData={previewData}
                  onDelete={handleDelete} onEdit={handleEdit} onPreview={setPreviewOpenId} 
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* EMPTY STATE */
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

      {/* POPUP */}
      <PreviewModal 
        isOpen={Boolean(previewOpenId)} 
        onClose={() => setPreviewOpenId(null)} 
        templateName={activeResume?.templateName || "Modern"} 
        previewData={activePreviewData} 
      />
    </Box>
  );
}