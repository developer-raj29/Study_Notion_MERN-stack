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

const App = () => {
  const [isloggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="relative w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar isloggedIn={isloggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute isloggedIn={isloggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
