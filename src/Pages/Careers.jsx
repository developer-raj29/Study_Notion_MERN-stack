import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/common/Footer";
import { HiOutlineCpuChip, HiOutlineServerStack, HiOutlineCodeBracket, HiOutlineRocketLaunch } from "react-icons/hi2";

const Careers = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8 mt-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-caribbeangreen-100/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-pink-100/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-blue-100">Careers</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                Explore Exciting{" "}
                <span className="bg-gradient-to-r from-blue-100 to-caribbeangreen-100 bg-clip-text text-transparent">
                  Career Profiles
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Discover the most in-demand roles in IT, Artificial Intelligence, and Software Engineering. Learn about the skills required and the future outlook for these cutting-edge profiles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider wave ─────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

      {/* Content Section */}
      <div className="mx-auto max-w-maxContent px-4 py-16">
        
        {/* AI Profiles Section */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100/10 text-pink-100">
              <HiOutlineCpuChip className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Artificial Intelligence (AI) Profiles</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Machine Learning Engineer</h3>
              <p className="text-sm text-richblack-300">
                Designs and builds predictive models and machine learning algorithms. Requires strong math, Python/R, and deep learning framework knowledge.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Data Scientist</h3>
              <p className="text-sm text-richblack-300">
                Analyzes complex, large-scale data to find trends and actionable insights. Proficient in statistical analysis, SQL, and data visualization tools.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">AI Research Scientist</h3>
              <p className="text-sm text-richblack-300">
                Pushes the boundaries of AI capabilities. Focuses on novel algorithms in computer vision, NLP, and reinforcement learning.
              </p>
            </div>
          </div>
        </div>

        {/* IT Profiles Section */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100/10 text-blue-100">
              <HiOutlineServerStack className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Information Technology (IT) Profiles</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Cloud Architect</h3>
              <p className="text-sm text-richblack-300">
                Oversees a company's cloud computing strategy, including cloud adoption, application design, and management using AWS, Azure, or GCP.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Cybersecurity Analyst</h3>
              <p className="text-sm text-richblack-300">
                Protects organizations from cyber threats. Monitors networks for security breaches, investigates violations, and implements firewalls.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">DevOps Engineer</h3>
              <p className="text-sm text-richblack-300">
                Bridges the gap between development and operations. Automates CI/CD pipelines, manages infrastructure as code, and ensures system reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Software Engineering Section */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caribbeangreen-100/10 text-caribbeangreen-100">
              <HiOutlineCodeBracket className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Software Engineering Profiles</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Frontend Developer</h3>
              <p className="text-sm text-richblack-300">
                Creates the user interface and experience. Highly skilled in HTML, CSS, JavaScript, and frameworks like React or Vue.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Backend Developer</h3>
              <p className="text-sm text-richblack-300">
                Builds the server-side logic, databases, and APIs. Works with languages like Node.js, Java, Python, and manages database architectures.
              </p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 transition-all hover:-translate-y-1 hover:border-richblack-500">
              <h3 className="mb-2 text-xl font-semibold text-richblack-5">Full Stack Developer</h3>
              <p className="text-sm text-richblack-300">
                A versatile engineer capable of handling both frontend and backend tasks, managing complete applications from concept to deployment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center md:p-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50/10 text-yellow-50">
            <HiOutlineRocketLaunch className="h-8 w-8" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-richblack-5">Ready to launch your career?</h2>
          <p className="mb-6 max-w-2xl text-richblack-300">
            Now that you know the profiles, it's time to build the skills. Head over to our catalog and start learning the technologies that power these incredible careers.
          </p>
          <Link 
            to="/catalog" 
            className="rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95"
          >
            Explore Courses
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Careers;
