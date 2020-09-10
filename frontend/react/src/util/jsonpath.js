/* What exactly is the point of this whole thing, you may be asking. A valid
   question. It turns out that the performance of jsonpath is highly dependent
   on how generic the search path is. The more generic, the worse the
   performance. And not by just a little bit. In the case of CARTS data, a
   query on just an ID (something like "?..(id=='2020-01-a-01-01')") takes
   literally ONE THOUSAND TIMES longer than a query for the same node's exact
   path.

   So, what if we take all those generic lookups that come in, find the exact
   path that corresponds to the generic path, and then cache those exact paths?
   The first queries are still slow, but every subsequent query is suddenly
   anywhere from 10 to 1000 times faster. So this exists as a drop-in wrapper
   around jsonpath so that we can get the performance benefits everywhere
   without having to change anything anywhere else.
 */
const jsonpath = require("jsonpath");

// Map of generic paths to their exact counterparts
const exactPathMap = {};

const getExactPath = (data, path) => {
  let exact = exactPathMap[path];

  // If we don't already have a matching exact path, we'll need to fetch it.
  if (!exact) {
    const paths = jsonpath.paths(data, path);

    if (paths.length > 0) {
      // If there are any matching paths, cache off the first one. The paths
      // we get back above are in array form, but we want to cache the string
      // form, so stringify it first.
      exact = jsonpath.stringify(paths[0]);
    } else {
      // If there is NOT a matching path, cache the inexact path so we don't
      // bother doing the path lookup again in the future.
      exact = path;
    }

    exactPathMap[path] = exact;
  }

  return exact;
};

// These are the methods in jsonpath that actually do lookups into the data
// object, so these should use the cache. Build those methods here.
const methodsToWrap = ["apply", "nodes", "parent", "paths", "query", "value"];
const wrappers = methodsToWrap.reduce(
  (current, methodName) => ({
    ...current,
    [methodName]: (obj, path, ...rest) => {
      const exactPath = getExactPath(obj, path);
      return jsonpath[methodName](obj, exactPath, ...rest);
    },
  }),
  {}
);

// These methods don't do lookups, so we can just pass them straight through.
wrappers.parse = jsonpath.parse;
wrappers.stringify = jsonpath.stringify;

export default wrappers;
