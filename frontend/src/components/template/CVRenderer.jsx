// src/template/CVRenderer.jsx
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ClassicTemplate from "./ClassicTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ElegantTemplate from "./ElegantTemplate";
import Classic2Template from "./Classic2Template";
import Professional2Template from "./Professional2Template";
import Modern2Template from "./Modern2Template";

import { Box, Typography } from "@mui/material";

export default function CVRenderer({ templateName, data }) {
  if (!data) return null;

  // Dùng biến templateName (vd: "Modern", "Classic 2") để map đúng giao diện
  switch (templateName) {
    case "Modern":
      return <ModernTemplate data={data} />;
    case "Modern 2":
      return <Modern2Template data={data} />;

    case "Minimal":
      return <MinimalTemplate data={data} />;

    case "Classic":
      return <ClassicTemplate data={data} />;
    case "Classic 2":
      return <Classic2Template data={data} />;

    case "Creative":
      return <CreativeTemplate data={data} />;

    case "Professional":
      return <ProfessionalTemplate data={data} />;
    case "Professional 2":
      return <Professional2Template data={data} />;

    case "Elegant":
      return <ElegantTemplate data={data} />;

    default:
      return (
        <Box
          sx={{
            p: 5,
            textAlign: "center",
            bgcolor: "#f8f9fb",
            border: "1px dashed red",
          }}
        >
          <Typography color="error">
            Template "{templateName}" is not implemented yet!
          </Typography>
        </Box>
      );
  }
}
