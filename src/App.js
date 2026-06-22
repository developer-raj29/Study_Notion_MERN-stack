import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { lazy, Suspense } from "react";
import Navbar from "./Components/common/Navbar";
import PrivateRoute from "./Components/Core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import OpenRoute from "./Components/Core/Auth/OpenRoute";
import CheckAuth from "./Components/Core/Auth/CheckAuth";
import ScrollToTop from "./Components/common/ScrollToTop";
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const CourseDetails = lazy(() => import("./Pages/CourseDetails"));
const Catalog = lazy(() => import("./Pages/Catalog"));
const CatalogHome = lazy(() => import("./Pages/CatalogHome"));
const Contact = lazy(() => import("./Pages/Contact"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("./Pages/VerifyEmail"));
const UpdatePassword = lazy(() => import("./Pages/UpdatePassword"));
const MyProfile = lazy(() => import("./Components/Core/Dashboard/MyProfile"));
const Settings = lazy(() => import("./Components/Core/Dashboard/Settings"));
const Cart = lazy(() => import("./Components/Core/Dashboard/Cart"));
const EnrolledCourses = lazy(() => import("./Components/Core/Dashboard/EnrolledCourses"));
const AIRoadmapPage = lazy(() => import("./Pages/AIRoadmapPage"));
const AddCourse = lazy(() => import("./Components/Core/Dashboard/AddCourse"));
const Instructor = lazy(() => import("./Components/Core/Dashboard/InstructorDashboard/Instructor"));
const MyCourses = lazy(() => import("./Components/Core/Dashboard/MyCourses"));
const EditCourse = lazy(() => import("./Components/Core/Dashboard/EditCourse"));
const Error = lazy(() => import("./Pages/Error"));
const VideoDetails = lazy(() => import("./Components/Core/ViewCourse/VideoDetails"));
const ViewCourse = lazy(() => import("./Pages/ViewCourse"));
const HelpCenter = lazy(() => import("./Pages/HelpCenter"));
const CareerPaths = lazy(() => import("./Pages/CareerPaths"));
const Careers = lazy(() => import("./Pages/Careers"));
const InterviewPrep = lazy(() => import("./Pages/InterviewPrep"));
const ProfessionalCertification = lazy(() => import("./Pages/ProfessionalCertification"));
const AboutLazy = lazy(() => import("./Pages/About"));

const App = () => {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const { user } = useSelector((state) => state.profile);
  // const { token } = useSelector((state) => state.auth);

  // console.log("user: ", user, "token: ", token);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar isloggedIn={isloggedIn} setIsLoggedIn={setIsLoggedIn} />
      <ScrollToTop />
      <Suspense fallback={<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center"><div className="spinner"></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutLazy />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Guideline & Static Pages */}
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/career-paths" element={<CareerPaths />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/professional-certification" element={<ProfessionalCertification />} />

        <Route path="/catalog" element={<CatalogHome />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login setIsLoggedIn={setIsLoggedIn} />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup setIsLoggedIn={setIsLoggedIn} />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}
        <Route
          path="/dashboard"
          element={
            <CheckAuth>
              <PrivateRoute isloggedIn={isloggedIn}>
                <Dashboard />
              </PrivateRoute>
            </CheckAuth>
          }
        >
          {/* Route for all users */}
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {/* Route only for Instructors */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="instructor" element={<Instructor />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="edit-course/:courseId" element={<EditCourse />} />
            </>
          )}

          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="cart" element={<Cart />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="ai-roadmap" element={<AIRoadmapPage />} />
            </>
          )}
        </Route>

        <Route
          element={
            <CheckAuth>
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            </CheckAuth>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
