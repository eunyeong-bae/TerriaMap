const esbuild = require("esbuild");
const terriaSassModulesPlugin = require("./terriaSassModulesPlugin");
const babelPlugin = require("./babelPlugin");
const transformJsxControlStatements = require("./babelPluginTransformJsxControlStatements");
const path = require("path");

const includePaths = [
  // Support resolving paths like "terriajs/..."
  path.resolve(path.dirname(require.resolve("terriajs/package.json")), ".."),
  path.resolve(path.dirname(require.resolve("rc-slider/package.json")), ".."),
  path.resolve(
    path.dirname(require.resolve("react-anything-sortable/package.json")),
    ".."
  )
];

esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "wwwroot/esbuild/TerriaMap.js",
    publicPath: "esbuild",
    jsx: "transform",
    define: {
      "process.env.NODE_ENV":
        '"' + (process.env.NODE_ENV ?? "Development") + '"',
      "module.hot": "false",
      global: "globalThis"
    },
    sourcemap: true,
    plugins: [
      terriaSassModulesPlugin({ includePaths }),
      babelPlugin({
        filter: /\.[jt]sx$/,
        config: {
          plugins: [
            //"babel-plugin-jsx-control-statements",
            transformJsxControlStatements,
            "@babel/plugin-syntax-typescript",
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            "@babel/proposal-class-properties",
            "babel-plugin-syntax-jsx",
            "babel-plugin-macros",
            "babel-plugin-styled-components"
          ]
        }
      })
    ],
    loader: {
      ".gif": "file",
      ".png": "file",
      ".jpg": "file",
      ".svg": "file",
      ".html": "text",
      ".glb": "file",
      ".xml": "file",
      ".DAC": "file",
      ".scss": "file" // this is wrong, but let's go with it for now
    },
    external: [
      // Don't try to load node-only modules and other unnecessary stuff
      "fs",
      "path",
      "http",
      "https",
      "zlib",
      "../../wwwroot/images/drag-drop.svg",
      "../../../../wwwroot/images/TimelineIcons.png"
      //"geojson-stream"
    ]
  })
  .then((result) => {
    console.log("success");
    //console.log(result);
  })
  .catch((e) => {
    console.log("error");
    //console.error("ERRORS!", e);
  });
