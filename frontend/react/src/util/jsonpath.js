const jsonpath = require('jsonpath');

const exactPathMap = {};

const getExactPath = (data, path) => {
  let exact = exactPathMap[path];

  if(!exact) {
    const paths = jsonpath.paths(data, path);
    if (paths.length > 0) {
      exact = jsonpath.stringify(paths[0]);
    } else {
      exact = jsonpath.stringify(path);
    }
    exactPathMap[path] = exact;
  }

  return exact;
};

const methodsToWrap = ['apply', 'nodes', 'parent', 'paths', 'query', 'value'];
const wrappers = methodsToWrap.reduce((o, methodName) => ({
  ...o,
  [methodName]: (obj, path, ...rest) => {
    const exactPath = getExactPath(obj, path);
    return jsonpath[methodName](obj, exactPath, ...rest);
  }
}), {});

wrappers.parse = jsonpath.parse;
wrappers.stringify = jsonpath.stringify;

export default wrappers;