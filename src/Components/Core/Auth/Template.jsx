import React from "react";
import frameImage from "../../../assets/Images/frame.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";

const Template = ({ title, desc1, desc2, image, formtyped, setIsLoggedIn }) => {
  return (
    <div className="flex md:flex-row flex-col mt-20 justify-between w-11/12 max-w-[1160px] mx-auto py-12 gap-x-12 gap-y-0">
      <div className="w-11/12 max-w-[480px] md:mx-0 mx-auto">
        {/* className="w-11/12 max-w-[450px] mx-auto" */}
        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-richblack-100 italic">{desc1}</span>
          <br />
          <span className="text-blue-100 italic">{desc2}</span>
        </p>
        {formtyped === "signup" ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}
        <div className="flex w-full items-center my-4 gap-x-2">
          <div className="w-full h-[1px] bg-richblack-700"></div>
          <p className="text-richblack-700 font-medium leading-[1.375rem]">
            OR
          </p>
          <div className="w-full h-[1px] bg-richblack-700 "></div>
        </div>
        <button
          className="w-full flex justify-center items-center rounded-[8px] 
        font-medium text-richblack-100 border border-richblack-700 px-[12px] 
        py-[8px] gap-x-2 mt-6"
        >
          <FcGoogle />
          <p>Sign Up with Google</p>
        </button>
      </div>

      <div className="relative w-11/12 max-w-[450px] md:block hidden">
        <img
          src={frameImage}
          alt="pattern"
          width={558}
          height={504}
          loading="lazy"
        />

        <img
          src={image}
          alt="students"
          width={558}
          height={490}
          className="absolute -top-4 right-4"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Template;
