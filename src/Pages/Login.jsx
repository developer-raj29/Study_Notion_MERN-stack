import React from "react";
import loginImg from "../assets/Images/login.webp";
import Template from "../Components/Core/Auth/Template";

const Login = ({ setIsLoggedIn }) => {
  return (
    <Template
      title="Welcome Back"
      desc1="Build skills for today, tomorrow, and beyond"
      desc2="Education to future-proof your career."
      image={loginImg}
      formtyped="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

export default Login;
