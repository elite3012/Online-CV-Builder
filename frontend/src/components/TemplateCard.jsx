// CARD HIỂN THỊ TỪNG TEMPLATE
import { Box, Typography, Chip, Button } from "@mui/material";
import BorderGlow from "./reactbits/BorderGlow";

export const TemplateCard = ({ item }) => (
    <BorderGlow
      edgeSensitivity={30}
      backgroundColor="none"
      glowColor="190 80 80"
      borderRadius={12}
      glowRadius={80}
      glowIntensity={1.0}
      coneSpread={10}
      colors={["#1c7c54", "#52b0c3", "#def4c6"]}
      style={{
        width: "100%", // Ép BorderGlow phình to hết cỡ bằng với cột Grid
        height: "100%", // Ép chiều cao bằng nhau cho dù text có ngắn hay dài
        display: "flex", // Giúp nội dung bên trong dàn trải đều
      }}
    >
      <Box
        sx={{
          width: 250,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, // Ép cái Box này chiếm trọn chiều cao của BorderGlow
        }}
      >
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
            zIndex: -1,
          }}
        />

        <Box
          sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#102a43"
            sx={{ fontFamily: "'Helvetica', sans-serif" }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 1.5,
              flexGrow: 1,
              fontSize: "0.5rem",
              lineHeight: 1.4,
            }}
          >
            {item.desc}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
            {item.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.65rem",
                  height: 20,
                  bgcolor: "#f0f4f8",
                  color: "#102a43",
                }}
              />
            ))}
          </Box>

          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              textTransform: "none",
              color: "#52b0c3",
              borderColor: "#52b0c3",
              "&:hover": {
                borderColor: "#3d94a7",
                bgcolor: "rgba(82, 176, 195, 0.04)",
              },
            }}
          >
            Use Template
          </Button>
        </Box>
      </Box>
    </BorderGlow>
  );