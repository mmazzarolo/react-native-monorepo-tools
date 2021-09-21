const path = require("path");
const getCurrentWorkspace = require("./get-current-workspace");
const getMonorepoRoot = require("./get-monorepo-root");
const getNohoist = require("./get-nohoist");
const getWorkspaces = require("./get-workspaces");

/**
 * @typedef {Object} MonorepoMetroConfig
 * @prop {string[]} watchFolders - Directories watched by metro.
 * @prop {Regex[]} blockList - List of regexes resolving to paths ignored by metro.
 * @prop {string[]} extraNodeModules - List of required modules outside of the workspace directory.
 */

/**
 * Return Metro tools to make it compatible with Yarn workspaces.
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()). 
 * @param {string} [params.reactNativeAlias] - Alias for the react-native lib (e.g., react-native-macos).
 * @returns {MonorepoMetroConfig} Metro config for this monorepo.
 */
module.exports = function getMetroConfig(params = {}) {
  const { cwd = process.cwd(), reactNativeAlias } = params;
  const currentWorkspace = getCurrentWorkspace({ cwd });

  // extraNodeModules + blockList
  const currentWorkspaceName = path.basename(currentWorkspace);
  const nohoistLibNames = getNohoist({
    cwd,
    currentWorkspaceOnly: true,
    libNamesOnly: true,
  });
  const blockList = [];
  const extraNodeModules = {};
  nohoistLibNames.forEach((nohoistLibName) => {
    extraNodeModules[nohoistLibName] =
      reactNativeAlias && nohoistLibName === "react-native"
        ? path.resolve(cwd, `./node_modules/${reactNativeAlias}`)
        : path.resolve(cwd, `./node_modules/${nohoistLibName}`);
    const regexSafeNohoistLibName = nohoistLibName.replace("/", "\\/");
    blockList.push(
      new RegExp(
        `^((?!${currentWorkspaceName}).)*\\/node_modules\\/${regexSafeNohoistLibName}\\/.*$`
      )
    );
  });

  // watchFolders
  const monorepoRoot = getMonorepoRoot({ cwd });
  const watchFolders = [
    path.join(monorepoRoot, "/node_modules"),
    ...getWorkspaces({ cwd }),
  ];

  return { extraNodeModules, blockList, watchFolders };
};
