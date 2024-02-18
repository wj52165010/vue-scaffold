"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 自助API服务自动生成声明文件
const parser_1 = require("@babel/parser");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pluginName = 'AutoApiDefine';
//匹配api文件正则表达式
const reg = /\.h\.ts$/;
class AutoApiDefinePlugin {
    apply(compiler) {
        compiler.hooks.watchRun.tap(pluginName, (compiler) => {
            compiler.hooks.normalModuleFactory.tap('normalModuleFactory', (normalModuleFactory) => {
                normalModuleFactory.hooks.afterResolve.tapAsync('afterResolve', (data, callback) => {
                    if (reg.test(data.request)) {
                        const { context, request } = data;
                        const ast = (0, parser_1.parse)(fs_1.default.readFileSync(path_1.default.join(context, request), 'utf8'), {
                            sourceType: "module",
                            plugins: [
                                "typescript"
                            ]
                        });
                        // console.log(data.createData.resourceResolveData.context)
                        // console.log(ast.program.body[2].declaration.properties[0].argument.arguments)
                    }
                    callback();
                });
            });
        });
    }
}
exports.default = AutoApiDefinePlugin;
