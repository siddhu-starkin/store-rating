// src/context/RequireAuthRedirect.jsx
import { Navigate } from "react-router-dom";
import { ROLE_ROUTES } from "../config/roles";
import useAuth from "../hooks/useAuth";

const RequireAuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = ROLE_ROUTES[user.role] || "/unauthorized";
  return <Navigate to={redirectPath} replace />;
};

export default RequireAuthRedirect;
