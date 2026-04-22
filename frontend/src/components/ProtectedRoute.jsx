import { Navigate } from "react-router-dom";
import { apiService } from "../services/apiService";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && !apiService.isTokenExpired(token);

  if (!isAuthenticated) {
    apiService.clearAuthSession();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
