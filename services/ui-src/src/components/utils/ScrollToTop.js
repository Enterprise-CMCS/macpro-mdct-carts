import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function ScrollToTop() {
  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
      // Remove focus from clicked button
      document.activeElement.blur();
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
}

export default ScrollToTop;
