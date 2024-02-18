"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//打包配置pro
const webpack_1 = __importDefault(require("webpack"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const plugin_base_1 = __importDefault(require("./plugin.base"));
const webpack_2 = require("webpack");
const os_1 = __importDefault(require("os"));
const threads = os_1.default.cpus().length;
const config = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        chunkIds: 'named',
        minimize: true,
        minimizer: [
            new css_minimizer_webpack_plugin_1.default({
                parallel: threads
            }),
            new terser_webpack_plugin_1.default({
                parallel: threads,
                terserOptions: {
                    mangle: false
                }
            })
        ],
        splitChunks: ({
            cacheGroups: {
                vendors: {
                    name: `chunk-vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: `chunk-common`,
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        })
    },
    plugins: [
        new webpack_1.default.ProgressPlugin({
            activeModules: true,
            entries: true,
            modules: false,
            modulesCount: 5000,
            profile: false,
            dependencies: false,
            dependenciesCount: 10000, // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
        }),
        new webpack_2.CleanPlugin()
    ]
};
exports.default = (0, webpack_merge_1.default)(config, plugin_base_1.default);
