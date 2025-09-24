import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";

const GuestRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const role = getRole();
  const loc = useLocation();
  if (role !== "guest") return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
};
export default GuestRoute;
