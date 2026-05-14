import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { apiService } from '../services/apiService';
import { templates } from '../data/templates';
import { mapCvFromApi } from '../utils/cvMappers';

const ACCEPTED_FILE_TYPES = '.pdf,.docx,.txt,.md';

const supportedTemplateIds = new Set(templates.map((template) => template.id));

export default function CVImportDialog({
  open,
  onClose,
  onImported,
  defaultTemplateId = templates[0]?.id ?? 1,
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplateId);
  const [isImporting, setIsImporting] = useState(false);
  const [serverError, setServerError] = useState('');

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.id === selectedTemplateId)
      || templates[0],
    [selectedTemplateId],
  );

  const resetState = () => {
    setSelectedFile(null);
    setTitle('');
    setServerError('');
    setIsImporting(false);
    setSelectedTemplateId(
      supportedTemplateIds.has(defaultTemplateId)
        ? defaultTemplateId
        : templates[0]?.id ?? 1,
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isImporting) return;
    resetState();
    onClose();
  };

  const getErrorMessage = (error) => {
    try {
      const parsed = JSON.parse(error.message);
      return parsed.message || parsed.detail || 'Import failed.';
    } catch {
      return error.message || 'Import failed.';
    }
  };

  const handleFileChange = (event) => {
    const [file] = Array.from(event.target.files || []);
    setSelectedFile(file || null);
    setServerError('');
  };

  const handleImport = async () => {
    if (!selectedFile || !selectedTemplateId) {
      setServerError('Select a CV file and template before importing.');
      return;
    }

    setIsImporting(true);
    setServerError('');

    try {
      const result = await apiService.importCV({
        file: selectedFile,
        templateId: selectedTemplateId,
        title,
      });

      const importedCv = mapCvFromApi(result.cv);
      onImported?.({
        resumeToEdit: importedCv,
        importMeta: {
          detectedRole: result.detectedRole,
          suggestedTemplate: result.suggestedTemplate,
          confidence: result.confidence,
          insights: result.insights || [],
        },
      });
      resetState();
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(7,17,28,0.98) 0%, rgba(10,22,34,0.96) 100%)',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1,
          }}
        >
          <AutoAwesomeIcon sx={{ color: '#52b0c3' }} />
          <Typography variant="h5" fontWeight={800}>
            Import your CV, then re-style it instantly
          </Typography>
        </Box>
        <Typography color="rgba(255,255,255,0.72)" variant="body2">
          Upload an existing PDF or DOCX and let the AI parser turn it into an
          editable resume you can tune for AI, data, and ML recruiters.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
            gap: 3,
          }}
        >
          <Box>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px dashed rgba(82,176,195,0.6)',
                bgcolor: 'rgba(82,176,195,0.08)',
                mb: 2.5,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  bgcolor: '#52b0c3',
                  color: '#07111c',
                  textTransform: 'none',
                  fontWeight: 800,
                  '&:hover': { bgcolor: '#79d2e3' },
                }}
              >
                Choose CV file
              </Button>

              <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.8)' }}>
                Supported formats: PDF, DOCX, TXT, MD
              </Typography>

              {selectedFile && (
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <InsertDriveFileIcon sx={{ color: '#def4c6' }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>
                      {selectedFile.name}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.62)" variant="body2">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Resume title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Optional: AI Resume Lab - ML Engineer"
              disabled={isImporting}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.04)',
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.68)' },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Chip
                label="AI import"
                sx={{ bgcolor: 'rgba(82,176,195,0.16)', color: '#9de5f1' }}
              />
              <Chip
                label="Editable sections"
                sx={{ bgcolor: 'rgba(222,244,198,0.16)', color: '#def4c6' }}
              />
              <Chip
                label="Template switch ready"
                sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }}
              />
            </Box>

            {serverError && (
              <Alert severity="error" sx={{ mt: 2.5 }}>
                {serverError}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              Pick the first template the recruiter will see
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
              }}
            >
              {templates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <Card
                    key={template.id}
                    sx={{
                      borderRadius: 3,
                      border: isSelected
                        ? '1px solid #52b0c3'
                        : '1px solid rgba(255,255,255,0.1)',
                      bgcolor: isSelected
                        ? 'rgba(82,176,195,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      color: 'white',
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelectedTemplateId(template.id)}
                      disabled={isImporting}
                    >
                      <Box
                        sx={{
                          height: 112,
                          backgroundImage: `linear-gradient(180deg, rgba(7,17,28,0) 0%, rgba(7,17,28,0.72) 100%), url(${template.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top',
                        }}
                      />
                      <CardContent>
                        <Typography fontWeight={800}>{template.name}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.68)',
                            minHeight: 42,
                          }}
                        >
                          {template.desc}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Box>

            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography fontWeight={700} sx={{ mb: 0.75 }}>
                Starting look
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.72)">
                {selectedTemplate?.name}: {selectedTemplate?.desc}
              </Typography>
            </Box>
          </Box>
        </Box>

        {isImporting && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              sx={{
                borderRadius: 999,
                height: 8,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  background:
                    'linear-gradient(90deg, #52b0c3 0%, #def4c6 100%)',
                },
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: '#def4c6' }}>
              Parsing sections, extracting skills, and preparing your editable
              resume...
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            mt: 3.5,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isImporting}
            sx={{ color: 'rgba(255,255,255,0.72)', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            sx={{
              bgcolor: '#def4c6',
              color: '#102a43',
              textTransform: 'none',
              fontWeight: 800,
              px: 2.5,
              '&:hover': { bgcolor: '#ccebb0' },
            }}
          >
            Import and open editor
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
