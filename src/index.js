const getMonorepoRoot = require("./get-monorepo-root");
const getWorkspaces = require("./get-workspaces");
const getNohoist = require("./get-nohoist");
const getMetroTools = require("./get-metro-tools");
const getWebpackTools = require("./get-webpack-tools");
const getMetroAndroidAssetsResolutionFix = require("./get-metro-android-assets-resolution-fix");

module.exports = {
  getMonorepoRoot,
  getWorkspaces,
  getNohoist,
  getMetroTools,
  getWebpackTools,
  getMetroConfig: getMetroTools, // Deprecated
  getWebpackConfig: getWebpackTools, // Deprecated
  getMetroAndroidAssetsResolutionFix,
};
