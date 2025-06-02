// import { createContext, useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../services/operations/authAPI";
// import { useNavigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         const currentTime = Math.floor(Date.now() / 1000);
//         const remainingTime = decoded.exp - currentTime;

//         if (remainingTime > 0) {
//           const timer = setTimeout(() => {
//             localStorage.removeItem("token");
//             dispatch(logout("/login"));
//             navigate("/login");
//           }, remainingTime * 1000);

//           return () => clearTimeout(timer); // Cleanup on unmount
//         } else {
//           localStorage.removeItem("token");
//           dispatch(logout("/login"));
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Token decode failed", error);
//         localStorage.removeItem("token");
//         dispatch(logout("/login"));
//         navigate("/login");
//       }
//     }
//   }, [token, dispatch, navigate]);

//   return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
// };

// // Optional hook if you want to use this context elsewhere
// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;
    let intervalLogger;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = decoded.exp - currentTime;

        if (remainingTime > 0) {
          console.log("Token valid. Logging every second...");

          // ✅ Log remaining time every second
          intervalLogger = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = decoded.exp - now;
            console.log(`⏳ Time left until logout: ${timeLeft}s`);

            if (timeLeft <= 0) {
              clearInterval(intervalLogger);
            }
          }, 1000);

          // 🕒 Auto logout when token expires
          logoutTimer = setTimeout(() => {
            console.log("🚪 Token expired. Logging out...");
            localStorage.removeItem("token");
            dispatch(logout(navigate, "⚠️ Session expired Logging out"));
            // navigate("/login");
          }, remainingTime * 1000);
        } else {
          console.log("⚠️ Token already expired. Logging out...");
          localStorage.removeItem("token");
          dispatch(logout(navigate, "⚠️ Session already expired Logging out"));
          //   navigate("/login");
        }
      } catch (error) {
        console.error("❌ Token decode failed", error);
        localStorage.removeItem("token");
        dispatch(logout(navigate, "❌ Token decode failed"));
        // navigate("/login");
      }
    }

    return () => {
      clearTimeout(logoutTimer);
      clearInterval(intervalLogger);
    };
  }, [token, dispatch, navigate]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
