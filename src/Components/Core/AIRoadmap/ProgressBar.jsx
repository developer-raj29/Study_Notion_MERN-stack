import React from "react";
import RAMONAKProgressBar from "@ramonak/react-progress-bar";

export default function ProgressBar({ completed }) {
  return (
    <RAMONAKProgressBar
      completed={completed}
      height="10px"
      bgColor="#05BF8E" // caribbeangreen-200
      baseBgColor="#2C333F" // richblack-700
      isLabelVisible={false}
    />
  );
}
