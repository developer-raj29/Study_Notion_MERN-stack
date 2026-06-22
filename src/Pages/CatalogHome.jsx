import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import Footer from "../Components/common/Footer";
import {
  HiOutlineGlobeAlt,
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlinePresentationChartBar,
  HiOutlineShieldCheck,
  HiOutlineServerStack,
  HiOutlineCloud,
  HiOutlinePaintBrush,
  HiOutlineLink,
  HiOutlineMegaphone,
  HiOutlineCircleStack,
  HiOutlinePuzzlePiece,
  HiOutlineCommandLine,
} from "react-icons/hi2";


// ── Design tokens per category (icon = react-icons component) ──
const CATEGORY_STYLES = [
  { border: "hover:border-blue-200",           icon: "text-blue-100          bg-blue-400/10",            title: "text-blue-100",          glow: "bg-blue-400/10",          Icon: HiOutlineGlobeAlt },
  { border: "hover:border-yellow-50",          icon: "text-yellow-25         bg-yellow-50/10",            title: "text-yellow-25",         glow: "bg-yellow-50/10",         Icon: HiOutlineDevicePhoneMobile },
  { border: "hover:border-caribbeangreen-100", icon: "text-caribbeangreen-100 bg-caribbeangreen-100/10",  title: "text-caribbeangreen-100", glow: "bg-caribbeangreen-100/10", Icon: HiOutlineCpuChip },
  { border: "hover:border-pink-200",           icon: "text-pink-100          bg-pink-200/10",             title: "text-pink-100",          glow: "bg-pink-200/10",          Icon: HiOutlinePresentationChartBar },
  { border: "hover:border-blue-50",            icon: "text-blue-50           bg-blue-100/10",             title: "text-blue-50",           glow: "bg-blue-100/10",          Icon: HiOutlineShieldCheck },
  { border: "hover:border-caribbeangreen-50",  icon: "text-caribbeangreen-50 bg-caribbeangreen-50/10",   title: "text-caribbeangreen-50", glow: "bg-caribbeangreen-50/10", Icon: HiOutlineServerStack },
  { border: "hover:border-brown-25",           icon: "text-brown-25          bg-brown-50/10",             title: "text-brown-25",          glow: "bg-brown-50/10",          Icon: HiOutlineCloud },
];

// Category → style index map (so icons always match the category, not just position)
const CATEGORY_ICON_MAP = {
  "Web Development":        { styleIdx: 0 },
  "Mobile Development":     { styleIdx: 1 },
  "AI & Machine Learning":  { styleIdx: 2, Icon: HiOutlineCpuChip },
  "Data Science":           { styleIdx: 3, Icon: HiOutlinePresentationChartBar },
  "Cyber Security":         { styleIdx: 4, Icon: HiOutlineShieldCheck },
  "DevOps & SRE":           { styleIdx: 5, Icon: HiOutlineServerStack },
  "Cloud Computing":        { styleIdx: 6, Icon: HiOutlineCloud },
  "UI/UX Design":           { styleIdx: 0, Icon: HiOutlinePaintBrush },
  "Blockchain & Web3":      { styleIdx: 1, Icon: HiOutlineLink },
  "Digital Marketing":      { styleIdx: 2, Icon: HiOutlineMegaphone },
  "Database Engineering":   { styleIdx: 3, Icon: HiOutlineCircleStack },
  "Game Development":       { styleIdx: 4, Icon: HiOutlinePuzzlePiece },
  "Programming Languages":  { styleIdx: 5, Icon: HiOutlineCommandLine },
};

const CatalogHome = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setAllCategories(res?.data?.allCategory || []);
      } catch (err) {
        console.error("Could not load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = allCategories.filter(
    (cat) => Array.isArray(cat?.courses) && cat.courses.length > 0
  );

  const totalCourses = filtered.reduce((sum, cat) => sum + (cat.courses?.length || 0), 0);

  return (
    <div className="mt-14 min-h-screen bg-richblack-900">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-richblack-800 px-4 pb-12 pt-8">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-50/5 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-200/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-caribbeangreen-100/5 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-xs text-richblack-400">
            <Link to="/" className="transition-colors hover:text-richblack-100">Home</Link>
            <span className="text-richblack-600">/</span>
            <span className="text-yellow-25">Catalog</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-richblack-5 md:text-4xl lg:text-5xl">
                Explore All{" "}
                <span className="bg-gradient-to-r from-yellow-25 to-yellow-100 bg-clip-text text-transparent">
                  Categories
                </span>
              </h1>
              <p className="mt-3 max-w-[540px] text-base text-richblack-300">
                Discover world-class courses crafted by industry experts. Pick a category and start your journey today.
              </p>
            </div>

            {/* Stats pill — only show after load */}
            {!loading && (
              <div className="flex shrink-0 items-center gap-6 rounded-2xl border border-richblack-700 bg-richblack-900/50 px-6 py-4 text-center backdrop-blur-sm">
                <div>
                  <p className="text-2xl font-bold text-yellow-25">{filtered.length}</p>
                  <p className="text-xs text-richblack-400">Categories</p>
                </div>
                <div className="h-8 w-px bg-richblack-700" />
                <div>
                  <p className="text-2xl font-bold text-caribbeangreen-100">{totalCourses}</p>
                  <p className="text-xs text-richblack-400">Courses</p>
                </div>
                <div className="h-8 w-px bg-richblack-700" />
                <div>
                  <p className="text-2xl font-bold text-blue-100">Expert</p>
                  <p className="text-xs text-richblack-400">Instructors</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Divider wave ─────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

      {/* ── Category Grid ────────────────────────────────────── */}
      <div className="mx-auto max-w-maxContent px-4 py-12">

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-richblack-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-richblack-800">
              <svg className="h-10 w-10 text-richblack-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-richblack-200">No categories available yet</p>
            <p className="text-sm text-richblack-500">Check back soon — new content is on its way!</p>
            <Link to="/" className="mt-2 rounded-lg bg-yellow-50 px-5 py-2 text-sm font-semibold text-richblack-900 transition-colors hover:bg-yellow-25">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-richblack-500">
              {filtered.length} Categories Available
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((cat, i) => {
                const mapping    = CATEGORY_ICON_MAP[cat.name] ?? { styleIdx: i % CATEGORY_STYLES.length };
                const style      = CATEGORY_STYLES[mapping.styleIdx % CATEGORY_STYLES.length];
                const IconComp   = mapping.Icon ?? style.Icon;
                const courseCount = cat.courses?.length || 0;
                const catSlug    = cat.name.split(" ").join("-").toLowerCase();

                return (
                  <Link
                    key={cat._id}
                    to={`/catalog/${catSlug}`}
                    className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 ${style.border}`}
                  >
                    {/* Hover glow blob */}
                    <div className={`pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${style.glow}`} />

                    {/* Icon — react-icons */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${style.icon}`}>
                      {IconComp && <IconComp className="h-6 w-6" />}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-1.5">
                      <h2 className={`text-sm font-bold leading-snug transition-colors duration-200 ${style.title}`}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-richblack-400">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="rounded-full border border-richblack-700 px-2.5 py-1 text-[11px] font-medium text-richblack-400 transition-colors duration-200 group-hover:border-richblack-600 group-hover:text-richblack-200">
                        {courseCount} {courseCount === 1 ? "course" : "courses"}
                      </span>
                      <span className={`flex translate-x-1 items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ${style.title}`}>
                        Explore <span className="text-sm">→</span>
                      </span>
                    </div>

                    {/* Bottom shimmer line */}
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${style.glow.replace("bg-", "bg-").replace("/10", "")}`} />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogHome;
