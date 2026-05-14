// src/components/MyResumes.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { motion } from 'motion/react';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import ResumeCard from './ResumeCard';
import PreviewModal from './PreviewModal';
import CVImportDialog from './CVImportDialog';
import { apiService } from '../services/apiService';
import { getPreviewData, mapCvFromApi } from '../utils/cvMappers';

export default function MyResumes({ setCurrentView, searchQuery = '' }) {
  const [resumeList, setResumeList] = useState([]);
  const [previewOpenId, setPreviewOpenId] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
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
        const mapped = data.map(mapCvFromApi);
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
  const handleImportSuccess = ({ resumeToEdit, importMeta }) => {
    setResumeList((prev) => [resumeToEdit, ...prev.filter((cv) => cv.id !== resumeToEdit.id)]);
    setIsImportOpen(false);
    navigate(`/editor/${resumeToEdit.id}`, {
      state: { resumeToEdit, importMeta },
    });
  };

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
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setIsImportOpen(true)}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.28)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#52b0c3',
                  bgcolor: 'rgba(82,176,195,0.08)',
                },
              }}
            >
              Import CV
            </Button>
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
          </Box>
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => setIsImportOpen(true)}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.28)',
                      '&:hover': {
                        borderColor: '#52b0c3',
                        bgcolor: 'rgba(82,176,195,0.08)',
                      },
                    }}
                  >
                    Import Existing CV
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateNew}
                    sx={{ bgcolor: '#52b0c3', '&:hover': { bgcolor: '#3d94a7' } }}
                  >
                    Create New Resume
                  </Button>
                </Box>
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
      <CVImportDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImported={handleImportSuccess}
      />
    </Box>
  );
}
