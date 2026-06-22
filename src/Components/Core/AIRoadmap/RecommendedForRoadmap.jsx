import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { apiConnector } from "../../../services/apiconnector";
import { aiRoadmapEndpoints } from "../../../services/apis";
import { VscSparkle } from "react-icons/vsc";

export default function RecommendedForRoadmap({ activeRoadmap, token }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeRoadmap) {
      setLoading(true);
      // Wait, courses are populated inside activeRoadmap.suggestedCourses!
      // In findById, suggestedCourses was populated as { course, relevanceScore }
      if (activeRoadmap.suggestedCourses) {
        const mappedCourses = activeRoadmap.suggestedCourses
          .map((item) => {
            if (item && item.course) {
              return {
                ...item.course,
                relevanceScore: item.relevanceScore || 100,
              };
            }
            // Fallback for unpopulated or old data formats
            return item;
          })
          .filter((c) => c && c.courseName);
        setCourses(mappedCourses);
        setLoading(false);
      } else {
        setCourses([]);
        setLoading(false);
      }
    }
  }, [activeRoadmap]);

  const handleEnrollNow = async (courseId) => {
    try {
      // Track analytics click event (Phase 8)
      await apiConnector(
        "POST",
        aiRoadmapEndpoints.TRACK_ANALYTICS_API,
        {
          event: "course_clicked",
          roadmapId: activeRoadmap._id,
          courseId: courseId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
    } catch (err) {
      console.warn("Failed to track course click analytics:", err.message);
    }
    // Navigate to course details
    navigate(`/courses/${courseId}`);
  };

  const getScoreBadge = (score) => {
    if (score >= 95) {
      return (
        <span className="flex items-center gap-1 rounded bg-[#EF4444]/15 px-2 py-0.5 text-xs font-bold text-[#F87171] border border-[#EF4444]/30 animate-pulse">
          🔥 Best Match
        </span>
      );
    } else if (score >= 85) {
      return (
        <span className="flex items-center gap-1 rounded bg-[#EAB308]/15 px-2 py-0.5 text-xs font-bold text-[#FACC15] border border-[#EAB308]/30">
          ⭐ Recommended
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 rounded bg-[#3B82F6]/15 px-2 py-0.5 text-xs font-bold text-[#60A5FA] border border-[#3B82F6]/30">
          📚 Continue Learning
        </span>
      );
    }
  };

  // Loading skeleton state
  if (loading) {
    return (
      <div className="mt-8 border-t border-richblack-700 pt-8">
        <h3 className="text-xl font-bold text-richblack-5 mb-6 flex items-center gap-2">
          <VscSparkle className="text-yellow-50" /> Recommended Courses For You
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-lg border border-richblack-750 bg-richblack-800 p-4 flex flex-col gap-4 animate-pulse"
            >
              <div className="w-full h-40 bg-richblack-700 rounded-md" />
              <div className="h-6 bg-richblack-700 rounded w-3/4" />
              <div className="h-4 bg-richblack-700 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-4 bg-richblack-700 rounded w-1/4" />
                <div className="h-4 bg-richblack-700 rounded w-1/4" />
              </div>
              <div className="h-10 bg-richblack-700 rounded mt-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-8 border-t border-richblack-700 pt-8 text-center text-pink-200">
        Failed to load course recommendations. Please refresh or try again.
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-richblack-700 pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
            <VscSparkle className="text-yellow-50" /> Recommended Courses For You
          </h3>
          <p className="text-sm text-richblack-300 mt-1">
            Top instructor-led programs selected to accelerate your learning goals.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const avgReviewCount = GetAvgRating(course.ratingAndReviews || []);
          const discountedPrice = Math.round((course.price || 0) * 0.85);

          return (
            <div
              key={course._id}
              className="flex flex-col justify-between rounded-lg border border-richblack-750 bg-richblack-800 overflow-hidden hover:border-yellow-50 transition-all hover:scale-[1.02] duration-300 shadow-lg group"
            >
              {/* Thumbnail Container */}
              <div className="relative overflow-hidden w-full h-40 bg-richblack-900 shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  {getScoreBadge(course.relevanceScore)}
                  <span className="bg-richblack-900/90 text-yellow-50 text-[11px] font-bold px-2 py-0.5 rounded border border-yellow-50/20">
                    {course.relevanceScore}% Match
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="font-bold text-richblack-5 text-md line-clamp-1 leading-snug group-hover:text-yellow-50 transition-colors">
                    {course.courseName}
                  </h4>
                  <p className="text-xs text-richblack-400 mt-1.5 font-medium">
                    By {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>

                  {/* Rating Stars & Count */}
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <span className="text-yellow-100 font-bold text-xs">{avgReviewCount.toFixed(1)}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={14} />
                    <span className="text-richblack-400 text-xs font-normal">
                      ({course.ratingAndReviews?.length || 0} Ratings)
                    </span>
                  </div>

                  {/* Student Enrolled & Pricing Details */}
                  <div className="flex items-center justify-between mt-3 text-xs text-richblack-300 font-medium">
                    <span className="bg-richblack-700/50 px-2 py-1 rounded text-richblack-200">
                      {course.studentsEnrolled?.length || 0} enrolled
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-richblack-400 line-through text-[11px]">Rs. {course.price}</span>
                      <span className="text-caribbeangreen-200 font-bold text-sm">Rs. {discountedPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Enroll CTA */}
                <button
                  onClick={() => handleEnrollNow(course._id)}
                  className="w-full text-center rounded-md bg-yellow-50 py-2.5 text-xs font-semibold text-richblack-900 transition-all hover:scale-95 hover:bg-yellow-100 mt-2 cursor-pointer shadow-md"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
