const path = require("path");
const fs = require("fs");
const findRoot = require("find-root");

/**
 * Return the root's path of this monorepo.
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()).
 * @returns {string} Monorepo's root path.
 */
module.exports = function getMonorepoRoot(params = {}) {
  const { cwd = process.cwd() } = params;
  const root = findRoot(cwd, function (dir) {
    const packageJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      return (
        packageJson.workspaces &&
        (Array.isArray(packageJson.workspaces) ||
          packageJson.workspaces.packages)
      );
    }
    return false;
  });
  return root;
};
