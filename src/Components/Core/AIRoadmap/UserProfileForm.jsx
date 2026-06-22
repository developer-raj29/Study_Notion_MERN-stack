import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRoadmap } from "../../../services/operations/aiRoadmapAPI";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";

export default function UserProfileForm({ skillName, onBack, onGenerated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.aiRoadmap);

  const [formData, setFormData] = useState({
    experienceLevel: "Beginner",
    weeklyHours: 10,
    goal: "Prepare for developer job interviews",
  });

  const [skillsList, setSkillsList] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const chipValue = event.target.value.trim();
      if (chipValue && !skillsList.includes(chipValue)) {
        setSkillsList([...skillsList, chipValue]);
        event.target.value = "";
      }
    }
  };

  const handleDeleteSkill = (chipIndex) => {
    setSkillsList(skillsList.filter((_, index) => index !== chipIndex));
  };

  const [hoursSelection, setHoursSelection] = useState("10");
  const [customHours, setCustomHours] = useState("");
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const [goalSelection, setGoalSelection] = useState("Prepare for developer job interviews");
  const [customGoal, setCustomGoal] = useState("");
  const [isGoalDropdownActive, setIsGoalDropdownActive] = useState(false);

  const handleHoursChange = (e) => {
    const value = e.target.value;
    setHoursSelection(value);
    if (value !== "other") {
      setFormData((prev) => ({
        ...prev,
        weeklyHours: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        weeklyHours: customHours ? Number(customHours) : 30,
      }));
    }
  };

  const handleCustomHoursChange = (e) => {
    const value = e.target.value;
    setCustomHours(value);
    setFormData((prev) => ({
      ...prev,
      weeklyHours: value ? Number(value) : 1,
    }));
  };

  const handleGoalSelectionChange = (e) => {
    const value = e.target.value;
    setGoalSelection(value);
    if (value !== "other") {
      setFormData((prev) => ({
        ...prev,
        goal: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        goal: customGoal,
      }));
    }
  };

  const handleCustomGoalChange = (e) => {
    const value = e.target.value;
    setCustomGoal(value);
    setFormData((prev) => ({
      ...prev,
      goal: value,
    }));
  };

  const handleSelectExperience = (level) => {
    setFormData((prev) => ({
      ...prev,
      experienceLevel: level,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal.trim()) {
      return;
    }
    
    const result = await dispatch(
      generateRoadmap(
        {
          skillName,
          currentSkills: skillsList.join(", ") || "None",
          experienceLevel: formData.experienceLevel,
          weeklyHours: formData.weeklyHours,
          goal: formData.goal,
        },
        token,
        navigate
      )
    );

    if (result) {
      onGenerated();
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-12 text-center text-richblack-5">
        <div className="flex flex-col items-center justify-center gap-6 py-10">
          <div className="spinner"></div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-yellow-50">AI is crafting your roadmap...</h2>
            <p className="text-richblack-300 mt-2">
              Gemini 1.5 Flash is mapping out the phases, identifying platform courses, and generating milestones. This can take up to 10 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 text-richblack-5">
      <div className="mb-6 border-b border-richblack-700 pb-4">
        <span className="text-xs font-semibold text-yellow-50 uppercase tracking-widest">Questionnaire</span>
        <h2 className="text-2xl font-bold mt-1 text-richblack-5">
          Personalize Your <span className="text-yellow-50">"{skillName}"</span> Roadmap
        </h2>
        <p className="text-richblack-300 mt-1">
          Help us understand your background to create the most optimal timeframe and resource list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Experience Level Cards */}
        <div>
          <label className="text-sm font-medium text-richblack-200 block mb-3">
            What is your current experience level with {skillName}?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleSelectExperience(level)}
                className={`rounded-md border p-4 text-center font-medium transition-all hover:scale-[1.02]
                  ${
                    formData.experienceLevel === level
                      ? "border-yellow-50 bg-yellow-50/10 text-yellow-50"
                      : "border-richblack-600 bg-richblack-900 text-richblack-300"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Current Skills Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="currentSkills" className="text-sm font-medium text-richblack-25">
            What related skills do you already have? (Optional)
          </label>
          <p className="text-xs text-richblack-400">
            Type a skill and press <kbd className="bg-richblack-700 px-1 rounded text-richblack-200">Enter</kbd> or <kbd className="bg-richblack-700 px-1 rounded text-richblack-200">,</kbd> to add.
          </p>
          
          {/* Render Chips */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1 p-2 rounded-md bg-richblack-900 border border-richblack-700">
              {skillsList.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 rounded-full bg-yellow-50/10 border border-yellow-50/30 px-3 py-1 text-sm text-yellow-50"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(index)}
                    className="focus:outline-none hover:text-pink-200 transition-all text-xs cursor-pointer"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            id="currentSkills"
            name="currentSkills"
            onKeyDown={handleKeyDown}
            placeholder="Type skill and press Enter..."
            className="rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3 text-richblack-5 placeholder-richblack-500 focus:outline-none"
          />
        </div>

        {/* Weekly Hours Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="hoursSelection" className="text-sm font-medium text-richblack-25">
            How many hours can you dedicate weekly?
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <select
                id="hoursSelection"
                value={hoursSelection}
                onChange={(e) => {
                  handleHoursChange(e);
                  e.target.blur();
                }}
                onFocus={() => setIsDropdownActive(true)}
                onBlur={() => setIsDropdownActive(false)}
                className="w-full rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3 pr-10 text-richblack-5 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="5">5 hours / week (Light study)</option>
                <option value="10">10 hours / week (Standard study)</option>
                <option value="15">15 hours / week (Intermediate study)</option>
                <option value="20">20 hours / week (Intense study)</option>
                <option value="other">Other (Custom hours)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-richblack-200">
                {isDropdownActive ? (
                  <BsChevronDown className="text-sm" />
                ) : (
                  <BsChevronRight className="text-sm" />
                )}
              </div>
            </div>

            {hoursSelection === "other" && (
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  value={customHours}
                  onChange={handleCustomHoursChange}
                  min="1"
                  max="168"
                  placeholder="Enter custom weekly hours..."
                  className="rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3 text-richblack-5 focus:outline-none w-48"
                />
                <span className="text-richblack-300">hours per week</span>
              </div>
            )}
          </div>
        </div>

        {/* Learning Goal Selector */}
        <div className="flex flex-col gap-2">
          <label htmlFor="goalSelection" className="text-sm font-medium text-richblack-25">
            What is your main goal for learning this? <span className="text-pink-200">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <select
                id="goalSelection"
                value={goalSelection}
                onChange={(e) => {
                  handleGoalSelectionChange(e);
                  e.target.blur();
                }}
                onFocus={() => setIsGoalDropdownActive(true)}
                onBlur={() => setIsGoalDropdownActive(false)}
                className="w-full rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3 pr-10 text-richblack-5 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Prepare for developer job interviews">Prepare for developer job interviews</option>
                <option value="Build personal portfolio and SaaS side projects">Build personal portfolio and SaaS side projects</option>
                <option value="Secure a web development internship">Secure a web development internship</option>
                <option value="Academic exams / University coursework preparation">Academic exams / University coursework preparation</option>
                <option value="Career transition / Upskill for my current role">Career transition / Upskill for my current role</option>
                <option value="other">Other (Write custom goal...)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-richblack-200">
                {isGoalDropdownActive ? (
                  <BsChevronDown className="text-sm" />
                ) : (
                  <BsChevronRight className="text-sm" />
                )}
              </div>
            </div>

            {goalSelection === "other" && (
              <textarea
                id="goal"
                name="goal"
                value={customGoal}
                onChange={handleCustomGoalChange}
                required
                rows="3"
                placeholder="e.g. Want to build SaaS side projects, prepare for Frontend developer interviews, secure an internship..."
                className="rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3 text-richblack-5 placeholder-richblack-500 focus:outline-none resize-none mt-2"
              />
            )}
          </div>
        </div>

        {error && <p className="text-pink-200 text-sm">{error}</p>}

        {/* Footer Actions */}
        <div className="flex justify-between items-center gap-4 mt-4 pt-4 border-t border-richblack-700">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-richblack-600 bg-richblack-700 px-6 py-3 font-semibold text-richblack-100 transition-all hover:scale-95 hover:bg-richblack-800"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!formData.goal.trim()}
            className={`rounded-md px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95
              ${
                formData.goal.trim()
                  ? "bg-yellow-50 hover:bg-yellow-100 cursor-pointer"
                  : "bg-richblack-600 cursor-not-allowed text-richblack-400"
              }`}
          >
            Generate My Roadmap
          </button>
        </div>
      </form>
    </div>
  );
}
