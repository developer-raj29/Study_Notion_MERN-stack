import Img404 from "../assets/Images/404 Error-Robot.png";
import CTAButton from "../Components/Core/HomePage/Button";

const Error = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-richblack-900 text-white px-4">
      <img
        src={Img404}
        alt="404 Not Found"
        className="w-[320px] max-w-full mb-8"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg md:text-xl text-richblack-300 mb-6 text-center max-w-[500px]">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <CTAButton active={true} linkto={"/"}>
        Go to Home
      </CTAButton>
    </div>
  );
};

export default Error;
