// Home Page
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SoftAurora from "../components/reactbits/SoftAurora";
import CardSwap, { Card } from "../components/reactbits/CardSwap";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: 0,
      }}
    >
      {/* 1. HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid #e0e0e0",
          height: 18,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "#102a43",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span
            style={{
              backgroundColor: "#52b0c3",
              color: "white",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            =
          </span>
          CV Builder
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Link
            href="#"
            underline="none"
            color="text.secondary"
            sx={{
              fontFamily: "Helvetica, Arial, sans-serif", // Ưu tiên Helvetica, nếu máy không có thì dùng Arial
              fontSize: "0.9rem",
              fontWeight: 500,
              "&:hover": { color: "#102a43" }, // Thêm hiệu ứng đổi màu khi hover cho chuyên nghiệp
            }}
          >
            Templates
          </Link>
          <Link
            href="#"
            underline="none"
            color="text.secondary"
            sx={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              "&:hover": { color: "#102a43" },
            }}
          >
            Features
          </Link>
          <Link
            href="#"
            underline="none"
            color="text.secondary"
            sx={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              "&:hover": { color: "#102a43" },
            }}
          >
            Help
          </Link>
        </Box>
      </Box>

      {/* 2. MAIN CONTENT (Phần giữa màn hình) */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          py: 4,
          px: 0,
          position: "relative", // Thêm cái này
          overflow: "hidden", // Để hiệu ứng không tràn ra ngoài
          backgroundColor: "#151414", // Màu nền dự phòng
        }}
      >
        {/* Lớp nền hiệu ứng */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1}
            color1="#f7f7f7"
            color2="#52b0c3"
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction={true}
            mouseInfluence={0.5}
            zIndex={1}
          />
        </Box>
        <Container maxWidth="lg" sx={{ zIndex: 2 }}>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Cột trái: Text và Nút bấm */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                fontWeight="1000"
                fontFamily="Helvetica, Arial, sans-serif"
                fontStyle={"italic"}
                sx={{
                  color: "#eaf0f6",
                  mb: 2,
                  WebkitTextStroke: "1px #8fb2b9",
                }}
              >
                Build a professional CV <br /> in minutes
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#c2cbd4",
                  mb: 4,
                  WebkitTextStroke: "1px #b0e6da",
                }}
              >
                Choose a template, edit sections, export PDF and DOCX
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#eaf0f6",
                    borderColor: "#eaf0f6",
                    "&:hover": { bgcolor: "#3d94a7" },
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Get started
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")} // Sự kiện chuyển sang trang Login khi bấm
                  sx={{
                    color: "#eaf0f6",
                    borderColor: "#eaf0f6",
                    "&:hover": { bgcolor: "#3d94a7" },
                    textTransform: "none",
                    px: 4,
                    boxShadow: 1,
                  }}
                >
                  Log in
                </Button>
              </Box>
            </Grid>

            {/* Cột phải:  Card Swap */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  height: "450px",
                  width: "300px",
                  position: "relative",
                  mt: 4,
                  mb: 12,
                }}
              >
                <CardSwap
                  cardDistance={40}
                  verticalDistance={50}
                  delay={3000}
                  pauseOnHover={true}
                >
                  {/* THẺ 1: Professional */}
                  <Card>
                    <Paper
                      elevation={0} 
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 3,
                        borderRadius: 2,
                        position: "relative",

                        bgcolor: "rgba(255, 255, 255, 0.02)", 
                        backdropFilter: "blur(12px)", 
                        WebkitBackdropFilter: "blur(12px)", // Dành riêng cho trình duyệt Safari của Apple
                        border: "1px solid rgba(255, 255, 255, 0.4)", // Viền trắng mờ để mép kính nổi lên
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)", 
                      }}
                    >
                      {/* Badge Nâng Cấp: PRO TEMPLATE */}
                      <Chip
                        icon={
                          <AutoAwesomeIcon
                            sx={{
                              color: "#52b0c3",
                              fontSize: "16px !important",
                            }}
                          />
                        }
                        label="PRO TEMPLATE"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 24,
                          right: -12,
                          bgcolor: "#52b0c3",
                          backdropFilter: "blur(4px)",
                          color: "#102a43",
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          letterSpacing: "0.5px",
                          border: "1px solid rgba(82, 176, 195, 0.2)",
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0)",
                        }}
                      />

                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Avatar
                          sx={{ bgcolor: "#52b0c3", width: 48, height: 48 }}
                        />
                        <Box sx={{ flex: 1, mt: 0.5 }}>
                          <Box
                            sx={{
                              height: 16,
                              bgcolor: "#52b0c3",
                              borderRadius: 1,
                              mb: 1,
                              width: "70%",
                            }}
                          />
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#f9fafa",
                              borderRadius: 4,
                              width: "40%",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          bgcolor: "#52b0c3",
                          borderRadius: 4,
                          mb: 2,
                          width: "30%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#52b0c3",
                          borderRadius: 4,
                          mb: 1,
                          width: "100%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#52b0c3",
                          borderRadius: 4,
                          mb: 2,
                          width: "85%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 10,
                          bgcolor: "#d3dbe3",
                          borderRadius: 4,
                          mb: 2,
                          width: "40%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#e4e7eb",
                          borderRadius: 4,
                          mb: 1,
                          width: "100%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#52b0c3",
                          borderRadius: 4,
                          mb: 1,
                          width: "90%",
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#52b0c3",
                          borderRadius: 4,
                          mb: 1.5,
                          width: "60%",
                        }}
                      />
                    </Paper>
                  </Card>

                  {/* THẺ 2: Creative */}
                  <Card>
                    <Paper
                      elevation={0} 
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 3,
                        borderRadius: 2,
                        position: "relative",

                        bgcolor: "rgba(255, 255, 255, 0.02)", 
                        backdropFilter: "blur(12px)", 
                        WebkitBackdropFilter: "blur(12px)", // Dành riêng cho trình duyệt Safari của Apple
                        border: "1px solid rgba(255, 255, 255, 0.4)", // Viền trắng mờ để mép kính nổi lên
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)", 
                      }}
                    >
                      {/* Badge Nâng Cấp: FAST BUILDER */}
                      <Chip
                        icon={
                          <BoltIcon
                            sx={{
                              color: "#f28b82",
                              fontSize: "16px !important",
                            }}
                          />
                        }
                        label="FAST BUILDER"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 24,
                          bgcolor: "#f28b82",
                          backdropFilter: "blur(4px)",
                          color: "#102a43",
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          letterSpacing: "0.5px",
                          border: "1px solid rgba(242, 139, 130, 0.2)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      />

                      <Box
                        sx={{
                          width: "35%",
                          bgcolor: "rgba(242, 139, 130, 0.1)",
                          p: 2,
                          borderRight: "1px solid rgba(242, 139, 130, 0.2)",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#f28b82",
                            width: 40,
                            height: 40,
                            mb: 2,
                            mx: "auto",
                          }}
                        />
                        <Box
                          sx={{
                            height: 6,
                            bgcolor: "#f28b82",
                            borderRadius: 4,
                            mb: 1,
                            width: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 6,
                            bgcolor: "#f28b82",
                            borderRadius: 4,
                            mb: 3,
                            width: "60%",
                            mx: "auto",
                          }}
                        />
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          <Box
                            sx={{
                              height: 12,
                              width: 30,
                              bgcolor: "#e4e7eb",
                              borderRadius: 1,
                            }}
                          />
                          <Box
                            sx={{
                              height: 12,
                              width: 40,
                              bgcolor: "#e4e7eb",
                              borderRadius: 1,
                            }}
                          />
                          <Box
                            sx={{
                              height: 12,
                              width: 25,
                              bgcolor: "#e4e7eb",
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ width: "65%", p: 2 }}>
                        <Box
                          sx={{
                            height: 12,
                            bgcolor: "#f28b82",
                            borderRadius: 4,
                            mb: 2,
                            width: "50%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#f28b82",
                            borderRadius: 4,
                            mb: 1,
                            width: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#f28b82",
                            borderRadius: 4,
                            mb: 1.5,
                            width: "80%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 12,
                            bgcolor: "#d3dbe3",
                            borderRadius: 4,
                            mb: 2,
                            width: "60%",
                            mt: 2,
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#e4e7eb",
                            borderRadius: 4,
                            mb: 1,
                            width: "95%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#e4e7eb",
                            borderRadius: 4,
                            mb: 1,
                            width: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#e4e7eb",
                            borderRadius: 4,
                            mb: 1,
                            width: "70%",
                          }}
                        />
                      </Box>
                    </Paper>
                  </Card>

                  {/* THẺ 3: ATS */}
                  <Card>
                    <Paper
                      elevation={0} 
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 3,
                        borderRadius: 2,
                        position: "relative",

                        bgcolor: "rgba(255, 255, 255, 0.02)", 
                        backdropFilter: "blur(12px)", 
                        WebkitBackdropFilter: "blur(12px)", // Dành riêng cho trình duyệt Safari của Apple
                        border: "1px solid rgba(255, 255, 255, 0.4)", // Viền trắng mờ để mép kính nổi lên
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)", 
                      }}
                    >
                      {/* Badge Nâng Cấp: ATS OPTIMIZED */}
                      <Chip
                        icon={
                          <FactCheckIcon
                            sx={{
                              color: "#fbbc04",
                              fontSize: "16px !important",
                            }}
                          />
                        }
                        label="ATS OPTIMIZED"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 24,
                          left: -12,
                          bgcolor: "#fbbc04",
                          backdropFilter: "blur(4px)",
                          color: "#102a43",
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          letterSpacing: "0.5px",
                          border: "1px solid rgba(251, 188, 4, 0.2)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      />

                      <Box sx={{ textAlign: "center", mb: 2 }}>
                        <Box
                          sx={{
                            height: 20,
                            bgcolor: "#fbbc04",
                            borderRadius: 1,
                            mb: 1.5,
                            width: "60%",
                            mx: "auto",
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#e4e7eb",
                            borderRadius: 4,
                            width: "40%",
                            mx: "auto",
                            mb: 0.5,
                          }}
                        />
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: "#e4e7eb",
                            borderRadius: 4,
                            width: "30%",
                            mx: "auto",
                          }}
                        />
                      </Box>
                      <Box sx={{ borderTop: "2px dashed #e4e7eb", mb: 2 }} />
                      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "#fbbc04",
                            mt: 0.5,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              height: 10,
                              bgcolor: "#fbbc04",
                              borderRadius: 4,
                              mb: 1,
                              width: "40%",
                            }}
                          />
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#e4e7eb",
                              borderRadius: 4,
                              mb: 1,
                              width: "100%",
                            }}
                          />
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#e4e7eb",
                              borderRadius: 4,
                              width: "85%",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "#fbbc04",
                            mt: 0.5,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              height: 10,
                              bgcolor: "#fbbc04",
                              borderRadius: 4,
                              mb: 1,
                              width: "50%",
                            }}
                          />
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#e4e7eb",
                              borderRadius: 4,
                              mb: 1,
                              width: "95%",
                            }}
                          />
                          <Box
                            sx={{
                              height: 8,
                              bgcolor: "#e4e7eb",
                              borderRadius: 4,
                              width: "70%",
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Card>
                </CardSwap>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. FOOTER */}
      <Box
        component="footer"
        sx={{
          p: 2, // Padding vừa phải để tạo không gian
          display: "flex",
          justifyContent: "flex-end",
          textAlign: "center",
          borderTop: "0px solid #e0e0e0",
          mt: "auto", // QUAN TRỌNG: Đẩy footer xuống đáy nếu nội dung bên trên ngắn
          background: "linear-gradient(to bottom, #151414, #174851)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Link href="#" underline="none" color="#f7fbff" fontSize="0.8rem">
            Terms
          </Link>
          <Link href="#" underline="none" color="#f7fbff" fontSize="0.8rem">
            Privacy
          </Link>
          <Link href="#" underline="none" color="#f7fbff" fontSize="0.8rem">
            Contact
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
