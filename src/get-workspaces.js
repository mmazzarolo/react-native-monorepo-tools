const path = require("path");
const glob = require("glob");
const getMonorepoRoot = require("./get-monorepo-root");

/**
 * Return the Yarn workspaces of this monorepo (as paths).
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()).
 * @returns {string[]} Monorepo's Yarn workspaces.
 */
module.exports = function getWorkspaces(params = {}) {
  const { cwd = process.cwd() } = params;
  const monorepoRoot = getMonorepoRoot({ cwd });
  const packageJson = require(path.join(monorepoRoot, "package.json"));
  const workspaceGlobs = Array.isArray(packageJson.workspaces)
    ? packageJson.workspaces
    : packageJson.workspaces.packages;
  return workspaceGlobs
    .map((workspaceGlob) => {
      return glob.sync(path.join(monorepoRoot, `${workspaceGlob}/`), { realpath: true });
    })
    .flat();
};
