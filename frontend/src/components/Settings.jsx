import { useState, useRef } from "react"; // Thêm useRef
import {
  Box, Typography, Paper, TextField, Button, Avatar, 
  InputAdornment, IconButton, Grid, Alert, Stack
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function Settings() {
  // Thêm field avatar vào state profile
  const [profile, setProfile] = useState({ 
    fullName: "quý10z", 
    email: "quy10z@cvbuilder.com",
    avatar: null 
  });
  
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "success" });

  // 1. Khởi tạo Ref để điều khiển input file ẩn
  const fileInputRef = useRef(null);

  // 2. Xử lý khi chọn ảnh mới
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

  const handleUpdate = (type) => {
    setStatus({ msg: type === 'profile' ? "Profile updated!" : "Password changed!", type: "success" });
    setTimeout(() => setStatus({ msg: "", type: "" }), 3000);
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&:hover fieldset": { borderColor: "#52b0c3" },
      "&.Mui-focused fieldset": { borderColor: "#52b0c3" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#52b0c3" },
  };

  return (
    <Box sx={{ p: 4, mt: "80px", maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="900" color="white" sx={{ mb: 4, fontFamily: "'Helvetica', sans-serif" }}>
        Settings
      </Typography>

      {status.msg && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

      <Stack spacing={4}>
        <Paper elevation={0} sx={{ p: 4, bgcolor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <PersonIcon sx={{ color: "#52b0c3" }} />
            <Typography variant="h6" fontWeight="bold" color="white">Personal Information</Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Bọc Box để khi click vào Avatar hoặc Icon Camera đều mở chọn file */}
              <Box 
                sx={{ position: "relative", cursor: "pointer" }} 
                onClick={() => fileInputRef.current.click()}
              >
                <Avatar 
                  src={profile.avatar}
                  sx={{ 
                    bgcolor: "#52b0c3", width: 100, height: 100, fontSize: "2.5rem", 
                    fontWeight: "bold", border: "4px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s",
                    "&:hover": { opacity: 0.8, transform: "scale(1.05)" }
                  }}
                >
                  {!profile.avatar && profile.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: "absolute", bottom: 0, right: 0, 
                    bgcolor: "#102a43", color: "white", 
                    "&:hover": { bgcolor: "#52b0c3" }, 
                    border: "2px solid #050505" 
                  }}
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>

                {/* Input file bị ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" size="small" sx={textFieldStyle} value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email Address" size="small" sx={textFieldStyle} value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={() => handleUpdate('profile')} sx={{ bgcolor: "#52b0c3", textTransform: "none", borderRadius: 2, "&:hover": { bgcolor: "#3d94a7" } }}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, bgcolor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <SecurityIcon sx={{ color: "#e53e3e" }} />
            <Typography variant="h6" fontWeight="bold" color="white">Security & Password</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Current Password" type={showPass ? "text" : "password"} size="small" sx={textFieldStyle}
                value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: "rgba(255,255,255,0.5)" }}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="New Password" type={showPass ? "text" : "password"} size="small" sx={textFieldStyle} 
                value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Confirm New Password" type={showPass ? "text" : "password"} size="small" sx={textFieldStyle} 
                value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => handleUpdate('password')} sx={{ color: "#e53e3e", borderColor: "#e53e3e", textTransform: "none", borderRadius: 2, "&:hover": { borderColor: "#ff5a5a", bgcolor: "rgba(229, 62, 62, 0.05)" } }}>
                Update Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
}