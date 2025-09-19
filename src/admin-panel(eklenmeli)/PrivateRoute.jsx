import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  // Sadece /admin-login'den başarılı girişle gelmişse izin ver (tek seferlik)
  const ok = location?.state?.__fromLogin === true;

  return ok ? (
    children
  ) : (
    <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
