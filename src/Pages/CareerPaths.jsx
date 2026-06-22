import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/common/Footer";
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineArrowTrendingUp } from "react-icons/hi2";

const CareerPaths = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8 mt-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-yellow-50/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-pink-100/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-pink-200">Career Paths</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-pink-200 to-yellow-50 bg-clip-text text-transparent">
                  Career Path
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Navigate the tech industry with confidence. Explore detailed guides on various roles, required skills, and salary expectations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider wave ─────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

      {/* Content Section */}
      <div className="mx-auto max-w-maxContent px-4 py-16">
        <div className="space-y-12">
          {/* Section 1 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pink-200/10 text-pink-100">
              <HiOutlineBriefcase className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Role Overviews</h2>
              <p className="mt-2 text-richblack-300">
                From Frontend Engineering to DevOps and Data Science, get a clear breakdown of daily responsibilities, tools used, and the impact each role has within a tech organization.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100/10 text-blue-100">
              <HiOutlineAcademicCap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Skill Requirements</h2>
              <p className="mt-2 text-richblack-300">
                Understand the core competencies required for different levels (Junior, Mid, Senior). We map out the exact frameworks, languages, and soft skills you need to master.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-50/10 text-yellow-50">
              <HiOutlineArrowTrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Growth & Progression</h2>
              <p className="mt-2 text-richblack-300">
                Learn how to transition from an individual contributor (IC) to management, or how to become a Staff/Principal engineer. Discover salary bands and negotiation tips.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center">
          <h2 className="text-xl font-semibold">Not sure where to start?</h2>
          <p className="mt-3 text-richblack-300">
            Take a look at our <span className="font-medium text-richblack-50">Full Catalog</span> to find courses that align with your dream career.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareerPaths;
