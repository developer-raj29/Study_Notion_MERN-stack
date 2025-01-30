import React from "react";
import Template from "../component/Template";
import SignupImg from "../assets/signup.png";

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
