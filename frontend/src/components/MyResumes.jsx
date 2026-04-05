// src/components/MyResumes.jsx
import { Box, Typography, Button, Grid, Paper, IconButton } from "@mui/material";
import { motion } from "motion/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { myResumes } from "../data/myResumes"; 

export default function MyResumes() {
  const hasResumes = myResumes.length > 0;

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
        
        {/* Nút Tạo mới ở góc phải trên cùng (Chỉ hiện khi ĐÃ CÓ CV) */}
        {hasResumes && (
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#52b0c3", textTransform: "none", "&:hover": { bgcolor: "#3d94a7" } }}>
            Create New
          </Button>
        )}
      </Box>

      {/* RẼ NHÁNH HIỂN THỊ */}
      {hasResumes ? (
        /* ========================================= */
        /* TRƯỜNG HỢP 1: CÓ CV (Hiện dạng Grid)       */
        /* ========================================= */
        <Grid container spacing={4}>
          {myResumes.map((cv, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Paper
                  sx={{
                    position: "relative", borderRadius: 3, overflow: "hidden", bgcolor: "white", transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(82, 176, 195, 0.2)", "& .overlay": { opacity: 1 } },
                  }}
                >
                  {/* Ảnh cover của CV */}
                  <Box component="img" src={cv.image} alt={cv.title} sx={{ width: "100%", height: 200, objectFit: "cover" }} />

                  {/* Thông tin CV */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#102a43" noWrap>
                      {cv.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Template: {cv.templateName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Last edited: {cv.lastEdited}
                    </Typography>
                  </Box>

                  {/* Overlay hiện ra khi Hover */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute", top: 0, left: 0, width: "100%", height: 200,
                      bgcolor: "rgba(16, 42, 67, 0.6)", backdropFilter: "blur(2px)",
                      display: "flex", justifyContent: "center", alignItems: "center", gap: 2,
                      opacity: 0, transition: "opacity 0.3s ease",
                    }}
                  >
                    <IconButton sx={{ bgcolor: "white", color: "#52b0c3", "&:hover": { bgcolor: "#f0f4f8" } }} onClick={() => alert("Chuyển sang trang Editor!")}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ bgcolor: "white", color: "#e53935", "&:hover": { bgcolor: "#ffebee" } }} onClick={() => alert("Xóa CV này!")}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}

          {/* THẺ TẠO MỚI (Dashed Card) */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: myResumes.length * 0.1 }} style={{ height: "100%" }}>
              <Paper
                sx={{
                  height: "100%", minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  bgcolor: "rgba(255, 255, 255, 0.05)", border: "2px dashed rgba(255, 255, 255, 0.2)", borderRadius: 3, cursor: "pointer", transition: "0.3s",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)", borderColor: "#52b0c3" },
                }}
                onClick={() => alert("Chuyển về tab Overview để chọn Template!")}
              >
                <IconButton sx={{ bgcolor: "rgba(82, 176, 195, 0.2)", color: "#52b0c3", mb: 2 }}>
                  <AddIcon fontSize="large" />
                </IconButton>
                <Typography variant="subtitle1" fontWeight="bold" color="white">
                  Create New Resume
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

      ) : (

        /* ========================================= */
        /* TRƯỜNG HỢP 2: CHƯA CÓ CV (Empty State)     */
        /* ========================================= */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <Paper 
              sx={{ 
                p: 5, 
                textAlign: "center", 
                bgcolor: "rgba(255, 255, 255, 0.05)", 
                border: "1px dashed rgba(255, 255, 255, 0.2)", 
                borderRadius: 3,
                width: "100%",
                maxWidth: 500 
              }}
            >
              <Typography color="white" variant="h6" sx={{ mb: 1 }}>
                You haven't created any resumes yet.
              </Typography>
              <Typography color="rgba(255,255,255,0.5)" variant="body2" sx={{ mb: 3 }}>
                Start building your professional profile today.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: "#52b0c3", "&:hover": { bgcolor: "#3d94a7" } }}
                onClick={() => alert("Chuyển về tab Overview để chọn Template!")}
              >
                Create New Resume
              </Button>
            </Paper>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}