import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { loading, session, role } = useAuth() || {};

  // Initial boot: show loader until we know session/role
  if (!session && loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  // No session → go login
  if (!session) {
    return (
      <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
    );
  }

  // If we have session but role not resolved yet (e.g. token refresh), allow previous role to persist
  if (role == null && loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
