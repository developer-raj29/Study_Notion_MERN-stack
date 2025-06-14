import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

const LoginForm = ({ setIsLoggedIn }) => {
  const [formData, setformData] = useState({
    email: "" || "dummyuser123@gmail.com",
    password: "" || "123456789",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showpassword, setpassword] = useState(false);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setformData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("Login Details: ", formData);

    dispatch(login(email, password, navigate));
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col w-full gap-y-4 mt-6"
    >
      <label className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Email Address<sup className="text-pink-200">*</sup>
        </p>
        <input
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter email id"
        />
      </label>

      <label className="w-full relative">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Password<sup className="text-pink-200">*</sup>
        </p>
        <input
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
          required
          name="password"
          type={showpassword ? "text" : "password"}
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter password"
        />
        <span
          className="absolute right-3 md:top-[38px] top-[34px] cursor-pointer"
          onClick={() => setpassword((prev) => !prev)}
        >
          {showpassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        <Link to="#">
          <p className="text-right text-xs mt-1 text-blue-100">
            Forget Password
          </p>
        </Link>
      </label>

      <button className="bg-yellow-50 rounded-md font-medium text-richblack-900 w-full p-[12px] mt-6">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
