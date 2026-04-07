import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import HomeHeader from "../../components/home/HomeHeader";

const FAQS = [
  { q: "How do I export my CV to PDF?", a: "Simply click the 'Export' button in the Editor toolbar. Your CV will be processed and downloaded automatically as a high-quality A4 PDF." },
  { q: "Is the AI ATS Checker accurate?", a: "Our AI simulates common ATS algorithms to scan for keywords and formatting. While highly effective, we recommend always double-checking your specific job description." },
  { q: "Can I use my own fonts?", a: "To ensure maximum ATS compatibility, we provide a curated list of standard fonts that are guaranteed to be readable by all major hiring systems." }
];

export default function HelpCenter() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "white" }}>
      
      <HomeHeader />

      <Box sx={{ flexGrow: 1, py: 12, bgcolor: "#050505", color: "white", position: "relative", overflow: "hidden" }}>
        
        <Container maxWidth="md" sx={{ position: "relative" }}>
          <Typography variant="h3" fontWeight="900" textAlign="center" sx={{ mb: 6 }}>Help Center</Typography>
          {FAQS.map((faq, i) => (
            <Accordion key={i} sx={{ bgcolor: "rgba(255,255,255,0.03)", color: "white", mb: 2, border: "1px solid rgba(255,255,255,0.1)" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#52b0c3" }} />}>
                <Typography fontWeight="bold">{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: "rgba(255,255,255,0.6)" }}>
                <Typography>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </Box>
  );
}