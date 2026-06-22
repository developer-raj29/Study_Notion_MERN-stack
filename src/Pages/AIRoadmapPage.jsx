import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyRoadmaps, fetchRoadmapDetails } from "../services/operations/aiRoadmapAPI";
import { setActiveRoadmap } from "../slices/aiRoadmapSlice";
import SkillSearchScreen from "../Components/Core/AIRoadmap/SkillSearchScreen";
import UserProfileForm from "../Components/Core/AIRoadmap/UserProfileForm";
import RoadmapViewer from "../Components/Core/AIRoadmap/RoadmapViewer";
import { VscAdd, VscSparkle } from "react-icons/vsc";

const STEPS = ["Select Skill", "Your Background", "Your Roadmap"];

export default function AIRoadmapPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { roadmaps, activeRoadmap } = useSelector((state) => state.aiRoadmap);

  const [step, setStep] = useState(0);
  const [skillName, setSkillName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchMyRoadmaps(token));
    }
  }, [dispatch, token]);

  const handleCreateNew = () => {
    dispatch(setActiveRoadmap(null));
    setIsCreating(true);
    setStep(0);
    setSkillName("");
  };

  const handleSelectRoadmap = (id) => {
    dispatch(fetchRoadmapDetails(id, token));
    setIsCreating(false);
    setStep(2);
  };

  // If there are existing roadmaps and we are NOT in the creation wizard
  if (roadmaps.length > 0 && !isCreating && !activeRoadmap) {
    return (
      <div className="mx-auto max-w-7xl py-6 px-4">
        <div className="flex items-center justify-between mb-8 border-b border-richblack-700 pb-4">
          <div>
            <h1 className="text-3xl font-semibold text-richblack-5 flex items-center gap-2">
              <VscSparkle className="text-yellow-50" /> AI Learning Roadmaps
            </h1>
            <p className="text-richblack-300 mt-1">Track your personalized skill milestones and study plans.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 transition-all hover:scale-95 hover:bg-yellow-100"
          >
            <VscAdd className="text-lg" /> Create New
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              onClick={() => handleSelectRoadmap(roadmap._id)}
              className="flex cursor-pointer flex-col justify-between rounded-lg border border-richblack-700 bg-richblack-800 p-5 transition-all hover:scale-[1.02] hover:border-yellow-50"
            >
              <div>
                <h3 className="text-xl font-bold text-richblack-5">{roadmap.skillName}</h3>
                <p className="text-sm text-richblack-450 mt-2 line-clamp-2">{roadmap.summary}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-richblack-700 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-richblack-400">Progress</span>
                  <span className="text-sm font-medium text-caribbeangreen-200">{roadmap.progressPercent}% Completed</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-richblack-400">Duration</span>
                  <span className="text-sm font-medium text-yellow-50">{roadmap.estimatedWeeks} Weeks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Otherwise show the creation flow or detailed viewer
  return (
    <div className="mx-auto max-w-max py-6 px-4">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
          <VscSparkle className="text-yellow-50" />
          {activeRoadmap ? `Roadmap: ${activeRoadmap.skillName}` : "Create AI Roadmap"}
        </h1>
        {roadmaps.length > 0 && (
          <button
            onClick={() => {
              setIsCreating(false);
              dispatch(setActiveRoadmap(null));
            }}
            className="text-sm text-richblack-300 hover:text-yellow-50 transition-all"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* Step indicator */}
      {!activeRoadmap && (
        <div className="flex items-center justify-between max-w-lg mx-auto mb-10 bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${
                    i < step
                      ? "bg-caribbeangreen-500 text-white"
                      : i === step
                      ? "bg-yellow-50 text-richblack-900 ring-2 ring-yellow-200"
                      : "bg-richblack-700 text-richblack-400"
                  }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? "text-richblack-5" : "text-richblack-400"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-richblack-600" />}
            </div>
          ))}
        </div>
      )}

      {/* Screens Router */}
      {step === 0 && !activeRoadmap && (
        <SkillSearchScreen
          onSelect={(name) => {
            setSkillName(name);
            setStep(1);
          }}
        />
      )}
      {step === 1 && !activeRoadmap && (
        <UserProfileForm
          skillName={skillName}
          onBack={() => setStep(0)}
          onGenerated={() => setStep(2)}
        />
      )}
      {(step === 2 || activeRoadmap) && (
        <RoadmapViewer
          onNewRoadmap={handleCreateNew}
        />
      )}
    </div>
  );
}
