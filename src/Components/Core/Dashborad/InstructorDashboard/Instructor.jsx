import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";

const Instructor = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);

      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);

      console.log(instructorApiData);

      if (instructorApiData.length) setInstructorData(instructorApiData);

      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div>
          <div>
            <div>
              <InstructorChart courses={instructorData} />
              <div>
                <p>Statistics</p>
                <div>
                  <p>Total Courses</p>
                  <p>{courses.length}</p>
                </div>

                <div>
                  <p>Total Students</p>
                  <p>{totalStudents}</p>
                </div>

                <div>
                  <p>Total Income</p>
                  <p>{totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Render 3 courses */}
            <div>
              <p>Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p>View all</p>
              </Link>
            </div>
            <div>
              {courses.slice(0, 3).map((course) => (
                <div>
                  <img src={course.thumbnail} />
                  <div>
                    <p>{course.courseName}</p>
                    <div>
                      <p>{course.studentsEnrolled.length} students</p>
                      <p> | </p>
                      <p> Rs {course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to={"/dashboard/add-course"}>
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a Course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
