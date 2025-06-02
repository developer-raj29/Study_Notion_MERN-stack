// src/Components/Core/Auth/CheckAuth.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../../services/operations/authAPI";

const CheckAuth = ({ children }) => {
  try {
    const token = localStorage.getItem("token");

    // No token found
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    console.log("decoded: ", decoded);

    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      logout("/login");
      return <Navigate to="/login" replace />;
    }

    // Token is valid
    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default CheckAuth;
