import { useEffect } from "react";
import { withRouter } from "react-router-dom";

function ScrollToTop({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);

      // Remove focus from clicked button
      document.activeElement.blur();
    });
    return () => {
      unlisten();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default withRouter(ScrollToTop);
