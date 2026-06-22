import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { markMilestoneComplete } from "../../../services/operations/aiRoadmapAPI";
import { useNavigate } from "react-router-dom";
import { VscCheck, VscFolderOpened, VscPlay } from "react-icons/vsc";
import ProgressBar from "./ProgressBar";

export default function MilestoneCard({ milestone, roadmapId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleToggleComplete = () => {
    if (!milestone.isCompleted) {
      dispatch(markMilestoneComplete(roadmapId, milestone._id, token));
    }
  };

  const handleResourceClick = (resource) => {
    if (resource.type === "course" && resource.courseId) {
      navigate(`/courses/${resource.courseId}`);
    }
  };

  return (
    <div
      className={`rounded-md border p-4 transition-all
        ${
          milestone.isCompleted
            ? "border-caribbeangreen-600 bg-caribbeangreen-900/10"
            : "border-richblack-700 bg-richblack-900"
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={milestone.isCompleted}
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all
            ${
              milestone.isCompleted
                ? "border-caribbeangreen-500 bg-caribbeangreen-500 text-white cursor-default"
                : "border-richblack-600 hover:border-yellow-50 cursor-pointer"
            }`}
        >
          {milestone.isCompleted && <VscCheck className="text-sm font-bold" />}
        </button>

        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4
              className={`font-semibold text-richblack-5 text-base
                ${milestone.isCompleted ? "line-through text-richblack-400" : ""}`}
            >
              {milestone.title}
            </h4>
            <span className="rounded bg-richblack-700 px-2 py-0.5 text-xs text-yellow-50 font-medium">
              ~{milestone.estimatedDays} Days
            </span>
          </div>

          <p className="text-sm text-richblack-300 mt-1">{milestone.description}</p>

          {/* Resources Section */}
          {milestone.resources && milestone.resources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-richblack-800">
              <span className="text-xs font-semibold text-richblack-400 uppercase tracking-wider block mb-2">
                Recommended Resources:
              </span>
              <div className="flex flex-col gap-2">
                {milestone.resources.map((resource, i) => (
                  <div
                    key={i}
                    onClick={() => handleResourceClick(resource)}
                    className={`flex flex-col gap-2 rounded-md p-3 border border-richblack-800 bg-richblack-800 text-richblack-100 transition-all
                      ${
                        resource.type === "course"
                          ? "hover:border-yellow-50 hover:bg-richblack-750 cursor-pointer"
                          : ""
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {resource.type === "course" ? (
                          <VscFolderOpened className="text-yellow-50" />
                        ) : (
                          <VscPlay className="text-caribbeangreen-200" />
                        )}
                        {resource.title}
                      </span>
                      <span className="text-xs text-richblack-400 capitalize bg-richblack-700 px-2 py-0.5 rounded">
                        {resource.type}
                      </span>
                    </div>

                    {/* Course Progress Bar */}
                    {resource.type === "course" && resource.courseId && (
                      <div className="mt-2 pt-2 border-t border-richblack-700 flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs text-richblack-300">
                          <span>Platform Course Completion</span>
                          <span className="text-caribbeangreen-100 font-medium">
                            {resource.courseProgress || 0}%
                          </span>
                        </div>
                        <ProgressBar completed={resource.courseProgress || 0} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
