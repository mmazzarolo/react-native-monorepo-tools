# React Native Monorepo Tools

A set of tools to help you build your React Native project in a Yarn Workspaces monorepo.

Check out the ["Running React Native everywhere"](https://mmazzarolo.com/blog/2021-09-11-running-react-native-everywhere/) tutorial and the [`react-native-universal-monorepo`](https://github.com/mmazzarolo/react-native-universal-monorepo) to see them in action.

## Usage

Install the package using [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/).

```bash
# Using npm
npm install -D react-native-monorepo-tools

# Using yarn
yarn add -D react-native-monorepo-tools
```

## Tools for making React Native codebases compatible with Yarn Workspaces

### `getMetroTools(params: Object): Object`

Return [Metro](https://facebook.github.io/metro/) tools to make it compatible with Yarn workspaces.

#### Usage:

```js
const { getMetroTools } = require("react-native-monorepo-tools");

const metroTools = getMetroTools();

console.log(metroTools.watchFolders);
// ↪ [
//    "/Users/me/my-monorepo/node_modules/"
//    "/Users/me/my-monorepo/packages/workspace-a/",
//    "/Users/me/my-monorepo/packages/workspace-b",
//   ]

console.log(metroTools.blockList);
// ↪ [
//     /^((?!workspace-a).)*\/node_modules\/react\/.*$/,
//     /^((?!workspace-a).)*\/node_modules\/react-native\/.*$/,
//   ]

console.log(metroTools.extraNodeModules);
// ↪ {
//     "react": "/Users/me/my-monorepo/packages/workspace-a/node_modules/react",
//     "react-native": "/Users/me/my-monorepo/packages/workspace-a/node_modules/react-native"
//   }

```

#### Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.
- `reactNativeAlias`: Optional. Alias for the `react-native` lib (e.g., `react-native-macos`).
- `libNamesOnly`: Optional. Return the nothoist list as library names instead of paths? Defaults to `false`.

#### Output:

- `watchFolders`: Directories watched by metro.
- `blockList`: List of regexes resolving to paths ignored by metro.
- `extraNodeModules`: List of required modules outside of the workspace directory.

### `getWebpackTools(params: Object): Object`

Return Webpack tools to make it compatible with Yarn workspaces.

#### Usage:

```js
const { getWebpackTools } = require("react-native-monorepo-tools");
const webpackConfig = require('./webpack.config.js')

const webpackTools = getWebpackTools();

console.log(webpackTools.addNohoistAliases(webpackConfig));
// ↪ alias: {
//     "react": "/Users/me/my-monorepo/packages/workspace-a/node_modules/react"
//     "react-native": "/Users/me/my-monorepo/packages/workspace-a/node_modules/react-native-web"
//   }

console.log(webpackTools.enableWorkspacesResolution(webpackConfig));
// ↪ adds to babel-loader each workspace
```

#### Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.

#### Output:

- `enableWorkspacesResolution(webpackConfig)`: Updates a webpack config to allow importing from external workspaces.
- `addNohoistAliases(webpackConfig)`: Updates a webpack config to ensure nohoisted libraries are resolved from this workspace.

### `getMetroAndroidAssetsResolutionFix(params: Object): Object`

Return the Metro Android assets resolution fix.

Metro's bundler has an issue with assets resolution on Android when importing assets from paths outside of the project's root directory.  
To fix it, we can patch metro's `publicPath` and `enhanceMiddleware` to allow reading from `n` depths below the project directory.
For more info, see this metro comment: https://github.com/facebook/metro/issues/290#issuecomment-543746458

#### Usage:

```js
const {
  getMetroAndroidAssetsResolutionFix,
} = require("react-native-monorepo-tools");

const metroAndroidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix();

console.log(metroAndroidAssetsResolutionFix.publicPath);
// ↪ "/assets/dir/dir/dir/dir"

console.log(metroAndroidAssetsResolutionFix.applyMiddleware);
// ↪ Function that applies the patch middleware to metro.
```

#### Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.

#### Output:

- `publicPath`: Metro's `publicPath`.
- `applyMiddleware`: Function that applies the patch middleware to metro.

## Additional minor utils

### `getMonorepoRoot(params: Object): string`

Return the root path of this monorepo.

Usage:

```js
const { getMonorepoRoot } = require("react-native-monorepo-tools");

const monorepoRoot = getMonorepoRoot();
console.log(monorepoRoot);
// ↪ /Users/me/my-monorepo',
```

Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.

### `getWorkspaces(params: Object): string[]`

Return the workspaces of this monorepo (as paths).

#### Usage:

```js
const { getWorkspaces } = require("react-native-monorepo-tools");

const workspaces = getWorkspaces();
console.log(workspaces);
// ↪ [
//     "/Users/me/my-monorepo/packages/workspace-a",
//     "/Users/me/my-monorepo/packages/workspace-b",
//   ]
```

#### Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.

### `getCurrentWorkspace(params: Object): string`

Return the current workspace path.

#### Usage:

```js
const { getCurrentWorkspace } = require("react-native-monorepo-tools");

const currentWorkspace = getCurrentWorkspace();
console.log(currentWorkspace);
// ↪ "/Users/me/my-monorepo/packages/workspace-a"
```

### `getNohoist(params: Object): string[]`

Return the nothoist libraries of this monorepo (as paths or names).

#### Usage:

```js
const { getNohoist } = require("react-native-monorepo-tools");

const nohoist = getNohoist();
console.log(nohoist);
// ↪ [
//     "/Users/me/my-monorepo/packages/workspace-a/react",
//     "/Users/me/my-monorepo/packages/workspace-a/react-native",
//     "/Users/me/my-monorepo/packages/workspace-b/react",
//     "/Users/me/my-monorepo/packages/workspace-b/react-native",
//   ]
```

#### Available params:

- `cwd`: Optional. Current working directory. Defaults to `process.cwd()`.
- `currentWorkspaceOnly`: Optional. Return the nothoist list for the current workspace only? Defaults to `false`.
- `libNamesOnly`: Optional. Return the nothoist list as library names instead of paths? Defaults to `false`.

## Contributing

Each contribution is welcome!  
Please, check the [contributing guidelines](./CONTRIBUTING.md).

## License

React Native Monorepo Tools is released under [AGPL-3.0 - GNU Affero General Public License v3.0](./LICENSE.md).

### Briefly:

- Modification and redistribution allowed for both private and **commercial use**.  
- You must **grant patent rigth to the owner and to all the contributors**.  
- You must **keep it open source** and distribute under the **same license**.   
- Changes must be documented.  
- Include a limitation of liability and it **does not provide any warranty**.  

### Warranty

THIS TOOL IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.
For the full warranty check the [LICENSE](./LICENSE.md).
