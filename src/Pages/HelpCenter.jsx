import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/common/Footer";
import { HiOutlineChatBubbleLeftRight, HiOutlineDocumentText, HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8 mt-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-caribbeangreen-100/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-yellow-50/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-blue-100">Help Center</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                How can we{" "}
                <span className="bg-gradient-to-r from-blue-100 to-caribbeangreen-100 bg-clip-text text-transparent">
                  help you?
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Find answers, guidelines, and support to ensure your learning journey is as smooth as possible.
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
          <Link to="/about" className="block rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-100">
              <HiOutlineQuestionMarkCircle className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">FAQs</h2>
            <p className="text-richblack-300">
              Browse our frequently asked questions to find quick answers about account setup, payments, and course access.
            </p>
          </Link>

          {/* Card 2 */}
          <Link to="/catalog" className="block rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-caribbeangreen-100/10 text-caribbeangreen-100">
              <HiOutlineDocumentText className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">Platform Guides</h2>
            <p className="text-richblack-300">
              Step-by-step tutorials on how to navigate the dashboard, track your progress, and interact with instructors.
            </p>
          </Link>

          {/* Card 3 */}
          <Link to="/contact" className="block rounded-2xl border border-richblack-700 bg-richblack-800 p-8 transition-all hover:-translate-y-1 hover:border-richblack-500">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50/10 text-yellow-25">
              <HiOutlineChatBubbleLeftRight className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-semibold">Contact Support</h2>
            <p className="text-richblack-300">
              Can't find what you're looking for? Reach out to our dedicated support team 24/7 for personalized assistance.
            </p>
          </Link>
        </div>

        <div className="mt-16 rounded-2xl bg-richblack-800 p-8 md:p-12">
          <h2 className="text-2xl font-bold">Still need help?</h2>
          <p className="mt-2 text-richblack-300">
            Send an email directly to our support staff at <a href="mailto:support@studynotion.com" className="text-blue-100 hover:underline">support@studynotion.com</a>. We typically respond within 24 hours.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
