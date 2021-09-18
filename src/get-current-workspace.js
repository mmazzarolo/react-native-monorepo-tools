const findRoot = require("find-root");

/**
 * Return the current workspace path.
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()).
 * @returns {string | undefined} Current workspace path.
 */
module.exports = function getCurrentWorkspace(params = {}) {
  const { cwd = process.cwd() } = params;
  return findRoot(cwd);
};
