// src/components/Editor.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Box, Typography, Button, Paper, TextField, Divider, IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "motion/react";

import CVRenderer from "./template/CVRenderer";

const sections = [
  "Personal Info", "Summary", "Education", "Experience", "Skills", "Projects", "Certificates",
];

export default function Editor({ template, onBack }) {
  const [activeSection, setActiveSection] = useState("Personal Info");
  const [cvTitle, setCvTitle] = useState("ExampleCV1");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", website: "" },
    summary: "",
    education: [{ school: "", degree: "", startDate: "", endDate: "", description: "" }],
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    skills: "",
    projects: [{ name: "", role: "", link: "", description: "" }],
    certificates: [{ name: "", organization: "", date: "" }],
  });

  useEffect(() => {
    if (saveStatus === "Unsaved") {
      const timer = setTimeout(() => setSaveStatus("Saved"), 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, saveStatus]);

  const handleDataChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    setSaveStatus("Unsaved");
  };

  const handleStringChange = (section, value) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
    setSaveStatus("Unsaved");
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray[index][field] = value;
      return { ...prev, [section]: newArray };
    });
    setSaveStatus("Unsaved");
  };

  const addArrayItem = (section, defaultObj) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], defaultObj] }));
    setSaveStatus("Unsaved");
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    setSaveStatus("Unsaved");
  };

  const checkSectionStatus = (sec) => {
    switch (sec) {
      case "Personal Info": return formData.personalInfo.fullName && formData.personalInfo.jobTitle && formData.personalInfo.email;
      case "Summary": return formData.summary.trim().length > 0;
      case "Education": return formData.education.length > 0 && formData.education.every((e) => e.school && e.degree);
      case "Experience": return formData.experience.length > 0 && formData.experience.every((e) => e.company && e.role);
      case "Skills": return formData.skills.trim().length > 0;
      case "Projects": return formData.projects.length > 0 && formData.projects.every((p) => p.name);
      case "Certificates": return formData.certificates.length > 0 && formData.certificates.every((c) => c.name);
      default: return false;
    }
  };

  const previewData = {
    name: formData.personalInfo.fullName || "Your Name",
    title: formData.personalInfo.jobTitle || "Your Title",
    avatar: "https://i.pravatar.cc/150?img=11", 
    contact: {
      email: formData.personalInfo.email || "email@example.com",
      phone: formData.personalInfo.phone || "",
      address: formData.personalInfo.location || "",
      linkedin: formData.personalInfo.linkedin || "", 
      website: formData.personalInfo.website || "",   
    },
    summary: formData.summary || "Summary goes here...",
    
    experience: formData.experience.filter((e) => e.company).map((exp) => ({
      company: exp.company,
      role: exp.role,
      duration: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`,
      desc: exp.description,
    })),
    
    skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],

    //  EDUCATION
    education: formData.education.filter((e) => e.school).map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      duration: `${edu.startDate}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate}`,
      desc: edu.description,
    })),

    //  PROJECTS
    projects: formData.projects.filter((p) => p.name).map((proj) => ({
      name: proj.name,
      role: proj.role,
      link: proj.link,
      desc: proj.description,
    })),

    //  CERTIFICATES
    certificates: formData.certificates.filter((c) => c.name).map((cert) => ({
      name: cert.name,
      organization: cert.organization,
      date: cert.date,
    })),
  };

  const FormHeader = ({ title }) => (
    <Typography variant="h5" fontWeight="bold" sx={{ color: "#102a43", mb: 4, textTransform: "uppercase" }}>{title}</Typography>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#f8f9fb" }}>
      {/* 1. TOP TOOLBAR */}
      <Paper elevation={1} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5, zIndex: 10, borderRadius: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} size="small" sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          {isEditingTitle ? (
            <TextField
              size="small" value={cvTitle} autoFocus
              onChange={(e) => setCvTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
              sx={{ width: 150 }}
            />
          ) : (
            <Typography variant="h6" fontWeight="bold" onDoubleClick={() => setIsEditingTitle(true)}>{cvTitle}</Typography>
          )}
          <IconButton size="small" onClick={() => setIsEditingTitle(!isEditingTitle)}><EditIcon fontSize="small" color="action" /></IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">Template: <b>{template?.name || "Error"}</b></Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="body2" color={saveStatus === "Saved" ? "success.main" : "warning.main"} sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 95, whiteSpace: "nowrap" }}>
            {saveStatus === "Saved" ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />} {saveStatus}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setIsPreviewOpen(true)} sx={{ color: "#102a43", borderColor: "#e0e0e0", textTransform: "none" }}>Preview</Button>
          <Button variant="contained" size="small" sx={{ bgcolor: "#52b0c3", "&:hover": { bgcolor: "#3d94a7" }, textTransform: "none" }}>Export</Button>
        </Box>
      </Paper>

      {/* 2. MAIN WORKSPACE */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <Box sx={{ width: "250px", minWidth: "250px", bgcolor: "white", borderRight: "1px solid #e0e0e0", p: 3, overflowY: "auto" }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, letterSpacing: 1, display: "block" }}>SECTIONS</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {sections.map((sec) => {
              const isActive = activeSection === sec;
              const isValid = checkSectionStatus(sec);
              return (
                <Box
                  key={sec} onClick={() => setActiveSection(sec)}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, borderRadius: 2, cursor: "pointer", transition: "all 0.2s", bgcolor: isActive ? "rgba(82, 176, 195, 0.1)" : "transparent", color: isActive ? "#52b0c3" : "#455a64", fontWeight: isActive ? "bold" : "medium", "&:hover": { bgcolor: isActive ? "rgba(82, 176, 195, 0.1)" : "#f5f5f5" } }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "inherit" }}>{sec}</Typography>
                  {isValid ? <CheckCircleIcon color="success" sx={{ fontSize: 16 }} /> : <ErrorIcon color="error" sx={{ fontSize: 16, opacity: 0.5 }} />}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* WORKSPACE AREA */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          {/* PERSONAL INFO */}
          {activeSection === "Personal Info" && (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", width: "100%", maxWidth: "800px" }}>
              <FormHeader title="Personal Information" />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 3 }}>
                <TextField size="small" label="Full Name *" value={formData.personalInfo.fullName} onChange={(e) => handleDataChange("personalInfo", "fullName", e.target.value)} />
                <TextField size="small" label="Job Title *" value={formData.personalInfo.jobTitle} onChange={(e) => handleDataChange("personalInfo", "jobTitle", e.target.value)} />
                <TextField size="small" label="Email *" value={formData.personalInfo.email} onChange={(e) => handleDataChange("personalInfo", "email", e.target.value)} />
                <TextField size="small" label="Phone" value={formData.personalInfo.phone} onChange={(e) => handleDataChange("personalInfo", "phone", e.target.value)} />
                <TextField size="small" label="Location" value={formData.personalInfo.location} onChange={(e) => handleDataChange("personalInfo", "location", e.target.value)} />
                <TextField size="small" label="LinkedIn" value={formData.personalInfo.linkedin} onChange={(e) => handleDataChange("personalInfo", "linkedin", e.target.value)} />
                <TextField size="small" label="Website / Portfolio" value={formData.personalInfo.website} onChange={(e) => handleDataChange("personalInfo", "website", e.target.value)} sx={{ gridColumn: { sm: "span 2" } }} />
              </Box>
            </Paper>
          )}

          {/* SUMMARY */}
          {activeSection === "Summary" && (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", width: "100%", maxWidth: "800px" }}>
              <FormHeader title="Executive Summary" />
              <TextField fullWidth multiline rows={6} placeholder="Write a brief and engaging summary..." value={formData.summary} onChange={(e) => handleStringChange("summary", e.target.value)} />
            </Paper>
          )}

          {/* EDUCATION */}
          {activeSection === "Education" && (
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              {formData.education.map((edu, index) => (
                <Paper key={index} elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <FormHeader title={`Education ${index + 1}`} />
                    <IconButton onClick={() => removeArrayItem("education", index)} sx={{ color: "#f44336", bgcolor: "rgba(244, 67, 54, 0.1)" }}><DeleteOutlineIcon /></IconButton>
                  </Box>
                  {/* CSS GRID: 3 Cột */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
                    <TextField size="small" label="School *" value={edu.school} onChange={(e) => handleArrayChange("education", index, "school", e.target.value)} />
                    <TextField size="small" label="Degree *" value={edu.degree} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} />

                    <TextField multiline rows={4} size="small" label="Description" value={edu.description} onChange={(e) => handleArrayChange("education", index, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} />
                    <TextField size="small" label="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)} />
                    <TextField size="small" label="End Date" value={edu.endDate} onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)} />
                  </Box>
                </Paper>
              ))}
              <Button variant="contained" onClick={() => addArrayItem("education", { school: "", degree: "", startDate: "", endDate: "", description: "" })} startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", color: "white", textTransform: "none", borderRadius: 8, px: 3, display: "flex", mx: "auto", "&:hover": { bgcolor: "#3d94a7" } }}>Add Education</Button>
            </Box>
          )}

          {/* EXPERIENCE */}
          {activeSection === "Experience" && (
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              {formData.experience.map((exp, index) => (
                <Paper key={index} elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <FormHeader title={`Work Experience ${index + 1}`} />
                    <IconButton onClick={() => removeArrayItem("experience", index)} sx={{ color: "#f44336", bgcolor: "rgba(244, 67, 54, 0.1)" }}><DeleteOutlineIcon /></IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
                    <TextField size="small" label="Company *" value={exp.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} />
                    <TextField size="small" label="Job Title *" value={exp.role} onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)} />

                    <TextField multiline rows={4} size="small" label="Description" value={exp.description} onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} />
                    <TextField size="small" label="Start Date" value={exp.startDate} onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)} />
                    <TextField size="small" label="End Date" value={exp.endDate} onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)} />
                  </Box>
                </Paper>
              ))}
              <Button variant="contained" onClick={() => addArrayItem("experience", { company: "", role: "", startDate: "", endDate: "", description: "" })} startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", color: "white", textTransform: "none", borderRadius: 8, px: 3, display: "flex", mx: "auto", "&:hover": { bgcolor: "#3d94a7" } }}>Add Job</Button>
            </Box>
          )}

          {/* SKILLS */}
          {activeSection === "Skills" && (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", width: "100%", maxWidth: "800px" }}>
              <FormHeader title="Skills & Competencies" />
              <TextField fullWidth multiline rows={3} placeholder="React.js, Node.js, Project Management..." value={formData.skills} onChange={(e) => handleStringChange("skills", e.target.value)} />
            </Paper>
          )}

          {/* PROJECTS */}
          {activeSection === "Projects" && (
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              {formData.projects.map((proj, index) => (
                <Paper key={index} elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <FormHeader title={`Project ${index + 1}`} />
                    <IconButton onClick={() => removeArrayItem("projects", index)} sx={{ color: "#f44336", bgcolor: "rgba(244, 67, 54, 0.1)" }}><DeleteOutlineIcon /></IconButton>
                  </Box>
                  {/* CSS GRID: 3 Cột */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
                    <TextField size="small" label="Project Name *" value={proj.name} onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)} />
                    <TextField size="small" label="Your Role" value={proj.role} onChange={(e) => handleArrayChange("projects", index, "role", e.target.value)} />
                    <TextField multiline rows={4} size="small" label="Description" value={proj.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} />
                    <TextField size="small" label="Link" value={proj.link} onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)} sx={{ gridColumn: { sm: "span 2" } }} />
                  </Box>
                </Paper>
              ))}
              <Button variant="contained" onClick={() => addArrayItem("projects", { name: "", role: "", link: "", description: "" })} startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", color: "white", textTransform: "none", borderRadius: 8, px: 3, display: "flex", mx: "auto", "&:hover": { bgcolor: "#3d94a7" } }}>Add Project</Button>
            </Box>
          )}

          {/* CERTIFICATES */}
          {activeSection === "Certificates" && (
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              {formData.certificates.map((cert, index) => (
                <Paper key={index} elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <FormHeader title={`Certificate ${index + 1}`} />
                    <IconButton onClick={() => removeArrayItem("certificates", index)} sx={{ color: "#f44336", bgcolor: "rgba(244, 67, 54, 0.1)" }}><DeleteOutlineIcon /></IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
                    <TextField size="small" label="Certificate Name *" value={cert.name} onChange={(e) => handleArrayChange("certificates", index, "name", e.target.value)} />
                    <TextField size="small" label="Organization" value={cert.organization} onChange={(e) => handleArrayChange("certificates", index, "organization", e.target.value)} />
                    <TextField size="small" label="Date" value={cert.date} onChange={(e) => handleArrayChange("certificates", index, "date", e.target.value)} />
                  </Box>
                </Paper>
              ))}
              <Button variant="contained" onClick={() => addArrayItem("certificates", { name: "", organization: "", date: "" })} startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", color: "white", textTransform: "none", borderRadius: 8, px: 3, display: "flex", mx: "auto", "&:hover": { bgcolor: "#3d94a7" } }}>Add Certificate</Button>
            </Box>
          )}
          
          <Box sx={{ height: 100 }} />
        </Box>
      </Box>

      {/* POPUP LIVE PREVIEW */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setIsPreviewOpen(false)}
              style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", overflowY: "auto", cursor: "zoom-out" }}
            >
              <IconButton onClick={() => setIsPreviewOpen(false)} sx={{ position: "fixed", top: 20, right: 30, color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                <CloseIcon />
              </IconButton>
              <motion.div
                initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()} style={{ cursor: "default", marginBottom: "40px", backgroundColor: "white", borderRadius: "8px" }}
              >
                <CVRenderer templateName={template?.name} data={previewData} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body
      )}
    </Box>
  );
}