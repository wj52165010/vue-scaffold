"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//开发服务
const path_1 = __importDefault(require("path"));
const utils_1 = require("@aos-cli/utils");
const rootPath = process.cwd();
const relativePath = './';
//外部配置文件名
const external_config_name = 'aos.config.ts';
const external_config_path = path_1.default.resolve(rootPath, `${relativePath}${external_config_name}`);
const extrnal_config = (0, utils_1.existsSync)(external_config_path) ? require(external_config_path) : {};
const config = {
    port: extrnal_config.devServer ? extrnal_config.devServer.port || 9000 : 9000,
    https: extrnal_config.devServer ? extrnal_config.devServer.https || false : false,
    compress: true,
    historyApiFallback: true,
    open: false,
    static: {
        directory: path_1.default.resolve(rootPath, `${relativePath}dist`),
        watch: true
    },
    client: {
        logging: 'none',
        progress: true,
        overlay: true
    },
    hot: true,
    proxy: extrnal_config.devServer ? extrnal_config.devServer.proxy : {}
};
exports.default = config;
