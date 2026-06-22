import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/common/Footer";
import { HiOutlineCodeBracketSquare, HiOutlineUserGroup, HiOutlineClipboardDocumentList } from "react-icons/hi2";

const InterviewPrep = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8 mt-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-caribbeangreen-100/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-100/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-caribbeangreen-50/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-caribbeangreen-100">Interview Prep</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                Ace Your{" "}
                <span className="bg-gradient-to-r from-caribbeangreen-100 to-blue-100 bg-clip-text text-transparent">
                  Interviews
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Master the technical and behavioral skills needed to pass the toughest tech interviews and land your dream job.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider wave ─────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

      {/* Content Section */}
      <div className="mx-auto max-w-maxContent px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100/10 text-blue-100">
              <HiOutlineCodeBracketSquare className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">Technical Coding</h2>
            <p className="text-richblack-300">
              Guidelines on Data Structures, Algorithms, and System Design. Learn how to approach problems methodically and communicate your thought process effectively.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-caribbeangreen-100/10 text-caribbeangreen-100">
              <HiOutlineUserGroup className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">Behavioral Rounds</h2>
            <p className="text-richblack-300">
              Master the STAR method (Situation, Task, Action, Result). Prepare for culture-fit questions and learn how to highlight your past experiences and leadership skills.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-200/10 text-pink-100">
              <HiOutlineClipboardDocumentList className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">Mock Interviews</h2>
            <p className="text-richblack-300">
              Discover best practices for peer mock interviews. Get actionable checklists to evaluate your performance in real-time coding environments and whiteboard sessions.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-richblack-800 p-8 md:p-12">
          <h2 className="text-2xl font-bold">Preparation Checklist</h2>
          <ul className="mt-6 space-y-4 text-richblack-300">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caribbeangreen-100/20 text-xs font-bold text-caribbeangreen-100">1</span>
              <span>Update your resume and ensure your GitHub portfolio is polished.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caribbeangreen-100/20 text-xs font-bold text-caribbeangreen-100">2</span>
              <span>Review fundamental concepts specific to the role (e.g., React hooks, SQL optimization).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caribbeangreen-100/20 text-xs font-bold text-caribbeangreen-100">3</span>
              <span>Practice coding on a whiteboard or a plain text editor without auto-complete.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caribbeangreen-100/20 text-xs font-bold text-caribbeangreen-100">4</span>
              <span>Prepare at least 3 thoughtful questions to ask your interviewers at the end.</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewPrep;
