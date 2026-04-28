/*
 * What exactly is the point of this whole thing, you may be asking. A valid
 * question. It turns out that the performance of jsonpath is highly dependent
 * on how generic the search path is. The more generic, the worse the
 * performance. And not by just a little bit. In the case of CARTS data, a
 * query on just an ID (something like "?..(id=='2020-01-a-01-01')") takes
 * literally ONE THOUSAND TIMES longer than a query for the same node's exact
 * path.
 *
 * So, what if we take all those generic lookups that come in, find the exact
 * path that corresponds to the generic path, and then cache those exact paths?
 * The first queries are still slow, but every subsequent query is suddenly
 * anywhere from 10 to 1000 times faster. So this exists as a drop-in wrapper
 * around jsonpath so that we can get the performance benefits everywhere
 * without having to change anything anywhere else.
 */
import { JSONPath } from "jsonpath-plus";
import idLetterMarkers from "./idLetterMarkers";

const toPathArray = (path) => JSONPath.toPathArray(path);
const toPathString = (path) => JSONPath.toPathString(path);

const findMatches = (obj, path) =>
  JSONPath({ json: obj, path, resultType: "all", wrap: true });

const toNode = ({ path, value }) => ({
  path: toPathArray(path),
  value,
});

const setValueAtPath = (obj, path, value) => {
  const tokens = toPathArray(path).slice(1);

  if (tokens.length === 0) {
    return undefined;
  }

  let current = obj;
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    const nextToken = tokens[index + 1];

    if (current[token] === undefined) {
      current[token] = /^\d+$/.test(String(nextToken)) ? [] : {};
    }

    current = current[token];
  }

  current[tokens.at(-1)] = value;
  return value;
};

const fullPathFromIDPath = (originalPath) => {
  const idMatch = /\[\?\(@\.id===?['"]([^'"]+)['"]\)\](.*)$/.exec(originalPath);

  // Don't bother building up a short-circuited path if there's not an ID.
  if (idMatch) {
    /*
     * Pull out the ID as well as everything *after* the ID. That stuff needs
     * to get pusehd on to the back of whatever path we build up here.
     */
    const [, id, rest] = idMatch;

    // Split the ID into its parts. We don't need the year, so toss it.
    const [, section, subsection, part, question] = id.split("-");

    // Now see what bits we have and assemble the pieces.
    const pathParts = ["$."];
    if (section) {
      // Sections start at 0, so we don't have to do anything special with them.
      pathParts.push(`.formData[${+section}].contents.section`);
    }
    if (subsection) {
      /*
       * We'll make an assumption that subsections will always be a-zz, because
       * that seems safe enough for now.
       */
      const subsectionNumber = idLetterMarkers.indexOf(subsection);
      pathParts.push(`.subsections[${subsectionNumber}]`);
    }
    if (part) {
      // Parts start at 1, but arrays don't.
      pathParts.push(`.parts[${+part - 1}]`);
    }
    if (question) {
      // If there's a question part, then the whole ID is for a question. Yay!
      pathParts.push(`..questions[?(@ && @.id==='${id}')]`);
    }

    // Now tack on anything at the end and push it all together.
    pathParts.push(rest);
    return pathParts.join("");
  }

  return originalPath;
};

// Map of generic paths to their exact counterparts
const exactPathMap = {};

const getExactPath = (data, path) => {
  let exact = exactPathMap[path];

  // If we don't already have a matching exact path, we'll need to fetch it.
  if (!exact) {
    const pathShortCircuit = fullPathFromIDPath(path);
    const paths = JSONPath({
      json: data,
      path: pathShortCircuit,
      resultType: "path",
      wrap: true,
    }).map(toPathArray);

    if (paths.length > 0) {
      /*
       * If there are any matching paths, cache off the first one. The paths
       * we get back above are in array form, but we want to cache the string
       * form, so stringify it first.
       */
      exact = toPathString(paths[0]);

      /*
       * If the incoming path ends with [*], the jsonpath.paths method will
       * return an array with all of the matching paths, and the first one will
       * end with [0]. But that's not what is being requested: the [*] at the
       * end means the request is for ALL of the things, not the first, so in
       * that case, replace [0] at the end of the exact path with [*].
       */
      if (path.endsWith("[*]")) {
        exact = exact.replace(/\[0\]$/, "[*]");
      }
    } else {
      /*
       * If there is NOT a matching path, cache the inexact path so we don't
       * bother doing the path lookup again in the future.
       */
      exact = path;
    }

    exactPathMap[path] = exact;
  }

  return exact;
};

/*
 * These are the methods in jsonpath that actually do lookups into the data
 * object, so these should use the cache. Build those methods here.
 */
const methodsToWrap = ["apply", "nodes", "parent", "paths", "query", "value"];
const wrappers = methodsToWrap.reduce((current, methodName) => {
  current[methodName] = (obj, path, ...rest) => {
    const exactPath = getExactPath(obj, path);

    switch (methodName) {
      case "apply": {
        const [callback] = rest;
        return findMatches(obj, exactPath).map((match) => {
          const nextValue = callback(match.value);
          if (
            match.parent &&
            match.parentProperty !== null &&
            match.parentProperty !== undefined
          ) {
            match.parent[match.parentProperty] = nextValue;
          }
          return toNode({ ...match, value: nextValue });
        });
      }
      case "nodes":
        return findMatches(obj, exactPath).map(toNode);
      case "parent":
        return JSONPath({
          json: obj,
          path: exactPath,
          resultType: "parent",
          wrap: false,
        });
      case "paths":
        return JSONPath({
          json: obj,
          path: exactPath,
          resultType: "path",
          wrap: true,
        }).map(toPathArray);
      case "query":
        return JSONPath({ json: obj, path: exactPath, wrap: true });
      case "value": {
        const [nextValue] = rest;
        if (nextValue === undefined) {
          return JSONPath({ json: obj, path: exactPath, wrap: false });
        }

        const [match] = findMatches(obj, exactPath);
        if (
          match?.parent &&
          match.parentProperty !== null &&
          match.parentProperty !== undefined
        ) {
          match.parent[match.parentProperty] = nextValue;
          return nextValue;
        }

        return setValueAtPath(obj, exactPath, nextValue);
      }
    }
  };
  return current;
}, {});

// These methods don't do lookups, so we can just pass them straight through.
wrappers.parse = JSONPath.toPathArray;
wrappers.stringify = JSONPath.toPathString;

export default wrappers;
