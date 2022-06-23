// Extract the libraries added to the "nohoist" section of the monorepo's root
const path = require("path");
const glob = require("glob");
const getWorkspaces = require("./get-workspaces");
const getCurrentWorkspace = require("./get-current-workspace");
const getMonorepoRoot = require("./get-monorepo-root");

/**
 * Return the nothoist libraries of this monorepo (as paths or names).
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()).
 * @param {string} [params.currentWorkspaceOnly = false] - Limit to nohoist used in the current workspace?
 * @param {string} [params.libNamesOnly = false] - Return the nohoist lib names (instead of full paths)?
 * @returns {string[]} Nohoist libraries.
 */
module.exports = function getNohoist(params = {}) {
  const {
    cwd = process.cwd(),
    currentWorkspaceOnly = false,
    libNamesOnly = false,
  } = params;
  const workspaces = currentWorkspaceOnly
    ? [getCurrentWorkspace({ cwd })]
    : getWorkspaces({ cwd });
  const monorepoRoot = getMonorepoRoot({ cwd });
  const packageJson = require(path.join(monorepoRoot, "package.json"));
  const nohoistGlobs = packageJson.workspaces.nohoist || [];

  // Also add nohoist values of "workspaces.nohoist" of the current workspace'
  // package.json (if any). 
  const currentWorkspacePackageJson = require(path.join(cwd, "package.json"));
  if (
    currentWorkspacePackageJson &&
    currentWorkspacePackageJson.workspaces &&
    currentWorkspacePackageJson.workspaces.nohoist
  ) {
    nohoistGlobs.push(...currentWorkspacePackageJson.workspaces.nohoist);
  }

  return nohoistGlobs
    .map((nohoistGlob) =>
      nohoistGlob.endsWith("/**")
        ? nohoistGlob.substring(0, nohoistGlob.lastIndexOf("/**"))
        : nohoistGlob
    )
    .map((nohoistGlob) => {
      return workspaces.map((workspace) => {
        return glob
          .sync(`${nohoistGlob}/`, {
            noglobstar: true,
            cwd: workspace,
          })
          .map((relativeNohoistPath) => {
            return path.join(workspace, relativeNohoistPath);
          });
      });
    })
    .flat(2)
    .map((nohoistPath) => {
      if (process.platform === "win32" && libNamesOnly) {
        nohoistPath = nohoistPath.replace(/\\/g, "/");
      }
      return libNamesOnly
        ? nohoistPath.substring(
            nohoistPath.lastIndexOf("node_modules/") + `node_modules/`.length,
            nohoistPath.length - 1
          )
        : nohoistPath;
    });
};
