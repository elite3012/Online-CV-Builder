// src/pages/HomePage.jsx
import { Box } from "@mui/material";
import HomeHeader from "../components/home/HomeHeader";
import HomeHero from "../components/home/HomeHero";
import HomeFooter from "../components/home/HomeFooter";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: 0,
      }}
    >
      <HomeHeader />
      <HomeHero />
      <HomeFooter />
    </Box>
  );
}