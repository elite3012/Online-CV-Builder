// src/components/Editor.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, TextField, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import EditorToolbar from "./EditorToolbar";
import EditorSidebar from "./EditorSidebar";
import PreviewModal from "./PreviewModal";

const sections = ["Personal Info", "Summary", "Education", "Experience", "Skills", "Projects", "Certificates"];

// Hàm dùng chung để render Header của các form
const FormHeader = ({ title }) => (
  <Typography variant="h5" fontWeight="bold" sx={{ color: "#102a43", mb: 4, textTransform: "uppercase" }}>{title}</Typography>
);

export default function Editor({ template: propTemplate, onBack: propOnBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const passedResume = location.state?.resumeToEdit;

  // --- STATE ---
  const [activeSection, setActiveSection] = useState("Personal Info");
  const [cvTitle, setCvTitle] = useState(passedResume?.title || "Untitled CV");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const currentTemplate = passedResume ? { name: passedResume.templateName } : propTemplate;

  const defaultFormData = {
    personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", website: "" },
    summary: "",
    education: [{ school: "", degree: "", startDate: "", endDate: "", description: "" }],
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    skills: "",
    projects: [{ name: "", role: "", link: "", description: "" }],
    certificates: [{ name: "", organization: "", date: "" }],
  };
  
  const [formData, setFormData] = useState(passedResume?.formData || defaultFormData);

  // --- EFFECTS & LOGIC ---
  useEffect(() => {
    if (saveStatus === "Unsaved") {
      const timer = setTimeout(() => setSaveStatus("Saved"), 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, saveStatus]);

  const handleBack = () => propOnBack ? propOnBack() : navigate(-1);
  const handleDataChange = (section, field, value) => { setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } })); setSaveStatus("Unsaved"); };
  const handleStringChange = (section, value) => { setFormData((prev) => ({ ...prev, [section]: value })); setSaveStatus("Unsaved"); };
  const handleArrayChange = (section, index, field, value) => { setFormData((prev) => { const newArray = [...prev[section]]; newArray[index][field] = value; return { ...prev, [section]: newArray }; }); setSaveStatus("Unsaved"); };
  const addArrayItem = (section, defaultObj) => { setFormData((prev) => ({ ...prev, [section]: [...prev[section], defaultObj] })); setSaveStatus("Unsaved"); };
  const removeArrayItem = (section, index) => { setFormData((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) })); setSaveStatus("Unsaved"); };

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
    name: formData.personalInfo.fullName || "Your Name", title: formData.personalInfo.jobTitle || "Your Title",
    contact: { email: formData.personalInfo.email || "email@example.com", phone: formData.personalInfo.phone || "", address: formData.personalInfo.location || "", linkedin: formData.personalInfo.linkedin || "", website: formData.personalInfo.website || "" },
    summary: formData.summary || "Summary goes here...",
    experience: formData.experience.filter((e) => e.company).map((exp) => ({ company: exp.company, role: exp.role, duration: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`, desc: exp.description })),
    skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
    education: formData.education.filter((e) => e.school).map((edu) => ({ school: edu.school, degree: edu.degree, duration: `${edu.startDate}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate}`, desc: edu.description })),
    projects: formData.projects.filter((p) => p.name).map((proj) => ({ name: proj.name, role: proj.role, link: proj.link, desc: proj.description })),
    certificates: formData.certificates.filter((c) => c.name).map((cert) => ({ name: cert.name, organization: cert.organization, date: cert.date })),
  };

  // --- COMPONENT RENDER MẢNG DÙNG CHUNG TẠI CHỖ ---
 const renderArraySection = (title, sectionKey, itemLabel, defaultObj, renderFields) => (
    <Box sx={{ width: "100%", maxWidth: "800px" }}>
      {formData[sectionKey].map((item, index) => (
        <Paper key={index} elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <FormHeader title={`${title} ${index + 1}`} />
            <IconButton onClick={() => removeArrayItem(sectionKey, index)} sx={{ color: "#f44336", bgcolor: "rgba(244, 67, 54, 0.1)" }}><DeleteOutlineIcon /></IconButton>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
            {renderFields(item, index)}
          </Box>
        </Paper>
      ))}
      <Button variant="contained" onClick={() => addArrayItem(sectionKey, defaultObj)} startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", color: "white", textTransform: "none", borderRadius: 8, px: 3, display: "flex", mx: "auto", "&:hover": { bgcolor: "#3d94a7" } }}>Add {itemLabel}</Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#f8f9fb" }}>
      
      {/* TOOLBAR */}
      <EditorToolbar 
        onBack={handleBack} cvTitle={cvTitle} setCvTitle={setCvTitle} 
        isEditingTitle={isEditingTitle} setIsEditingTitle={setIsEditingTitle} 
        templateName={currentTemplate?.name} saveStatus={saveStatus} 
        onPreview={() => setIsPreviewOpen(true)} onExport={() => alert("Chức năng Export PDF đang chờ code!")}
      />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        
        {/* SIDEBAR */}
        <EditorSidebar sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} checkSectionStatus={checkSectionStatus} />

        {/* WORKSPACE FORMS */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
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

          {activeSection === "Summary" && (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", width: "100%", maxWidth: "800px" }}>
              <FormHeader title="Executive Summary" />
              <TextField fullWidth multiline rows={6} placeholder="Write a brief and engaging summary..." value={formData.summary} onChange={(e) => handleStringChange("summary", e.target.value)} />
            </Paper>
          )}

          {activeSection === "Skills" && (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid #e0e0e0", width: "100%", maxWidth: "800px" }}>
              <FormHeader title="Skills & Competencies" />
              <TextField fullWidth multiline rows={3} placeholder="React.js, Node.js, Project Management..." value={formData.skills} onChange={(e) => handleStringChange("skills", e.target.value)} />
            </Paper>
          )}
          {activeSection === "Education" && renderArraySection(
            "Education", "education", "Education", { school: "", degree: "", startDate: "", endDate: "", description: "" }, 
            (edu, idx) => (
              <><TextField size="small" label="School *" value={edu.school} onChange={(e) => handleArrayChange("education", idx, "school", e.target.value)} /><TextField size="small" label="Degree *" value={edu.degree} onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)} /><TextField multiline rows={4} size="small" label="Description" value={edu.description} onChange={(e) => handleArrayChange("education", idx, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} /><TextField size="small" label="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange("education", idx, "startDate", e.target.value)} /><TextField size="small" label="End Date" value={edu.endDate} onChange={(e) => handleArrayChange("education", idx, "endDate", e.target.value)} /></>
          ))}

          {activeSection === "Experience" && renderArraySection(
            "Work Experience", "experience", "Job", { company: "", role: "", startDate: "", endDate: "", description: "" }, 
            (exp, idx) => (
              <><TextField size="small" label="Company *" value={exp.company} onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)} /><TextField size="small" label="Job Title *" value={exp.role} onChange={(e) => handleArrayChange("experience", idx, "role", e.target.value)} /><TextField multiline rows={4} size="small" label="Description" value={exp.description} onChange={(e) => handleArrayChange("experience", idx, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} /><TextField size="small" label="Start Date" value={exp.startDate} onChange={(e) => handleArrayChange("experience", idx, "startDate", e.target.value)} /><TextField size="small" label="End Date" value={exp.endDate} onChange={(e) => handleArrayChange("experience", idx, "endDate", e.target.value)} /></>
          ))}

          {activeSection === "Projects" && renderArraySection(
            "Project", "projects", "Project", { name: "", role: "", link: "", description: "" }, 
            (proj, idx) => (
              <><TextField size="small" label="Project Name *" value={proj.name} onChange={(e) => handleArrayChange("projects", idx, "name", e.target.value)} /><TextField size="small" label="Your Role" value={proj.role} onChange={(e) => handleArrayChange("projects", idx, "role", e.target.value)} /><TextField multiline rows={4} size="small" label="Description" value={proj.description} onChange={(e) => handleArrayChange("projects", idx, "description", e.target.value)} sx={{ gridRow: { sm: "span 2" } }} /><TextField size="small" label="Link" value={proj.link} onChange={(e) => handleArrayChange("projects", idx, "link", e.target.value)} sx={{ gridColumn: { sm: "span 2" } }} /></>
          ))}

          {activeSection === "Certificates" && renderArraySection(
            "Certificate", "certificates", "Certificate", { name: "", organization: "", date: "" }, 
            (cert, idx) => (
              <><TextField size="small" label="Certificate Name *" value={cert.name} onChange={(e) => handleArrayChange("certificates", idx, "name", e.target.value)} /><TextField size="small" label="Organization" value={cert.organization} onChange={(e) => handleArrayChange("certificates", idx, "organization", e.target.value)} /><TextField size="small" label="Date" value={cert.date} onChange={(e) => handleArrayChange("certificates", idx, "date", e.target.value)} /></>
          ))}
          <Box sx={{ height: 100 }} />
        </Box>
      </Box>

      {/* POPUP PREVIEW */}
      <PreviewModal 
        isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} 
        templateName={currentTemplate?.name || "Modern"} previewData={previewData} 
      />
    </Box>
  );
}