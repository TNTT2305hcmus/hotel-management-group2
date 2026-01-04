import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { hasRole } from "../api/accessControl";

export default function RequireAuth({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  // when F5, UI need time to read localStorage -> Appear spin on temporary white screen
  if (loading) return <Spin />;

  // replace -> Delete browsing history -> Can't use back button
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles?.length) {
    return hasRole(user, allowedRoles)
      ? <Outlet /> // Appear inner content
      : <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

