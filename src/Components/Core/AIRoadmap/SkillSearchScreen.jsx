import { useState } from "react";
import { VscSearch } from "react-icons/vsc";

const POPULAR_SKILLS = [
  "React JS",
  "Node.js",
  "Python Backend",
  "Machine Learning",
  "Docker & DevOps",
  "Data Structures & Algorithms",
  "System Design",
  "Next.js Development",
];

export default function SkillSearchScreen({ onSelect }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter or select a skill to proceed.");
      return;
    }
    setError("");
    onSelect(query.trim());
  };

  const handleSelectSkill = (skill) => {
    setError("");
    onSelect(skill);
  };

  return (
    <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 text-richblack-5">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-richblack-5">Which skill do you want to master?</h2>
        <p className="text-richblack-300 mt-2">
          Tell us what you want to learn, and our AI assistant will design a custom roadmap just for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="flex items-center rounded-md border border-richblack-600 bg-richblack-900 px-4 py-3">
          <VscSearch className="text-richblack-400 text-xl mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. React.js, Fullstack Node, DevOps Pipeline, System Design..."
            className="w-full bg-transparent text-richblack-5 placeholder-richblack-400 focus:outline-none"
          />
        </div>
        {error && <p className="text-pink-200 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-yellow-50 py-3 text-center font-semibold text-richblack-900 transition-all hover:scale-95 hover:bg-yellow-100"
        >
          Proceed to Questionnaire
        </button>
      </form>

      <div>
        <h3 className="text-sm font-semibold text-richblack-300 uppercase tracking-wider mb-4">
          Popular topics on StudyNotion
        </h3>
        <div className="flex flex-wrap gap-3">
          {POPULAR_SKILLS.map((skill, index) => (
            <button
              key={index}
              onClick={() => handleSelectSkill(skill)}
              className="rounded-full border border-richblack-600 bg-richblack-700 px-4 py-2 text-sm font-medium text-richblack-200 transition-all hover:border-yellow-50 hover:bg-richblack-800 hover:text-yellow-50"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
