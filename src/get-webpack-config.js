const path = require("path");
const getNohoist = require("./get-nohoist");

/**
 * @typedef {Object} MonorepoWebpackConfig
 * @prop {Object} alias - React Native web alias mapping (`react-native` → `react-native-web`).
 */

/**
 * Return a (partial) Webpack configuration compatible with Yarn workspaces.
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()). 
 * @returns {MonorepoWebpackConfig} Webpack config for this monorepo.
 */
module.exports = function getWebpackConfig(params = {}) {
  const { cwd = process.cwd() } = params;
  const nohoistLibNames = getNohoist({
    cwd,
    currentWorkspaceOnly: true,
    libNamesOnly: true,
  });
  const alias = {};
  nohoistLibNames.forEach((nohoistLibName) => {
    alias[nohoistLibName] =
      nohoistLibName === "react-native"
        ? path.resolve(cwd, "./node_modules/react-native-web")
        : path.resolve(cwd, `./node_modules/${nohoistLibName}`);
  });
  return { alias };
};
