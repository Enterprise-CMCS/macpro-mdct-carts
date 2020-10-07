import React, { useMemo } from "react";

const Text = ({ children }) => {
  return useMemo(() => {
    if (children.split) {
      return children.split("\n\n").map((paragraph, index) => {
        const lines = paragraph.split("\n");

        const brokenLines = [lines[0]];
        for (let i = 1; i < lines.length; i += 1) {
          brokenLines.push(<br />, lines[i]);
        }

        if (index > 0) {
          return <p>{brokenLines}</p>;
        }
        return brokenLines;
      });
    }
    return children;
  }, [children]);
};

export default Text;
