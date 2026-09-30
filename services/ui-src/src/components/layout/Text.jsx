import React, { useMemo } from "react";

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

const parseLinks = (str) => {
  let links = linkRegex.exec(str);
  if (links) {
    /*
     * Copy off the string locally so we can modify it. We'll be chopping bits
     * off as we go along.
     */
    let remainingStr = str;
    const parts = [];

    while (links) {
      const [fullMatch, text, href] = links;

      /*
       * Get the part of the remaining text before the link, then push that
       * preceding text and the link into the parts.
       */
      const [precedingText] = remainingStr.split(fullMatch);

      if (precedingText) {
        parts.push(<span key={crypto.randomUUID()}>{precedingText}</span>);
      }

      parts.push(
        <a key={crypto.randomUUID()} href={href}>
          {text}
        </a>
      );
      /*
       * Recompute the remaining string to remove the preceding text and the
       * link that we've already added to the parts.
       */
      remainingStr = remainingStr.substr(
        remainingStr.indexOf(fullMatch) + fullMatch.length
      );

      links = linkRegex.exec(str);
    }

    /*
     * Add any remaining string to the parts. This is the part of the string
     * that follows the last link.
     */
    if (remainingStr) {
      parts.push(<span key={crypto.randomUUID()}>{remainingStr}</span>);
    }

    return parts;
  }

  // If there aren't any links, return the original string in an array.
  return [<span key={crypto.randomUUID()}>{str}</span>];
};

const Text = ({ children }) => {
  return useMemo(() => {
    if (children.split) {
      return children.split("\n\n").map((paragraph, index) => {
        const lines = paragraph.split("\n");

        const brokenLines = [...parseLinks(lines[0])];
        for (let i = 1; i < lines.length; i += 1) {
          brokenLines.push(
            <br key={crypto.randomUUID()} />,
            ...parseLinks(lines[i])
          );
        }

        if (index > 0) {
          return <p key={crypto.randomUUID()}>{brokenLines}</p>;
        }
        return brokenLines;
      });
    }
    return children;
  }, [children]);
};

export default Text;
