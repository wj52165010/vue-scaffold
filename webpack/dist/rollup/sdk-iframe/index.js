"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
// SDK-IFRAME 打包
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const plugin_babel_1 = require("@rollup/plugin-babel");
const utils_1 = require("@aos-cli/utils");
const rollup_1 = require("rollup");
const path_1 = __importDefault(require("path"));
const inputOptions = {
    input: [path_1.default.join(__dirname, './iframe.js')],
    plugins: [
        (0, plugin_commonjs_1.default)(),
        (0, plugin_babel_1.babel)({ babelHelpers: 'bundled' }),
        (0, plugin_node_resolve_1.default)(),
        (0, rollup_plugin_terser_1.terser)()
    ]
};
const build = () => {
    // // SDK目录
    // const sdkDir = 'aos-lib'
    // // 写入SDK启动代码
    // const iframeStr = `
    //     export const init = (param={}) => {
    //         const {selector,...rest} = param
    //         const dom = document.querySelector(selector);
    //         var iframe = document.createElement('iframe');
    //         iframe.src = './${sdkDir}/index.html';
    //         iframe.style.width='100%';
    //         iframe.style.height='100%';
    //         iframe.style.border='none';
    //         dom.appendChild(iframe);
    //         iframe.onload = function(){
    //             iframe.contentWindow.postMessage(rest || {})
    //         }
    //     }
    // `
    const remoteUrl = (process.env.SDK_REMOTE_URL || '').replace(/\[runenv\]/g, process.env.RUN_ENV || 'develop');
    const sdkId = process.env.SDK_NAME || 'Aos';
    const iframeStr = `
      import {init as bootInit} from './boot';

      const init = (param={selector:'',callback:{},projectBaseUrl:''})=>{
        
        return bootInit({...param,sdkScriptId:'${sdkId}',projectBaseUrl:param.projectBaseUrl || '${remoteUrl === 'undefined' ? '' : remoteUrl}'})
      };
      
      export {init};
    `;
    (0, utils_1.writeFile)(path_1.default.resolve(__dirname, `../../../dist/rollup/sdk-iframe/iframe.js`), iframeStr, (err) => {
        if (err)
            throw err;
        console.log('SDK build complete!');
    });
    (0, rollup_1.rollup)(inputOptions).then(bundle => bundle.write({ name: sdkId, file: `iframe-dist/${sdkId}.js`, format: 'umd' }));
};
exports.build = build;
