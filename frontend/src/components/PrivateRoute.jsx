import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const user = useSelector((state) => state.auth.email);

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
