// This file is heavily based on create-react-app's implementation
// @see https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/dependencies.js

import path from "path"

interface IPresetOptions {
  stage?: "build-javascript" | "build-html" | "develop" | "develop-html"
}

// export default is required here because it is passed directly to webpack
// via require.resolve
// This function has a better inference than would be beneficial to type, and it's relatively easy to grok.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (_?: unknown, options: IPresetOptions = {}) => {
  // TODO(v3): Remove process.env.GATSBY_BUILD_STAGE, needs to be passed as an option
  const stage = options.stage || process.env.GATSBY_BUILD_STAGE || `test`

  return {
    // Babel assumes ES Modules, which isn't safe until CommonJS
    // dies. This changes the behavior to assume CommonJS unless
    // an `import` or `export` is present in the file.
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: `unambiguous`,
    presets: [
      [
        // Latest stable ECMAScript features
        require.resolve(`@babel/preset-env`),
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: `usage`,
          corejs: 2,
          modules: false,
          // Exclude transforms that make all code slower (https://github.com/facebook/create-react-app/pull/5278)
          exclude: [`transform-typeof-symbol`],
        },
      ],
    ],
    plugins: [
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require.resolve(`@babel/plugin-transform-runtime`),
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: true,
          absoluteRuntime: false,
        },
      ],
      // Adds syntax support for import()
      require.resolve(`@babel/plugin-syntax-dynamic-import`),
      stage === `build-javascript` && [
        // Remove PropTypes from production build
        require.resolve(`babel-plugin-transform-react-remove-prop-types`),
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  }
}
