import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Components/common/Navbar";
import PrivateRoute from "./Components/Core/Auth/PrivateRoute";
import CourseDetails from "./Pages/CourseDetails";
import Catalog from "./Pages/Catalog";
import Contact from "./Pages/Contact";
import OpenRoute from "./Components/Core/Auth/OpenRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyEmail from "./Pages/VerifyEmail";
import UpdatePassword from "./Pages/UpdatePassword";
import MyProfile from "./Components/Core/Dashborad/MyProfile";
import Settings from "./Components/Core/Dashborad/Settings";
import Cart from "./Components/Core/Dashborad/Cart";
import EnrolledCourses from "./Components/Core/Dashborad/EnrolledCourses";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./Components/Core/Dashborad/AddCourse";
import Instructor from "./Components/Core/Dashborad/InstructorDashboard/Instructor";
import MyCourses from "./Components/Core/Dashborad/MyCourses";
import EditCourse from "./Components/Core/Dashborad/EditCourse";
import Error from "./Pages/Error";
import VideoDetails from "./Components/Core/ViewCourse/VideoDetails";
import ViewCourse from "./Pages/ViewCourse";

const App = () => {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar isloggedIn={isloggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* <OpenRoute>

        </OpenRoute> */}

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
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute isloggedIn={isloggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="cart" element={<Cart />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="instructor" element={<Instructor />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="edit-course/:courseId" element={<EditCourse />} />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
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
    </div>
  );
};

export default App;
