import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  redirectIfLoggedIn?: boolean; // optional: true for public pages
}

const ProtectedRoute: React.FC<Props> = ({ children, redirectIfLoggedIn }) => {
  const userId = localStorage.getItem("userId");

  if (redirectIfLoggedIn && userId) {
    // User is logged in, prevent access to public page
    return <Navigate to="/homepage" replace />;
  }

  if (!redirectIfLoggedIn && !userId) {
    // User is NOT logged in, prevent access to protected page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
