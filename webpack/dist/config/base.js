"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// 基础配置
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
// import {WebpackApiDefine} from '../plugin'
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const utils_1 = require("@aos-cli/utils");
const theme_1 = __importDefault(require("../theme"));
const enum_1 = require("../enum");
const provide_1 = __importDefault(require("../provide"));
const CopyPlugin = require("copy-webpack-plugin");
const eslintConfig = require(`../eslintConfig/${enum_1.FF[process.env.AOS_FONTFRAME]}`).default;
const threads = os_1.default.cpus().length;
const rootPath = process.cwd();
const relativePath = './';
//项目自主API实例文件路径
const auto_api_path = 'auto-import/api/axios/index.ts';
//外部配置文件名
const external_config_name = 'aos.config.ts';
const external_config_path = path_1.default.resolve(rootPath, `${relativePath}${external_config_name}`);
const extrnal_config = (0, utils_1.existsSync)(external_config_path) ? require(external_config_path) : {};
const { publicPath, magicComment, sdkName, sdkRemoteUrl } = extrnal_config, extrnal_webpack_config = __rest(extrnal_config, ["publicPath", "magicComment", "sdkName", "sdkRemoteUrl"]);
process.env.SDK_NAME = sdkName;
process.env.SDK_REMOTE_URL = sdkRemoteUrl;
//非打包库需要去除打包库配置项
if (process.env.AOS_MODE !== 'LIB') {
    delete extrnal_webpack_config.entry;
    delete extrnal_webpack_config.output;
    delete extrnal_webpack_config.experiments;
}
// 删除开发服务阶段代理配置
if (extrnal_webpack_config.devServer) {
    delete extrnal_webpack_config.devServer;
}
//注入主题切换方法
theme_1.default.register(((_a = extrnal_webpack_config.output) === null || _a === void 0 ? void 0 : _a.filename) || '');
process.env.PUBLIC_PATH = publicPath || './';
process.env.MAGIC_COMMENT = JSON.stringify(magicComment);
const config = {
    entry: {
        app: path_1.default.resolve(rootPath, `${relativePath}src/main.ts`)
    },
    output: {
        path: path_1.default.resolve(rootPath, `${relativePath}dist`),
        filename: '[name].js',
        chunkFilename: '[chunkhash].js',
        assetModuleFilename: 'images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.mjs', '.vue'],
        alias: Object.assign({ 'aos_theme': path_1.default.resolve(__dirname, '../provide/theme.js'), 'aos_api': path_1.default.resolve(rootPath, `${relativePath}src/${auto_api_path}`) }, provide_1.default)
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    { loader: 'thread-loader' },
                    // {loader:path.resolve(__dirname,'../loader/magic-comment/index.js')},
                    { loader: 'babel-loader', options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                ["@babel/plugin-syntax-decorators", { "decoratorsBeforeExport": true }]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false
                        } }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.ts?$/,
                use: [
                    { loader: 'thread-loader' },
                    { loader: 'babel-loader', options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                ["@babel/plugin-syntax-decorators", { "decoratorsBeforeExport": true }]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false
                        } },
                    { loader: 'ts-loader', options: {
                            happyPackMode: true,
                            compilerOptions: {
                                allowJs: true,
                                module: "esnext",
                                moduleResolution: "node",
                                esModuleInterop: true,
                                experimentalDecorators: true,
                                lib: [
                                    "es6",
                                    "dom",
                                    "es2017"
                                ],
                                allowSyntheticDefaultImports: true,
                                baseUrl: ".",
                                paths: {
                                    "@/*": [
                                        "src/*"
                                    ]
                                }
                            }
                        } },
                    { loader: path_1.default.resolve(__dirname, '../loader/magic-comment/index.js'), options: { type: 'ts' } },
                ],
                exclude: /node_modules/,
            },
            // {
            //   test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
            //   type:'asset',
            //   parser:{
            //     dataUrlCondition:{
            //       maxSize: 6 * 1024
            //     }
            //   }
            // },
            // {
            //   test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
            //   dependency: { not: ['url'] },
            //   use:[
            //     {
            //       loader:'url-loader',
            //       options: {
            //         limit: 8192,
            //       }
            //     }
            //   ],
            //   type: 'javascript/auto'
            // },
            {
                test: /\.(ttf|woff2?|map4|map3|avi|svg)(\?.*)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'resource/media/[hash][ext][query]'
                }
            },
        ],
    },
    plugins: [
        new webpack_1.default.ProvidePlugin({
            'aosTheme': ['aos_theme', 'default'],
            'aosApi': ['aos_api', 'default']
        }),
        new eslint_webpack_plugin_1.default({
            context: path_1.default.resolve(rootPath, `${relativePath}src`),
            exclude: 'node_modules',
            extensions: ['js', 'ts'].concat(eslintConfig.extensions || []),
            cache: true,
            cacheLocation: path_1.default.resolve(rootPath, `${relativePath}node_modules/.cache/.eslintcache`),
            threads: threads,
            fix: true,
            overrideConfig: eslintConfig.config(provide_1.default)
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path_1.default.resolve(rootPath, `${relativePath}public`),
                    to: path_1.default.resolve(rootPath, `${relativePath}dist`),
                    filter: (resourcePath) => __awaiter(void 0, void 0, void 0, function* () {
                        return resourcePath.replace(path_1.default.resolve(rootPath, `${relativePath}public`).split('\\').join('/'), '') !== '/index.html';
                    }),
                    transform: (content, path) => {
                        let transContent = content;
                        if (path.indexOf('config.js') >= 0) {
                            transContent = content.toString().replace(/\[runenv\]/g, process.env.RUN_ENV || 'develop');
                        }
                        return transContent;
                    }
                    // globOptions:{
                    //   ignore:[
                    //     "**/index.html"
                    //   ]
                    // }
                }
            ]
        }),
        new html_webpack_plugin_1.default({
            title: 'AOS',
            filename: path_1.default.resolve(rootPath, `${relativePath}dist/index.html`),
            template: path_1.default.resolve(rootPath, `${relativePath}public/index.html`),
            publicPath: process.env.AOS_MODE === 'DEV' ? '' : process.env.PUBLIC_PATH,
            templateParameters: { BASE_URL: process.env.AOS_MODE === 'DEV' ? '' : process.env.PUBLIC_PATH }
        }),
        new fork_ts_checker_webpack_plugin_1.default(),
        new webpack_1.default.DefinePlugin({
            'process.env.platform': `'${process.env.NODE_ENV}'`,
            'process.env.runenv': `'${process.env.RUN_ENV}'`,
            'process.env.device': `'${process.env.DEVICE_ENV}'`
        })
        // new WebpackApiDefine()
        // new WebpackLibPack({
        //   dir:'12345'
        // })
    ]
};
exports.default = (0, webpack_merge_1.default)(config, extrnal_webpack_config);
