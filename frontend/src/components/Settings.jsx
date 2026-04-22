import { useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
  PASSWORD_MIN_LENGTH,
  validateEmail,
  validateMatchingPassword,
  validateMinLength,
  validatePassword,
  validateRequired,
} from '../utils/validation';

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: 'quy10z',
    email: 'quy10z@cvbuilder.com',
    avatar: null,
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: 'success' });

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showStatus = (msg, type = 'success') => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
  };

  const validateProfile = () => {
    const nextErrors = {};
    const fullName = profile.fullName.trim();
    const email = profile.email.trim();

    if (!validateRequired(fullName)) {
      nextErrors.fullName = 'Full name is required.';
    } else if (!validateMinLength(fullName, 2)) {
      nextErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!validateRequired(email)) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    return nextErrors;
  };

  const validatePasswordForm = () => {
    const nextErrors = {};

    if (!validateRequired(passwords.current)) {
      nextErrors.current = 'Current password is required.';
    }

    if (!validatePassword(passwords.new)) {
      nextErrors.new = `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    if (!validateRequired(passwords.confirm)) {
      nextErrors.confirm = 'Please confirm your new password.';
    } else if (!validateMatchingPassword(passwords.new, passwords.confirm)) {
      nextErrors.confirm = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleUpdate = (type) => {
    if (type === 'profile') {
      const nextErrors = validateProfile();
      setProfileErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        showStatus('Please fix the highlighted profile fields.', 'error');
        return;
      }

      showStatus('Profile updated!');
      return;
    }

    const nextErrors = validatePasswordForm();
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showStatus('Please fix the highlighted password fields.', 'error');
      return;
    }

    setPasswords({ current: '', new: '', confirm: '' });
    showStatus('Password changed!');
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: '#52b0c3' },
      '&.Mui-focused fieldset': { borderColor: '#52b0c3' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#52b0c3' },
    '& .MuiFormHelperText-root': { color: '#f87171' },
  };

  return (
    <Box sx={{ p: 4, mt: '80px', maxWidth: '1000px', mx: 'auto' }}>
      {status.msg && (
        <Alert severity={status.type} sx={{ mb: 3 }}>
          {status.msg}
        </Alert>
      )}

      <Stack spacing={4}>
        <Paper elevation={0} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <PersonIcon sx={{ color: '#52b0c3' }} />
            <Typography variant="h6" fontWeight="bold" color="white">
              Personal Information
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              >
                <Avatar
                  src={profile.avatar}
                  sx={{
                    bgcolor: '#52b0c3',
                    width: 100,
                    height: 100,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    border: '4px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s',
                    '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
                  }}
                >
                  {!profile.avatar && profile.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#102a43',
                    color: 'white',
                    '&:hover': { bgcolor: '#52b0c3' },
                    border: '2px solid #050505',
                  }}
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    size="small"
                    sx={textFieldStyle}
                    value={profile.fullName}
                    onChange={(e) => {
                      setProfile({ ...profile, fullName: e.target.value });
                      if (profileErrors.fullName) {
                        setProfileErrors((prev) => ({ ...prev, fullName: '' }));
                      }
                    }}
                    error={Boolean(profileErrors.fullName)}
                    helperText={profileErrors.fullName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    size="small"
                    sx={textFieldStyle}
                    value={profile.email}
                    onChange={(e) => {
                      setProfile({ ...profile, email: e.target.value });
                      if (profileErrors.email) {
                        setProfileErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    error={Boolean(profileErrors.email)}
                    helperText={profileErrors.email}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleUpdate('profile')}
                    sx={{ bgcolor: '#52b0c3', textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: '#3d94a7' } }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <SecurityIcon sx={{ color: '#e53e3e' }} />
            <Typography variant="h6" fontWeight="bold" color="white">
              Security & Password
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPass ? 'text' : 'password'}
                size="small"
                sx={textFieldStyle}
                value={passwords.current}
                onChange={(e) => {
                  setPasswords({ ...passwords, current: e.target.value });
                  if (passwordErrors.current) {
                    setPasswordErrors((prev) => ({ ...prev, current: '' }));
                  }
                }}
                error={Boolean(passwordErrors.current)}
                helperText={passwordErrors.current}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type={showPass ? 'text' : 'password'}
                size="small"
                sx={textFieldStyle}
                value={passwords.new}
                onChange={(e) => {
                  setPasswords({ ...passwords, new: e.target.value });
                  if (passwordErrors.new) {
                    setPasswordErrors((prev) => ({ ...prev, new: '' }));
                  }
                }}
                error={Boolean(passwordErrors.new)}
                helperText={passwordErrors.new || `Minimum ${PASSWORD_MIN_LENGTH} characters.`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPass ? 'text' : 'password'}
                size="small"
                sx={textFieldStyle}
                value={passwords.confirm}
                onChange={(e) => {
                  setPasswords({ ...passwords, confirm: e.target.value });
                  if (passwordErrors.confirm) {
                    setPasswordErrors((prev) => ({ ...prev, confirm: '' }));
                  }
                }}
                error={Boolean(passwordErrors.confirm)}
                helperText={passwordErrors.confirm}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => handleUpdate('password')}
                sx={{ color: '#e53e3e', borderColor: '#e53e3e', textTransform: 'none', borderRadius: 2, '&:hover': { borderColor: '#ff5a5a', bgcolor: 'rgba(229, 62, 62, 0.05)' } }}
              >
                Update Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
}
