// src/components/MyResumes.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { motion } from 'motion/react';
import AddIcon from '@mui/icons-material/Add';

import ResumeCard from './ResumeCard';
import PreviewModal from './PreviewModal';
import { apiService } from '../services/apiService';

const toDateDisplay = (value) => {
  const v = String(value ?? '').trim();
  const match = v.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : v;
};

const getPreviewData = (cv) => ({
  name: cv.personalInfo?.fullName,
  title: cv.personalInfo?.jobTitle,
  template: {
    templateName: cv.template.templateName,
  },
  contact: {
    email: cv.personalInfo?.email,
    phone: cv.personalInfo?.phone,
    address: cv.personalInfo?.location,
    linkedIn: cv.personalInfo?.linkedIn,
    website: cv.personalInfo?.website,
  },
  summary: cv.summary,
  experience:
    cv.experience
      ?.filter((e) => e.company)
      .map((exp) => ({
        company: exp.company,
        jobTitle: exp.jobTitle,
        duration: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`,
        desc: exp.description,
      })) || [],
  skills: cv.skills?.map((s) => s.skillName),
  education:
    cv.education
      ?.filter((e) => e.school)
      .map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        duration: `${edu.startDate}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate}`,
        desc: edu.description,
      })) || [],
  projects:
    cv.projects
      ?.filter((p) => p.projectName)
      .map((proj) => ({
        projectName: proj.projectName,
        role: proj.role,
        link: proj.link,
        desc: proj.description,
      })) || [],
  certificates:
    cv.certificates
      ?.filter((c) => c.certificateName)
      .map((cert) => ({
        certificateName: cert.certificateName,
        organization: cert.organization,
        date: toDateDisplay(cert.date ?? cert.issueDate),
      })) || [],
});

export default function MyResumes({ setCurrentView, searchQuery = '' }) {
  const [resumeList, setResumeList] = useState([]);
  const [previewOpenId, setPreviewOpenId] = useState(null);
  const navigate = useNavigate();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredResumeList = resumeList.filter((cv) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      cv.title,
      cv.summary,
      cv.personalInfo?.fullName,
      cv.personalInfo?.jobTitle,
      ...(cv.skills || []).map((skill) => skill.skillName),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  useEffect(() => {
    apiService
      .getCVList()
      .then((data) => {
        const mapped = data.map((cv) => {
          let parsedData = {
            id: cv.id,
            title: cv.title,
            updatedAt: cv.updatedAt ?? '',
            summary: cv.summary || '',
            template: cv.template || { templateName: 'Modern' },
            personalInfo: cv.personalInformation || {},
            education: cv.educations || [],
            experience: cv.experiences || [],
            projects: cv.projects || [],
            certificates:
              cv.certificates?.map((cert) => ({
                ...cert,
                date: toDateDisplay(cert.date ?? cert.issueDate),
              })) || [],
            skills: cv.skills || [],
          };
          return parsedData;
        });
        setResumeList(mapped);
      })
      .catch((err) => console.error(err));
  }, []);

  const hasAnyResumes = resumeList.length > 0;
  const hasFilteredResumes = filteredResumeList.length > 0;

  const handleDelete = (idToDelete) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      apiService
        .deleteCV(idToDelete)
        .then(() => {
          setResumeList(resumeList.filter((cv) => cv.id !== idToDelete));
        })
        .catch((err) => alert('Failed to delete'));
    }
  };

  const handleEdit = (cv) =>
    navigate(`/editor/${cv.id}`, { state: { resumeToEdit: cv } });

  const handleCreateNew = () =>
    setCurrentView ? setCurrentView('Overview') : navigate('/dashboard');

  const activeResume = filteredResumeList.find((cv) => cv.id === previewOpenId)
    || resumeList.find((cv) => cv.id === previewOpenId);
  const activePreviewData = activeResume ? getPreviewData(activeResume) : null;

  return (
    <Box
      sx={{
        p: 4,
        flexGrow: 1,
        mt: '80px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="white"
            sx={{ fontFamily: "'Helvetica', sans-serif", mb: 0.5 }}
          >
            Your Collection
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.7)">
            {hasAnyResumes
              ? `Showing ${filteredResumeList.length} of ${resumeList.length} resumes`
              : 'Manage and edit your created resumes here.'}
          </Typography>
        </Box>
        {hasAnyResumes && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              bgcolor: '#52b0c3',
              textTransform: 'none',
              '&:hover': { bgcolor: '#3d94a7' },
            }}
          >
            Create New
          </Button>
        )}
      </Box>

      {hasAnyResumes && hasFilteredResumes ? (
        <Grid container spacing={4}>
          {filteredResumeList.map((cv, index) => {
            const previewData = cv ? getPreviewData(cv) : {};
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={cv.id}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <ResumeCard
                  cv={cv}
                  index={index}
                  previewData={previewData}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onPreview={setPreviewOpenId}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Paper
              sx={{
                p: 5,
                textAlign: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                width: '100%',
                maxWidth: 500,
              }}
            >
              <Typography color="white" variant="h6" sx={{ mb: 1 }}>
                {hasAnyResumes
                  ? 'No resumes match your search.'
                  : "You haven't created any resumes yet."}
              </Typography>
              <Typography
                color="rgba(255,255,255,0.5)"
                variant="body2"
                sx={{ mb: 3 }}
              >
                {hasAnyResumes
                  ? 'Try a different keyword to find a resume.'
                  : 'Start building your professional profile today.'}
              </Typography>
              {hasAnyResumes ? null : (
                <Button
                  variant="contained"
                  onClick={handleCreateNew}
                  sx={{ bgcolor: '#52b0c3', '&:hover': { bgcolor: '#3d94a7' } }}
                >
                  Create New Resume
                </Button>
              )}
            </Paper>
          </Box>
        </motion.div>
      )}

      {/* POPUP */}
      <PreviewModal
        isOpen={Boolean(previewOpenId)}
        onClose={() => setPreviewOpenId(null)}
        templateName={activeResume?.template.templateName || 'Modern'}
        previewData={activePreviewData}
      />
    </Box>
  );
}
