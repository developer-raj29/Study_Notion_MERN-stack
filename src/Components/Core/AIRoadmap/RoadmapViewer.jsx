import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MilestoneCard from "./MilestoneCard";
import ProgressBar from "./ProgressBar";
import ChatPanel from "./ChatPanel";
import RecommendedForRoadmap from "./RecommendedForRoadmap";
import { VscChevronDown, VscChevronUp, VscSparkle } from "react-icons/vsc";

export default function RoadmapViewer({ onNewRoadmap }) {
  const navigate = useNavigate();
  const { activeRoadmap } = useSelector((state) => state.aiRoadmap);
  const { token } = useSelector((state) => state.auth);

  // Keep track of which phases are expanded in accordion
  const [expandedPhases, setExpandedPhases] = useState({ 0: true });

  if (!activeRoadmap) return null;

  const togglePhase = (index) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="flex flex-col gap-6 text-richblack-5">
      {/* Overview Block */}
      <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-6">
        <h3 className="text-xl font-bold text-richblack-5 flex items-center gap-2 mb-2">
          <VscSparkle className="text-yellow-50" /> Personal Learning Goal
        </h3>
        <p className="text-richblack-300 italic text-sm">"{activeRoadmap.userProfile.goal}"</p>
        <p className="text-sm text-richblack-200 mt-4 leading-relaxed">{activeRoadmap.summary}</p>

        {/* Dynamic statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-richblack-700">
          <div className="flex flex-col">
            <span className="text-xs text-richblack-400 uppercase tracking-wider">Estimated Weeks</span>
            <span className="text-lg font-semibold text-yellow-50">{activeRoadmap.estimatedWeeks} Weeks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-richblack-400 uppercase tracking-wider">Weekly Dedication</span>
            <span className="text-lg font-semibold text-yellow-50">{activeRoadmap.userProfile.weeklyHours} Hrs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-richblack-400 uppercase tracking-wider">Completed Milestones</span>
            <span className="text-lg font-semibold text-caribbeangreen-200">
              {activeRoadmap.completedMilestones} / {activeRoadmap.totalMilestones}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-richblack-400 uppercase tracking-wider">Overall Progress</span>
            <span className="text-lg font-semibold text-caribbeangreen-200">{activeRoadmap.progressPercent}%</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <ProgressBar completed={activeRoadmap.progressPercent} />
        </div>
      </div>

      {/* Course Recommendations for Student Business growth engine */}
      <RecommendedForRoadmap activeRoadmap={activeRoadmap} token={token} />

      {/* Main Roadmap & Chat Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Phase Accordions (Columns 1 & 2) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-richblack-200">Learning Phases</h3>

          {activeRoadmap.phases &&
            activeRoadmap.phases.map((phase, phaseIdx) => {
              const isExpanded = !!expandedPhases[phaseIdx];
              return (
                <div
                  key={phase._id || phaseIdx}
                  className="rounded-lg border border-richblack-700 bg-richblack-800 overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => togglePhase(phaseIdx)}
                    className="flex cursor-pointer items-center justify-between p-5 bg-richblack-750 transition-all hover:bg-richblack-700"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-richblack-600 px-2.5 py-0.5 text-xs text-yellow-50 font-bold">
                          Phase {phase.order || phaseIdx + 1}
                        </span>
                        {phase.isCompleted && (
                          <span className="text-xs text-caribbeangreen-200 font-semibold bg-caribbeangreen-900/20 px-2 py-0.5 rounded">
                            Done ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-richblack-5 mt-1 truncate">{phase.title}</h4>
                      <p className="text-xs text-richblack-300 line-clamp-1 mt-0.5">{phase.description}</p>
                    </div>
                    <div>{isExpanded ? <VscChevronUp /> : <VscChevronDown />}</div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-5 border-t border-richblack-700 bg-richblack-800 flex flex-col gap-3">
                      {phase.milestones &&
                        phase.milestones.map((milestone) => (
                          <MilestoneCard
                            key={milestone._id}
                            milestone={milestone}
                            roadmapId={activeRoadmap._id}
                          />
                        ))}
                    </div>
                  )}
                </div>
              );
            })}

        </div>

        {/* Right Chat Panel Column */}
        <div className="md:col-span-1 sticky top-20">
          <ChatPanel />
        </div>
      </div>

      {/* Page Actions Footer */}
      <div className="flex justify-start gap-4 mt-6 border-t border-richblack-750 pt-4">
        <button
          onClick={onNewRoadmap}
          className="rounded-md border border-richblack-600 bg-richblack-750 px-5 py-2.5 text-sm font-semibold text-richblack-200 transition-all hover:bg-richblack-700 hover:text-yellow-50"
        >
          Create Another Roadmap
        </button>
      </div>
    </div>
  );
}
