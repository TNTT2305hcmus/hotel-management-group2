import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasRole } from "../auth/accessControl";

export default function RequireAuth({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null; // hoặc spinner

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles?.length) {
    return hasRole(user, allowedRoles)
      ? <Outlet />
      : <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

