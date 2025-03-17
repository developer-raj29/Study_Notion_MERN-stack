import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { setSignupData } from "../../../slices/authSlice";
import { sendOtp } from "../../../services/operations/authAPI";
import { useDispatch } from "react-redux";
import Tab from "../../common/Tab";

const SignupForm = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [showpassword, setpassword] = useState(false);
  const [showConpassword, setConpassword] = useState(false);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    setIsLoggedIn(true);
    // toast.success("Account Created");
    const accountData = {
      ...formData,
    };

    const finalData = {
      ...accountData,
      accountType,
    };

    console.log("finalData: ", finalData);

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(finalData));

    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);

    // console.log("Signup Account Data: ", accountData);
    // console.log("Signup Final Data: ", finalData);
    // navigate("/dashboard");
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form
        onSubmit={submitHandler}
        className="flex flex-col w-full gap-y-4 mt-6"
      >
        {/* First or Last Name */}
        <div className="flex gap-x-4">
          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              First Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
              required
              type="text"
              name="firstName"
              onChange={changeHandler}
              value={formData.firstName}
              placeholder="Enter First Name"
            />
          </label>

          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Last Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
              required
              type="text"
              name="lastName"
              onChange={changeHandler}
              value={formData.lastName}
              placeholder="Enter Last Name"
            />
          </label>
        </div>

        {/* Email Address */}
        <label className="w-full">
          <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
            Email Address<sup className="text-pink-200">*</sup>
          </p>
          <input
            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            required
            type="text"
            name="email"
            onChange={changeHandler}
            value={formData.email}
            placeholder="Enter Email Address"
          />
        </label>

        <div className="flex gap-x-4">
          {/* createPassword and Confirm Password */}
          <label className="w-full relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Create Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
              required
              type={showpassword ? "text" : "password"}
              name="password"
              onChange={changeHandler}
              value={formData.password}
              placeholder="Enter Password"
            />
            <span
              className="absolute right-3 top-[40px] cursor-pointer"
              onClick={() => setpassword((prev) => !prev)}
            >
              {showpassword ? (
                <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={20} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="w-full relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
              required
              type={showConpassword ? "text" : "password"}
              name="confirmPassword"
              onChange={changeHandler}
              value={formData.confirmPassword}
              placeholder="Confirm Password"
            />
            <span
              className="absolute right-3 top-[40px] cursor-pointer"
              onClick={() => setConpassword((prev) => !prev)}
            >
              {showConpassword ? (
                <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={20} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button className="bg-yellow-50 rounded-md font-medium text-richblack-900 w-full p-[12px] mt-6">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
