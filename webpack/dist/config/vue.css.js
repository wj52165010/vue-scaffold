"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//样式配置
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const css_base_1 = require("./css.base");
const config = new webpack_chain_1.default();
config.module
    .rule('vue-normarl')
    .test(/\.css$/i)
    .use('vue-style-loader')
    .loader('vue-style-loader')
    .end()
    .end()
    .rule('less-normarl')
    .test(/\.less$/i)
    .exclude
    .add(/\.module\.less$/i)
    .end()
    .use('vue-style-loader')
    .loader('vue-style-loader')
    .end()
    .end()
    .rule('less-module')
    .test(/\.module\.less$/i)
    .use('vue-style-loader')
    .loader('vue-style-loader')
    .end()
    .use('style-loader')
    .loader('style-loader')
    .end()
    .use('css-loader')
    .loader('css-loader')
    .options({
    modules: true
})
    .end()
    .end();
(0, css_base_1.merge_css)('vue-normarl', ['mini-css-extract-normal', 'css-normal', 'postcss-normal'], config);
(0, css_base_1.merge_css)('less-normarl', ['mini-css-extract-normal', 'css-normal', 'postcss-normal', 'less-normal'], config);
(0, css_base_1.merge_css)('less-module', ['postcss-normal', 'less-normal'], config);
exports.default = config.toConfig();
