"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// webpack打包SDK(已Iframe方式，防止引用冲突)
const path_1 = __importDefault(require("path"));
const sdk_iframe_1 = require("../../rollup/sdk-iframe");
const utils_1 = require("@aos-cli/utils");
const pluginName = 'IFramePlugin';
const rootPath = process.cwd();
const relativePath = './';
class IFramePlugin {
    apply(compiler) {
        const sdkId = process.env.SDK_NAME || 'Aos';
        compiler.hooks.done.tapAsync(`${pluginName}-done`, (cp, callback) => {
            // SDK目录
            const sdkDir = 'aos-lib';
            // 删除老代码
            (0, utils_1.removeSync)(path_1.default.resolve(rootPath, `${relativePath}iframe-dist`));
            // 复制代码
            (0, utils_1.copySync)(path_1.default.resolve(rootPath, `${relativePath}dist`), path_1.default.resolve(rootPath, `${relativePath}iframe-dist/${sdkDir}`));
            // 复制SDK声明文件
            (0, utils_1.copySync)(path_1.default.resolve(rootPath, `${relativePath}iframe.d.ts`), path_1.default.resolve(rootPath, `${relativePath}iframe-dist/${sdkId}.d.ts`));
            // rollup构建
            (0, sdk_iframe_1.build)();
            callback();
        });
    }
}
exports.default = IFramePlugin;
