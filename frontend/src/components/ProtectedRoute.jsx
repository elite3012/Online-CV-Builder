import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import { apiService } from "../services/apiService";

function FullScreenAuthCheck() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "#050505",
        color: "white",
      }}
    >
      <CircularProgress sx={{ color: "#52b0c3" }} />
      <Typography variant="body2" color="rgba(255,255,255,0.7)">
        Restoring your session...
      </Typography>
    </Box>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [authState, setAuthState] = useState(() => {
    if (!token || apiService.isTokenExpired(token)) {
      apiService.clearAuthSession();
      return "unauthorized";
    }

    return "checking";
  });

  useEffect(() => {
    if (authState !== "checking") {
      return undefined;
    }

    let active = true;

    apiService
      .getCurrentUser()
      .then((user) => {
        if (!active) return;

        localStorage.setItem(
          "authUser",
          JSON.stringify({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
          }),
        );
        setAuthState("authorized");
      })
      .catch(() => {
        if (!active) return;

        apiService.clearAuthSession();
        setAuthState("unauthorized");
      });

    return () => {
      active = false;
    };
  }, [authState]);

  if (authState === "checking") {
    return <FullScreenAuthCheck />;
  }

  if (authState !== "authorized") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
