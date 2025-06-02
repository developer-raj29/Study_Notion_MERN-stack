const HighlightText = ({ text }) => {
  return (
    // <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold">
    <span className=" text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;
