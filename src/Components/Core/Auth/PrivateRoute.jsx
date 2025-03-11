import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isloggedIn, children }) => {
  const { token } = useSelector((state) => state.auth);

  if (token !== null || isloggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
