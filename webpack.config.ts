import { join, resolve } from "path";
import TerserPlugin from "terser-webpack-plugin";
import {
  Configuration as WebpackConfiguration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
  optimize,
  DefinePlugin,
  ProvidePlugin,
} from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { constants } from "zlib";
import RobotstxtPlugin from "robotstxt-webpack-plugin";
import SitemapPlugin from "sitemap-webpack-plugin";
import InterpolateHtmlPlugin from "interpolate-html-plugin";
import MinifyJSONWebpackPlugin from "minify-json-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import DuplicatePackageCheckerPlugin from "duplicate-package-checker-webpack-plugin";
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin";
import PreloadWebpackPlugin from "@vue/preload-webpack-plugin";
import { Configuration as WebpackDevelopmentServerConfiguration } from "webpack-dev-server";
import UnusedWebpackPlugin from "unused-webpack-plugin";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevelopmentServerConfiguration;
}

const { AggressiveMergingPlugin } = optimize;

const getEntryPoint = (): string => {
  return join(__dirname, "src", "index.tsx");
};

const getBabelTarget = (targetToModern: boolean): string | string[] => {
  return targetToModern
    ? [
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "not Firefox < 60",
        "not Chrome < 60",
      ]
    : "> 0.25%, not dead";
};

const setupConfig = (
  _environment: unknown,
  { mode }: { mode: string },
): Configuration[] => {
  const getConfig = (targetToModern: boolean): Configuration => {
    const entryPoint: string = getEntryPoint();
    const babelTarget: string = getBabelTarget(targetToModern);
    return {
      mode: mode === "development" ? mode : "production",
      entry: entryPoint,
      target: "web",
      optimization: {
        minimize: mode !== "development",
        minimizer: [new TerserPlugin() as unknown as WebpackPluginInstance],
        usedExports: true,
      },
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: "url-loader",
              },
            ],
          },
          {
            test: /\.svg$/,
            use: ["@svgr/webpack"],
          },
          {
            test: /\.(js)$/,
            enforce: "pre",
            use: ["source-map-loader"],
          },
          {
            test: /\.(ts|tsx)$/,
            include: join(__dirname, "src"),
            exclude: [/(node_modules|bower_components)/],
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/env",
                      {
                        targets: babelTarget,
                        bugfixes: true,
                        useBuiltIns: "usage",
                        corejs: "3",
                      },
                    ],
                    "@babel/preset-typescript",
                    [
                      "@babel/preset-react",
                      {
                        runtime: "automatic",
                      },
                    ],
                  ],
                  plugins: [
                    "lodash",
                    "@emotion",
                    targetToModern &&
                      mode === "development" &&
                      require.resolve("react-refresh/babel"),
                  ].filter(Boolean),
                },
              },
            ],
          },
        ],
      },
      output: {
        path: join(
          __dirname,
          "dist",
          "src",
          targetToModern ? "modern" : "legacy",
        ),
        publicPath: `/src/${targetToModern ? "modern" : "legacy"}/`,
        filename: "index.js",
        module: targetToModern,
        chunkFilename: "[id].js",
      },
      resolve: {
        extensions: [".js", ".ts", ".tsx", ".jsx", ".json"],
        alias: {
          "@babel/runtime": resolve(
            __dirname,
            "node_modules",
            "@babel",
            "runtime",
          ),
          "@root": join(__dirname, "src"),
          "@pages": join(__dirname, "src", "pages"),
          "@components": join(__dirname, "src", "components"),
        },
      },
      experiments: {
        topLevelAwait: true,
        outputModule: targetToModern,
      },
      plugins: [
        targetToModern &&
          new PreloadWebpackPlugin({
            rel: "prefetch",
          }),
        new UnusedWebpackPlugin({
          directories: [join(__dirname, "src")],
          exclude: ["*.test.ts", "*.test.tsx", "setupTests.ts"],
          root: __dirname,
        }),
        targetToModern &&
          new ScriptExtHtmlWebpackPlugin({
            async: "index.js",
            module: "index.js",
          }),
        new DuplicatePackageCheckerPlugin(),
        targetToModern &&
          new InterpolateHtmlPlugin({
            PUBLIC_URL: "/static",
            LEGACY_SCRIPT: "/src/legacy/index.js",
          }),
        new DefinePlugin({
          "process.env.DEVELOPMENT": JSON.stringify(mode === "development"),
          "process.env.PUBLIC_URL": JSON.stringify("/static"),
          "process.env.MODERN": JSON.stringify(targetToModern),
        }),
        new CompressionPlugin({
          filename: "[path][base].gz",
          test: /\.(js|css|html|svg)$/,
          deleteOriginalAssets: false,
        }),
        targetToModern &&
          new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
              params: {
                [constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
        new ProvidePlugin({
          process: "process/browser",
        }),
        new CleanWebpackPlugin({
          dry: true,
          dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
        mode !== "development" &&
          new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: "static",
            reportFilename: `../../../${
              targetToModern ? "modern" : "legacy"
            }-analyzer-report.html`,
          }),
        targetToModern &&
          new CopyPlugin({
            patterns: [
              {
                from: join(__dirname, "public"),
                to: join(__dirname, "dist", "static"),
                noErrorOnMissing: true,
                globOptions: {
                  ignore: ["**/index.html"],
                },
              },
            ],
            options: {
              concurrency: 100,
            },
          }),
        targetToModern &&
          new HtmlWebpackPlugin({
            template: join(__dirname, "public", "index.html"),
            filename: join(__dirname, "dist", "index.html"),
            scriptLoading: "blocking",
            minify: mode !== "development",
            inject: true,
          }),
        mode !== "development" &&
          targetToModern &&
          new SitemapPlugin({
            base: "" /* webpage URL */,
            paths: [
              /** paths here for example "/" */
            ],
            options: {
              filename: "../../map.xml",
            },
          }),
        new ESLintPlugin({
          extensions: ["ts", "tsx"],
        }),
        new GenerateSW({
          cleanupOutdatedCaches: true,
          sourcemap: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              handler: "NetworkFirst",
              urlPattern: /.(?:png|jpg|jpeg|svg|html|js)$/,
            },
          ],
          exclude: [/\.md$/],
          babelPresetEnvTargets: [babelTarget],
          swDest: `../../sw-${targetToModern ? "modern" : "legacy"}.js`,
        }),
        new CaseSensitivePathsPlugin(),
        mode !== "development" &&
          targetToModern &&
          new RobotstxtPlugin({
            filePath: "../../robots.txt",
          }),
        targetToModern &&
          mode === "development" &&
          new HotModuleReplacementPlugin(),
        targetToModern &&
          mode === "development" &&
          new ReactRefreshWebpackPlugin(),
        new AggressiveMergingPlugin(),
        new MinifyJSONWebpackPlugin(),
      ].filter(Boolean) as unknown as WebpackPluginInstance[],
      devServer: targetToModern
        ? {
            historyApiFallback: true,
            contentBase: join(__dirname, "dist"),
            compress: true,
            hot: true,
            writeToDisk: true,
          }
        : undefined,
    };
  };
  return [getConfig(true)];
};

export default setupConfig;
