"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//基础插件配置
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const config = new webpack_chain_1.default();
// if(process.env.AOS_MODE !== 'DEV'){ //生产环境进行css提取
config
    .plugin('mini-css-extract-plugin')
    .use(mini_css_extract_plugin_1.default, [{ filename: "[name].css", chunkFilename: (pathdata) => {
            if (process.env.AOS_MODE === 'LIB')
                return '[name].css';
            return `${pathdata.chunk.id.indexOf('-') >= 0 ? `${Array.from(pathdata.chunk._groups)[0].origins[0].request}` : `${pathdata.chunk.id}.css`}`;
        }, attributes: { id: 'aos_theme' } }]);
// }
exports.default = config.toConfig();
