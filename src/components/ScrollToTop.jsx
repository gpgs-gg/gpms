import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 🔥 force scroll to top on refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;
