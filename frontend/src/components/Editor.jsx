// src/components/Editor.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import EditorToolbar from './EditorToolbar';
import EditorSidebar from './EditorSidebar';
import PreviewModal from './PreviewModal';
import CVRenderer from './template/CVRenderer';

import { apiService } from '../services/apiService';

import { templates } from '../data/templates';
import { TemplateCard } from './TemplateCard';

const sections = [
  'Personal Info',
  'Summary',
  'Education',
  'Experience',
  'Skills',
  'Projects',
  'Certificates',
];

const FormHeader = ({ title }) => (
  <Typography
    variant="h5"
    fontWeight="bold"
    sx={{ color: '#102a43', mb: 4, textTransform: 'uppercase' }}
  >
    {title}
  </Typography>
);

export default function Editor({ template: propTemplate, onBack: propOnBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const passedResume = location.state?.resumeToEdit;
  const componentRef = useRef();
  const autosaveTimerRef = useRef(null);
  const abortRef = useRef(null);
  const didInitRef = useRef(false);

  const getTemplateIdByName = (name) => {
    const t = templates.find((x) => x.name === name);
    return t?.id ?? null;
  };

  const hasAnyText = (v) => String(v ?? '').trim().length > 0;

  const isRowEmpty = (row) => {
    if (!row || typeof row !== 'object') return true;
    return !Object.values(row).some((v) => hasAnyText(v));
  };

  const skillsStringToList = (skillsStr) => {
    return String(skillsStr ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((skillName) => ({ skillName }));
  };

  const toLocalDateTimeString = (value) => {
    const v = String(value ?? '').trim();
    if (!v) return null;

    // HTML date input -> LocalDateTime at midnight
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v}T00:00:00`;

    // Unknown format -> avoid sending invalid string that crashes backend
    return null;
  };

  const normalizeDateFields = (row, fields) => {
    if (!row || typeof row !== 'object') return row;
    const out = { ...row };
    for (const f of fields) out[f] = toLocalDateTimeString(row[f]);
    return out;
  };

  const toUpdatePayload = () => {
    return {
      title: cvTitle,
      summary: formData.summary ?? '',

      personalInformation: {
        fullName: formData.personalInfo.fullName ?? '',
        jobTitle: formData.personalInfo.jobTitle ?? '',
        email: formData.personalInfo.email ?? '',
        phone: formData.personalInfo.phone ?? '',
        location: formData.personalInfo.location ?? '',
        linkedin: formData.personalInfo.linkedin ?? '',
        website: formData.personalInfo.website ?? '',
      },

      educations: (formData.education || [])
        .filter((r) => !isRowEmpty(r))
        .map((r) => normalizeDateFields(r, ['startDate', 'endDate'])),
      experiences: (formData.experience || [])
        .filter((r) => !isRowEmpty(r))
        .map((r) => normalizeDateFields(r, ['startDate', 'endDate'])),
      projects: (formData.projects || []).filter((r) => !isRowEmpty(r)),
      certificates: (formData.certificates || [])
        .filter((r) => !isRowEmpty(r))
        .map((r) => normalizeDateFields(r, ['date'])),

      skills: skillsStringToList(formData.skills),
    };
  };

  // --- STATE ---
  const [activeSection, setActiveSection] = useState('Personal Info');
  const [cvTitle, setCvTitle] = useState(passedResume?.title || 'Untitled CV');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState({
    name: passedResume?.templateName || propTemplate?.name,
  });
  const [cvId, setCvId] = useState(passedResume?.id ?? null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [formData, setFormData] = useState(
    passedResume?.formData || {
      summary: '',
      title: '',
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      },
      education: [
        { school: '', degree: '', startDate: '', endDate: '', description: '' },
      ],
      experience: [
        {
          company: '',
          jobTitle: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
      skills: '',
      projects: [{ projectName: '', role: '', link: '', description: '' }],
      certificates: [{ certificateName: '', organization: '', date: '' }],
    },
  );

  // --- HÀM TẢI PDF ---
  const handleDownloadPDF = async () => {
    const element = componentRef.current;
    if (!element) return;

    setSaveStatus('Exporting...');
    const hiddenBox = element.parentElement;

    // 1. TẠO MỘT CONTAINER TẠM THỜI ĐỂ "THẢ" CV RA
    // Container này nằm ngoài màn hình để user không thấy
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // Đẩy ra xa màn hình
    tempContainer.style.top = '0';

    // Ép kích thước A4 chuẩn cho temp container
    // Kích thước A4 ở scale 1x, 96 DPI thường là ~794px x 1123px
    tempContainer.style.width = '794px';
    tempContainer.style.height = '1123px';
    tempContainer.style.overflow = 'hidden'; // Cắt bớt phần thừa nếu có
    document.body.appendChild(tempContainer);

    // 2. DI CHUYỂN CVRenderer THỰC VÀO CONTAINER TẠM THỜI
    // Tạm thời hiện Box gốc để di chuyển nội dung
    hiddenBox.style.display = 'block';
    tempContainer.appendChild(element);

    try {
      // 3. CHỤP ẢNH TỪ CONTAINER TẠM THỜI ĐÃ ĐƯỢC ÉP KÍCH THƯỚC ĐẸP
      const canvas = await html2canvas(element, {
        scale: 2, // retina quality
        useCORS: true,
        logging: false,
        width: 794, // Chụp đúng chiều rộng A4
        height: 1123, // Chụp đúng chiều cao A4
      });

      const imgData = canvas.toDataURL('image/png');

      // 4. ĐÓNG GÓI PDF A4 CHUẨN
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Vẽ ảnh full trang A4 mm
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvTitle.replace(/\s+/g, '_')}.pdf`);

      setSaveStatus('Saved');
    } catch (err) {
      console.error('Export error:', err);
      setSaveStatus('Error');
    } finally {
      // 5. DỌN DẸP: DI CHUYỂN CVRenderer VỀ CHỖ CŨ VÀ XOÁ TEMP
      hiddenBox.appendChild(element);
      hiddenBox.style.display = 'none';
      document.body.removeChild(tempContainer);
    }
  };

  // --- LOGIC HANDLERS ---
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }

    if (saveStatus !== 'Unsaved') return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      doAutosave();
    }, 5000);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [formData, saveStatus, cvTitle]);

  const setCvTitleDirty = (next) => {
    setCvTitle((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      if (resolved !== prev) setSaveStatus('Unsaved');
      return resolved;
    });
  };

  const doAutosave = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setSaveStatus('Saving...');
      let ensuredId = cvId;
      if (!ensuredId) {
        const templateId = getTemplateIdByName(currentTemplate?.name);
        if (!templateId)
          throw new Error('Template not found (missing templateId)');

        const created = await apiService.createCV(
          { templateId: templateId, title: cvTitle },
          { signal: controller.signal },
        );

        ensuredId = created?.id;
        if (!ensuredId) throw new Error('Create CV did not return an id');
        setCvId(ensuredId);
      }

      const payload = toUpdatePayload();
      console.log(payload);
      await apiService.updateCV(ensuredId, payload, {
        signal: controller.signal,
      });
      setSaveStatus('Saved');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.error('Autosave failed:', err);
      setSaveStatus('Error');
    }
  };
  const handleBack = () => (propOnBack ? propOnBack() : navigate(-1));
  const handleDataChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaveStatus('Unsaved');
  };
  const handleStringChange = (section, value) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
    setSaveStatus('Unsaved');
  };
  const handleArrayChange = (section, index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray[index][field] = value;
      return { ...prev, [section]: newArray };
    });
    setSaveStatus('Unsaved');
  };
  const addArrayItem = (section, defaultObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultObj],
    }));
    setSaveStatus('Unsaved');
  };
  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
    setSaveStatus('Unsaved');
  };

  const checkSectionStatus = (sec) => {
    switch (sec) {
      case 'Personal Info':
        return (
          formData.personalInfo.fullName &&
          formData.personalInfo.jobTitle &&
          formData.personalInfo.email
        );
      case 'Summary':
        return formData.summary.trim().length > 0;
      case 'Education':
        return (
          formData.education.length > 0 &&
          formData.education.every((e) => e.school && e.degree)
        );
      case 'Experience':
        return (
          formData.experience.length > 0 &&
          formData.experience.every((e) => e.company && e.jobTitle)
        );
      case 'Skills':
        return formData.skills.trim().length > 0;
      case 'Projects':
        return (
          formData.projects.length > 0 &&
          formData.projects.every((p) => p.projectName)
        );
      case 'Certificates':
        return (
          formData.certificates.length > 0 &&
          formData.certificates.every((c) => c.certificateName)
        );
      default:
        return false;
    }
  };

  const previewData = {
    name: formData.personalInfo.fullName || 'Your Name',
    title: formData.personalInfo.jobTitle || 'Your Title',
    contact: {
      email: formData.personalInfo.email || 'email@example.com',
      phone: formData.personalInfo.phone || '',
      address: formData.personalInfo.location || '',
      linkedin: formData.personalInfo.linkedin || '',
      website: formData.personalInfo.website || '',
    },
    summary: formData.summary || 'Summary goes here...',
    experience: formData.experience
      .filter((e) => e.company)
      .map((exp) => ({
        company: exp.company,
        role: exp.role,
        duration: `${exp.startDate} - ${exp.endDate}`,
        desc: exp.description,
      })),
    skills: formData.skills
      ? formData.skills.split(',').map((s) => s.trim())
      : [],
    education: formData.education
      .filter((e) => e.school)
      .map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        duration: `${edu.startDate} - ${edu.endDate}`,
        desc: edu.description,
      })),
    projects: formData.projects
      .filter((p) => p.name)
      .map((proj) => ({
        name: proj.name,
        role: proj.role,
        link: proj.link,
        desc: proj.description,
      })),
    certificates: formData.certificates
      .filter((c) => c.name)
      .map((cert) => ({
        name: cert.name,
        organization: cert.organization,
        date: cert.date,
      })),
  };

  const renderArraySection = (
    title,
    sectionKey,
    itemLabel,
    defaultObj,
    renderFields,
  ) => (
    <Box sx={{ width: '100%', maxWidth: '800px' }}>
      {formData[sectionKey].map((item, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{ p: 5, borderRadius: 3, border: '1px solid #e0e0e0', mb: 3 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <FormHeader title={`${title} ${index + 1}`} />
            <IconButton
              onClick={() => removeArrayItem(sectionKey, index)}
              sx={{ color: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)' }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {renderFields(item, index)}
          </Box>
        </Paper>
      ))}
      <Button
        variant="contained"
        onClick={() => addArrayItem(sectionKey, defaultObj)}
        startIcon={<AddIcon />}
        sx={{
          bgcolor: '#52b0c3',
          color: 'white',
          textTransform: 'none',
          borderRadius: 8,
          px: 3,
          display: 'flex',
          mx: 'auto',
          '&:hover': { bgcolor: '#3d94a7' },
        }}
      >
        Add {itemLabel}
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#f8f9fb',
      }}
    >
      <EditorToolbar
        onBack={handleBack}
        cvTitle={cvTitle}
        setCvTitle={setCvTitleDirty}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        templateName={currentTemplate?.name}
        saveStatus={saveStatus}
        onPreview={() => setIsPreviewOpen(true)}
        onExport={handleDownloadPDF}
        onChangeTemplate={() => setIsTemplateModalOpen(true)}
      />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <EditorSidebar
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          checkSectionStatus={checkSectionStatus}
        />

        <Box
          sx={{
            flexGrow: 1,
            p: 5,
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {activeSection === 'Personal Info' && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                width: '100%',
                maxWidth: '800px',
              }}
            >
              <FormHeader title="Personal Information" />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                }}
              >
                <TextField
                  size="small"
                  label="Full Name *"
                  value={formData.personalInfo.fullName}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'fullName', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="Job Title *"
                  value={formData.personalInfo.jobTitle}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'jobTitle', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="Email *"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'email', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="Phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'phone', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="Location"
                  value={formData.personalInfo.location}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'location', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="LinkedIn"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'linkedin', e.target.value)
                  }
                />
                <TextField
                  size="small"
                  label="Website / Portfolio"
                  value={formData.personalInfo.website}
                  onChange={(e) =>
                    handleDataChange('personalInfo', 'website', e.target.value)
                  }
                  sx={{ gridColumn: { sm: 'span 2' } }}
                />
              </Box>
            </Paper>
          )}

          {activeSection === 'Summary' && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                width: '100%',
                maxWidth: '800px',
              }}
            >
              <FormHeader title="Executive Summary" />
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Write a brief and engaging summary..."
                value={formData.summary}
                onChange={(e) => handleStringChange('summary', e.target.value)}
              />
            </Paper>
          )}

          {activeSection === 'Skills' && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                width: '100%',
                maxWidth: '800px',
              }}
            >
              <FormHeader title="Skills & Competencies" />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="React.js, Node.js, Project Management..."
                value={formData.skills}
                onChange={(e) => handleStringChange('skills', e.target.value)}
              />
            </Paper>
          )}

          {/* Render các mục Array (Education, Experience, Projects, Certificates) */}
          {activeSection === 'Education' &&
            renderArraySection(
              'Education',
              'education',
              'Education',
              {
                school: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
              },
              (edu, idx) => (
                <>
                  <TextField
                    size="small"
                    label="School *"
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayChange(
                        'education',
                        idx,
                        'school',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    label="Degree *"
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayChange(
                        'education',
                        idx,
                        'degree',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    multiline
                    rows={4}
                    size="small"
                    label="Description"
                    value={edu.description}
                    onChange={(e) =>
                      handleArrayChange(
                        'education',
                        idx,
                        'description',
                        e.target.value,
                      )
                    }
                    sx={{ gridRow: { sm: 'span 2' } }}
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(e) =>
                      handleArrayChange(
                        'education',
                        idx,
                        'startDate',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="End Date"
                    value={edu.endDate}
                    onChange={(e) =>
                      handleArrayChange(
                        'education',
                        idx,
                        'endDate',
                        e.target.value,
                      )
                    }
                  />
                </>
              ),
            )}
          {activeSection === 'Experience' &&
            renderArraySection(
              'Work Experience',
              'experience',
              'Job',
              {
                company: '',
                jobTitle: '',
                startDate: '',
                endDate: '',
                description: '',
              },
              (exp, idx) => (
                <>
                  <TextField
                    size="small"
                    label="Company *"
                    value={exp.company}
                    onChange={(e) =>
                      handleArrayChange(
                        'experience',
                        idx,
                        'company',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    label="Job Title *"
                    value={exp.jobTitle}
                    onChange={(e) =>
                      handleArrayChange(
                        'experience',
                        idx,
                        'jobTitle',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    multiline
                    rows={4}
                    size="small"
                    label="Description"
                    value={exp.description}
                    onChange={(e) =>
                      handleArrayChange(
                        'experience',
                        idx,
                        'description',
                        e.target.value,
                      )
                    }
                    sx={{ gridRow: { sm: 'span 2' } }}
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleArrayChange(
                        'experience',
                        idx,
                        'startDate',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="End Date"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleArrayChange(
                        'experience',
                        idx,
                        'endDate',
                        e.target.value,
                      )
                    }
                  />
                </>
              ),
            )}
          {activeSection === 'Projects' &&
            renderArraySection(
              'Project',
              'projects',
              'Project',
              { projectName: '', role: '', link: '', description: '' },
              (proj, idx) => (
                <>
                  <TextField
                    size="small"
                    label="Project Name *"
                    value={proj.projectName}
                    onChange={(e) =>
                      handleArrayChange(
                        'projects',
                        idx,
                        'projectName',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    label="Your Role"
                    value={proj.role}
                    onChange={(e) =>
                      handleArrayChange('projects', idx, 'role', e.target.value)
                    }
                  />
                  <TextField
                    multiline
                    rows={4}
                    size="small"
                    label="Description"
                    value={proj.description}
                    onChange={(e) =>
                      handleArrayChange(
                        'projects',
                        idx,
                        'description',
                        e.target.value,
                      )
                    }
                    sx={{ gridRow: { sm: 'span 2' } }}
                  />
                  <TextField
                    size="small"
                    label="Link"
                    value={proj.link}
                    onChange={(e) =>
                      handleArrayChange('projects', idx, 'link', e.target.value)
                    }
                    sx={{ gridColumn: { sm: 'span 2' } }}
                  />
                </>
              ),
            )}
          {activeSection === 'Certificates' &&
            renderArraySection(
              'Certificate',
              'certificates',
              'Certificate',
              { certificateName: '', organization: '', date: '' },
              (cert, idx) => (
                <>
                  <TextField
                    size="small"
                    label="Certificate Name *"
                    value={cert.certificateName}
                    onChange={(e) =>
                      handleArrayChange(
                        'certificates',
                        idx,
                        'certificateName',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    label="Organization"
                    value={cert.organization}
                    onChange={(e) =>
                      handleArrayChange(
                        'certificates',
                        idx,
                        'organization',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="Date"
                    value={cert.date}
                    onChange={(e) =>
                      handleArrayChange(
                        'certificates',
                        idx,
                        'date',
                        e.target.value,
                      )
                    }
                  />
                </>
              ),
            )}

          <Box sx={{ height: 100 }} />
        </Box>
      </Box>

      {/* 3. VÙNG CHỨA CV ẨN (Để render dữ liệu thực cho PDF) */}
      <Box sx={{ display: 'none' }}>
        <Box ref={componentRef}>
          <CVRenderer
            templateName={currentTemplate?.name || 'Unknown'}
            data={previewData}
          />
        </Box>
      </Box>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        templateName={currentTemplate?.name || 'Unknown'}
        previewData={previewData}
      />
      <Dialog
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        maxWidth="lg" // Chỉnh to ra một chút để chứa được các thẻ
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mt: 2,
            fontSize: '1.5rem',
          }}
        >
          Choose a new Template
        </DialogTitle>
        <DialogContent sx={{ p: 4, bgcolor: '#f8f9fb' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, 250px)', // Tự động căn chỉnh bằng kích thước TemplateCard
              gap: 4,
              justifyContent: 'center',
              mx: 'auto',
              py: 2,
            }}
          >
            {templates.map((item) => (
              <Box key={item.id} sx={{ height: '450px' }}>
                {' '}
                {/* Fix chiều cao để BorderGlow không bị cắt */}
                <TemplateCard
                  item={item}
                  onPreview={() => {}} // Preview đã được xử lý ngầm bên trong TemplateCard rồi
                  onUse={() => {
                    setCurrentTemplate({ name: item.name }); // Cập nhật template mới
                    setSaveStatus('Unsaved'); // Kích hoạt trạng thái chưa lưu
                    setIsTemplateModalOpen(false); // Đóng Modal
                  }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
