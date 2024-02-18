"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = exports.lib = exports.pro = exports.dev = void 0;
const webpack_1 = __importDefault(require("webpack"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const dev_1 = __importDefault(require("./config/dev"));
const pro_1 = __importDefault(require("./config/pro"));
const lib_1 = __importDefault(require("./config/lib"));
const devServer_1 = __importDefault(require("./config/devServer"));
const utils_1 = require("@aos-cli/utils");
const enum_1 = require("./enum");
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_iframe_pack_1 = __importDefault(require("./plugin/webpack-iframe-pack"));
// 开发阶段
const dev = ({ FontFrame }) => {
    process.env.AOS_MODE = 'DEV';
    process.env.AOS_FONTFRAME = FontFrame;
    const baseConfig = require('./config/base').default;
    const FontFramConfig = require(`./config/${enum_1.FF[FontFrame]}`).default;
    const compiler = (0, webpack_1.default)((0, webpack_merge_1.default)(FontFramConfig, dev_1.default, baseConfig));
    const devServer = new webpack_dev_server_1.default(devServer_1.default, compiler);
    let isFirstCompile = true;
    const serverPort = devServer_1.default.port;
    const protocol = devServer_1.default.https ? 'https' : 'http';
    const publicPath = '/';
    const localUrl = `${protocol}://localhost:${serverPort}${publicPath}`;
    const localIpUrl = `${protocol}://${(0, utils_1.getLocalIP)()}:${serverPort}${publicPath}`;
    compiler.hooks.done.tap('webpack dev', (stats) => {
        if (stats.hasErrors()) {
            return;
        }
        if (isFirstCompile) {
            isFirstCompile = false;
            console.log(`

  ***************************************
  *                                     *
  *           ${utils_1.chalk.green.bold('Welcome to Aos')}           *
  *                                     *
  ***************************************
  `);
            console.log(`🚀...${utils_1.chalk.bgRedBright(' DevServer ')} running at ${utils_1.chalk.green(localUrl)}`);
            console.log(`🚀...${utils_1.chalk.bgRedBright(' DevServer ')} running at ${utils_1.chalk.green(localIpUrl)} \n`);
        }
    });
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            devServer.stop();
        });
    });
    devServer.start().catch(() => process.exit(1));
};
exports.dev = dev;
//构建阶段(项目)
const pro = ({ FontFrame }) => {
    process.env.AOS_MODE = 'PRODUCTION';
    process.env.AOS_FONTFRAME = FontFrame;
    const baseConfig = require('./config/base').default;
    const FontFramConfig = require(`./config/${enum_1.FF[FontFrame]}`).default;
    (0, webpack_1.default)((0, webpack_merge_1.default)(FontFramConfig, pro_1.default, baseConfig), (err, stats) => {
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.pro = pro;
//构建库(三方组件库)
const lib = ({ FontFrame }) => {
    const filterPlugins = [copy_webpack_plugin_1.default, eslint_webpack_plugin_1.default, html_webpack_plugin_1.default];
    process.env.AOS_MODE = 'LIB';
    process.env.AOS_FONTFRAME = FontFrame;
    const baseConfig = require('./config/base').default;
    baseConfig.plugins = baseConfig.plugins.filter((plugin) => !filterPlugins.find(pt => plugin instanceof pt));
    baseConfig.externals = 'vue';
    const FontFramConfig = require(`./config/${enum_1.FF[FontFrame]}`).default;
    (0, webpack_1.default)((0, webpack_merge_1.default)(FontFramConfig, lib_1.default, baseConfig), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.lib = lib;
//构建SDK
const sdk = ({ FontFrame }) => {
    process.env.AOS_MODE = 'PRODUCTION';
    process.env.AOS_FONTFRAME = FontFrame;
    const baseConfig = require('./config/base').default;
    const FontFramConfig = require(`./config/${enum_1.FF[FontFrame]}`).default;
    (0, webpack_1.default)((0, webpack_merge_1.default)(FontFramConfig, pro_1.default, { plugins: [new webpack_iframe_pack_1.default()] }, baseConfig), (err, stats) => {
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.sdk = sdk;
