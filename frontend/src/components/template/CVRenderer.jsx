import { Box, Typography } from "@mui/material";

import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ClassicTemplate from "./ClassicTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ElegantTemplate from "./ElegantTemplate";
import Classic2Template from "./Classic2Template";
import Professional2Template from "./Professional2Template";
import Modern2Template from "./Modern2Template";
import { normalizeTemplateData } from "./templateData";

export default function CVRenderer({ templateName, data }) {
  if (!data) return null;
  const normalizedData = normalizeTemplateData(data);

  switch (templateName) {
    case "Modern":
      return <ModernTemplate data={normalizedData} />;
    case "Modern 2":
      return <Modern2Template data={normalizedData} />;
    case "Minimal":
      return <MinimalTemplate data={normalizedData} />;
    case "Classic":
      return <ClassicTemplate data={normalizedData} />;
    case "Classic 2":
      return <Classic2Template data={normalizedData} />;
    case "Creative":
      return <CreativeTemplate data={normalizedData} />;
    case "Professional":
      return <ProfessionalTemplate data={normalizedData} />;
    case "Professional 2":
      return <Professional2Template data={normalizedData} />;
    case "Elegant":
      return <ElegantTemplate data={normalizedData} />;
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
            Template "{templateName}" is not implemented yet.
          </Typography>
        </Box>
      );
  }
}
