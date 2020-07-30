require("dotenv").config();
const path = require("path");
const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const withProgressBar = require("next-progressbar");

const NODE_ENV = "development";

const styleLoaders = [
  {
    loader: "postcss-loader",
    options: {
      plugins: () => {
        const autoPrefixer = require("autoprefixer")({
          overrideBrowserslist: ["last 1 version", "ie >= 11"],
        });
        return [autoPrefixer];
      },
    },
  },
];

const sassLoader = {
  loader: "sass-loader",
  options: {
    includePaths: [path.resolve(__dirname, "node_modules")],
    data: `
      $feature-flags: (
        ui-shell: true,
      );
    `,
    sourceMap: true,
  },
};

const fastSassLoader = {
  loader: "fast-sass-loader",
  options: {
    includePaths: [path.resolve(__dirname, "node_modules")],
    data: `
    $feature-flags: (
      ui-shell: true,
    );
  `,
    sourceMap: true,
  },
};

module.exports = withProgressBar(
  withSass(
    withCSS({
      env: {
        CORS_PROXY: process.env.CORS_PROXY || "",
        ROOT_PATH: process.env.ROOT_PATH || "/",
      },
      sassLoaderOptions: {
        includePaths: [path.resolve(__dirname, "node_modules")],
      },
      webpack: (config) => {
        config.module.rules.push({
          test: /\.scss$/,
          sideEffects: true,
          use: [
            ...styleLoaders,
            NODE_ENV === "production" ? sassLoader : fastSassLoader,
          ],
        });

        return config;
      },
    })
  )
);
