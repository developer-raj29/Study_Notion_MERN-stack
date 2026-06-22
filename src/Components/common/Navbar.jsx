import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import ProfileDropDown from "../Core/Auth/ProfileDropDown";
import { GrClose } from "react-icons/gr";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const fetchSubLinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allCategory);
    } catch (error) {
      console.log("Could not fetch the catalog list", error);
      setSubLinks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex fixed w-full h-14 items-center justify-center py-8 border-b-[1px] border-b-richblack-500 z-[999] bg-richblack-800 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        
        {/* Navigation links - Desktop only */}
        <nav className="hidden lg:block">
          <ul className="flex flex-row gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />

                    {/* Dropdown Menu */}
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[260px] translate-x-[-50%] translate-y-[3em] flex-col rounded-2xl border border-richblack-700 bg-richblack-800 opacity-0 shadow-2xl shadow-richblack-900 transition-all duration-200 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[320px] overflow-hidden">
                      {/* Arrow pointer */}
                      <div className="absolute left-[50%] top-0 -z-10 h-4 w-4 translate-x-[-50%] translate-y-[-45%] rotate-45 border-l border-t border-richblack-700 bg-richblack-800"></div>

                      {/* Dropdown header */}
                      <div className="flex items-center gap-2 border-b border-richblack-700 px-4 py-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-50"></span>
                        <p className="text-xs font-semibold uppercase tracking-widest text-richblack-300">
                          Browse Categories
                        </p>
                      </div>

                      {/* Category list */}
                      <div className="flex flex-col py-2 max-h-[300px] overflow-y-auto nav-dropdown-scroll">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2 py-6">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-richblack-500 border-t-yellow-50"></div>
                            <p className="text-sm text-richblack-400">Loading...</p>
                          </div>
                        ) : subLinks.length ? (
                          subLinks
                            .filter(
                              (subLink) =>
                                Array.isArray(subLink?.courses) &&
                                subLink.courses.length > 0
                            )
                            .map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                key={i}
                                className="group/item relative flex items-center justify-between px-4 py-2.5 transition-all duration-150 hover:bg-richblack-700"
                              >
                                <span className="absolute left-0 top-[15%] h-[70%] w-[3px] scale-y-0 rounded-full bg-yellow-50 transition-transform duration-150 group-hover/item:scale-y-100"></span>
                                <div className="flex items-center gap-3">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-richblack-700 text-xs font-bold text-yellow-50 transition-colors duration-150 group-hover/item:bg-yellow-50 group-hover/item:text-richblack-900">
                                    {subLink.name.charAt(0)}
                                  </span>
                                  <span className="text-sm font-medium text-richblack-100 group-hover/item:text-white">
                                    {subLink.name}
                                  </span>
                                </div>
                                <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-[10px] font-semibold text-richblack-300 transition-colors duration-150 group-hover/item:bg-yellow-50 group-hover/item:text-richblack-900">
                                  {subLink.courses.length}
                                </span>
                              </Link>
                            ))
                        ) : (
                          <div className="flex flex-col items-center gap-1 py-6">
                            <p className="text-sm font-medium text-richblack-300">No Courses Found</p>
                            <p className="text-xs text-richblack-500">Check back soon!</p>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      {!loading && subLinks.length > 0 && (
                        <div className="border-t border-richblack-700 px-4 py-3">
                          <Link
                            to="/catalog"
                            className="flex items-center justify-center gap-1 text-xs font-semibold text-yellow-50 transition-colors duration-150 hover:text-yellow-25"
                          >
                            View all categories
                            <span className="text-base leading-none">→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard - Desktop only */}
        <div className="hidden items-center gap-x-5 lg:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-150">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-150">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>

        {/* Mobile Menu Button - Visible on Tablet/Mobile */}
        <button
          className="mr-4 lg:hidden p-1 text-richblack-100 hover:text-white transition-colors"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <GrClose fontSize={24} color="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} color="#AFB2BF" />
          )}
        </button>
      </div>

      {/* Backdrop for Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar Sheet / Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-md bg-richblack-900 border-l border-richblack-800 z-[1001] p-6 shadow-2xl transition-transform duration-300 ease-in-out transform lg:hidden flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="Logo" width={120} height={24} loading="lazy" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-richblack-100 hover:text-white transition-colors"
            >
              <GrClose fontSize={24} />
            </button>
          </div>

          <div className="h-[1px] bg-richblack-700 w-full" />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-y-4">
            {NavbarLinks.map((link, index) => (
              <div key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                      className="flex items-center justify-between text-richblack-25 font-medium py-2 w-full text-left hover:text-yellow-25 transition-colors"
                    >
                      <span>Catalog</span>
                      <BsChevronDown className={`transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isCatalogOpen && (
                      <div className="flex flex-col pl-4 border-l border-richblack-700 gap-y-3 mt-2 max-h-[220px] overflow-y-auto nav-dropdown-scroll">
                        {loading ? (
                          <div className="flex items-center gap-2 py-2">
                            <div className="h-3 w-3 animate-spin rounded-full border border-richblack-500 border-t-yellow-50"></div>
                            <p className="text-xs text-richblack-400">Loading...</p>
                          </div>
                        ) : subLinks.length ? (
                          subLinks
                            .filter(
                              (subLink) =>
                                Array.isArray(subLink?.courses) &&
                                subLink.courses.length > 0
                            )
                            .map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                key={i}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsCatalogOpen(false);
                                }}
                                className="text-sm font-medium text-richblack-100 hover:text-white transition-colors py-1"
                              >
                                {subLink.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-xs text-richblack-400 py-2">No categories found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link?.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-richblack-25 font-medium hover:text-yellow-25 transition-colors"
                  >
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer actions inside Sidebar Drawer */}
        <div className="flex flex-col gap-y-4 mt-6">
          <div className="h-[1px] bg-richblack-700 w-full" />
          
          <div className="flex flex-col gap-y-6">
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link
                to="/dashboard/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-richblack-100 hover:text-white transition-colors py-2"
              >
                <div className="relative">
                  <AiOutlineShoppingCart className="text-2xl" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">Cart ({totalItems})</span>
              </Link>
            )}

            {!token ? (
              <div className="flex flex-col gap-y-3 mt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full text-center rounded-[8px] border border-richblack-700 bg-richblack-800 px-[18px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-150">
                    Log in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full text-center rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-150">
                    Sign up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-x-3 py-2">
                <ProfileDropDown />
                <span className="text-sm font-medium text-richblack-100">Profile</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
