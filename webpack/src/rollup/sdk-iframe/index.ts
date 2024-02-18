// SDK-IFRAME 打包
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import { babel } from '@rollup/plugin-babel';
import {writeFile} from '@aos-cli/utils'
import {rollup} from 'rollup'
import path from 'path'

const inputOptions = {
    input:[path.join(__dirname,'./iframe.js')],
    plugins:[
      commonjs(),
      babel({ babelHelpers: 'bundled' }),
      resolve(),
      terser()
    ]
}


export const build = () => {
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

    const remoteUrl = (process.env.SDK_REMOTE_URL || '').replace(/\[runenv\]/g,process.env.RUN_ENV || 'develop')

    const sdkId = process.env.SDK_NAME || 'Aos'

    const iframeStr = `
      import {init as bootInit} from './boot';

      const init = (param={selector:'',callback:{},projectBaseUrl:''})=>{
        
        return bootInit({...param,sdkScriptId:'${sdkId}',projectBaseUrl:param.projectBaseUrl || '${remoteUrl === 'undefined' ? '' : remoteUrl}'})
      };
      
      export {init};
    `

    writeFile(path.resolve(__dirname,`../../../dist/rollup/sdk-iframe/iframe.js`),iframeStr,(err:any)=>{
        if (err) throw err;
        console.log('SDK build complete!');
    })


    rollup(inputOptions).then(bundle=>bundle.write({name:sdkId,file:`iframe-dist/${sdkId}.js`,format:'umd'}))
}