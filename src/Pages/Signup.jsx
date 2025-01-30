import React from "react";
import Template from "../Components/Core/Auth/Template";
import SignupImg from "../assets/Images/signup.webp";

const Signup = ({ setIsLoggedIn }) => {
  return (
    <Template
      title="Join the millions learning to code with Study Notion for free"
      desc1="Build skills for today, tomorrow, and beyond."
      desc2="Education to future-proof your career."
      image={SignupImg}
      formtyped="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

export default Signup;
