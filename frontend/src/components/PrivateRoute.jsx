import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const user = useSelector((state) => state.auth.email);
  console.log("PrivateRoute user:", user);
  return user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;  
