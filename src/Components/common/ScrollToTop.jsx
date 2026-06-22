import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * Watches for route (pathname) changes and instantly scrolls
 * the window back to (0, 0). Place this anywhere inside <BrowserRouter>.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null; // renders nothing
};

export default ScrollToTop;
