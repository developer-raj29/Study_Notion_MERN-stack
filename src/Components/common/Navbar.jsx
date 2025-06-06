// const subLinks = [
//   {
//     title: "Python",
//     link: "/catalog/python",
//   },
//   {
//     title: "javascript",
//     link: "/catalog/javascript",
//   },
//   {
//     title: "web-development",
//     link: "/catalog/web-development",
//   },
//   {
//     title: "Android Development",
//     link: "/catalog/Android Development",
//   },
// ];

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

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API);
  //       setSubLinks(res.data.allCategory);
  //     } catch (error) {
  //       console.log("Could not fetch Categories.", error);
  //     }
  //     setLoading(false);
  //   })();
  // }, []);

  console.log("sub links", subLinks);

  const fetchSubLinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log("API Response", result);
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

  console.log("open: ", isOpen);

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
        {/* Navigation links */}
        {/* <nav className="hidden md:block"> */}
        {/* <nav
          className={`${
            isOpen
              ? "hidden md:block"
              : "lg:hidden flex flex-col items-center backdrop-blur-md absolute md:top-0 sm:top-[50px] xs:top-[130px] top-[115px] md:py-8 sm:py-6 py-5 md:px-14 sm:px-12 px-11 gap-6 md:right-5 sm:right-2 right-0 border border-[#858484] shadow-2xl shadow-slate-700 rounded-[2rem]"
          }`}
        >
          <ul
            className={`flex ${
              isOpen ? "flex-row gap-x-6" : "flex-col gap-y-6"
            }  text-richblack-25`}
          >
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>

                      <BsChevronDown />

                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) =>
                                  Array.isArray(subLink?.courses) &&
                                  subLink.courses.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
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
        </nav> */}
        <nav
          className={`${
            isOpen
              ? "lg:hidden flex flex-col items-center backdrop-blur-md absolute top-[53px] py-5 px-11 gap-6 right-3 border border-[#858484] shadow-2xl shadow-slate-700 rounded-[2rem] bg-richblack-800 z-[999]"
              : "hidden md:block"
          }`}
        >
          <ul
            className={`flex ${
              isOpen ? "flex-col gap-y-6" : "flex-row gap-x-6"
            } text-richblack-25`}
          >
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
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
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
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                              onClick={() => setIsOpen(false)} // ✅ Close on mobile
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} onClick={() => setIsOpen(false)}>
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

          {/* Auth / Cart / Profile Section */}
          {isOpen && (
            <div className="flex flex-col md:flex-row items-center gap-5">
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

              {!token && (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[18px] py-[8px] text-richblack-100">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                      Sign up
                    </button>
                  </Link>
                </>
              )}

              {token && <ProfileDropDown />}
            </div>
          )}
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-5 md:flex">
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
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>

        {/* <nav
          className={`${
            isOpen
              ? "lg:hidden flex flex-col items-center bg-gradient-to-br from-gray-500 to-black backdrop-blur-md absolute md:top-[170px] sm:top-[95px] xs:top-[130px] top-[115px] md:py-8 sm:py-6 py-5 md:px-14 sm:px-12 px-11 gap-6 md:right-5 sm:right-2 right-0 border border-[#858484] shadow-2xl shadow-slate-700 rounded-[2rem]"
              : "hidden md:block"
          }`}
        >
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>

                      <BsChevronDown />

                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) =>
                                  Array.isArray(subLink?.courses) &&
                                  subLink.courses.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
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
        </nav> */}

        <button
          className="mr-4 md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <GrClose fontSize={24} color="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} color="#AFB2BF" />
          )}
          {/* <AiOutlineMenu fontSize={24} fill="#AFB2BF" /> */}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
