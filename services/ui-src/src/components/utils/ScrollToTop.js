import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Remove focus from clicked button
    document.activeElement.blur();
  }, [location]);

  return null;
}

export default ScrollToTop;
