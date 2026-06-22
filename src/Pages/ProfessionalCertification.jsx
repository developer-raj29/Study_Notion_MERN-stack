import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/common/Footer";
import { HiOutlineCheckBadge, HiOutlineDocumentCheck, HiOutlineShieldCheck } from "react-icons/hi2";

const ProfessionalCertification = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8 mt-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-50/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-pink-200/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-yellow-100/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-yellow-50">Certification</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                Professional{" "}
                <span className="bg-gradient-to-r from-yellow-50 to-pink-200 bg-clip-text text-transparent">
                  Certification
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Validate your expertise. Learn about industry-recognized certifications, exam formats, and how to prepare effectively to boost your resume.
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
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-50/10 text-yellow-50">
              <HiOutlineCheckBadge className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Why Get Certified?</h2>
              <p className="mt-2 text-richblack-300">
                Certifications act as proof of your technical proficiency to employers. They can help you stand out in competitive job markets, negotiate higher salaries, and establish credibility in specialized fields like Cloud Computing or Cyber Security.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100/10 text-blue-100">
              <HiOutlineShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Top Provider Guidelines</h2>
              <p className="mt-2 text-richblack-300">
                We provide detailed roadmaps for major certification bodies including AWS, Google Cloud, CompTIA, and Microsoft Azure. Understand prerequisites, exam costs, and renewal policies before you commit.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-caribbeangreen-100/10 text-caribbeangreen-100">
              <HiOutlineDocumentCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Exam Preparation Strategies</h2>
              <p className="mt-2 text-richblack-300">
                Learn how to schedule your study time, utilize official practice exams, and handle test anxiety. Our guidelines cover tips for multiple-choice sections and performance-based lab questions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center">
          <h2 className="text-xl font-semibold">Ready to get certified?</h2>
          <p className="mt-3 text-richblack-300">
            Check out our tailored courses designed to prepare you for specific certification exams in our <span className="font-medium text-richblack-50">Catalog</span>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfessionalCertification;
