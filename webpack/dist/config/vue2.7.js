"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//vue2.7项目配置
const path_1 = __importDefault(require("path"));
const vue_loader_1 = require("vue-loader");
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const vue_css_1 = __importDefault(require("./vue.css"));
const config = {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    { loader: 'vue-loader' },
                    { loader: path_1.default.resolve(__dirname, '../loader/magic-comment/index.js'), options: { type: 'vue' } }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 6 * 1024
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        },
        extensions: ['vue', 'ts'],
    },
    plugins: [
        new vue_loader_1.VueLoaderPlugin()
    ]
};
exports.default = (0, webpack_merge_1.default)(config, vue_css_1.default);
