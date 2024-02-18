// webpack打包SDK(已Iframe方式，防止引用冲突)
import path from 'path'
import {build} from '../../rollup/sdk-iframe'
import {removeSync,copySync} from '@aos-cli/utils'
const pluginName = 'IFramePlugin'

const rootPath = process.cwd()
const relativePath = './'


class IFramePlugin {
    apply(compiler:Compiler){
      const sdkId = process.env.SDK_NAME || 'Aos'
      
      compiler.hooks.done.tapAsync(`${pluginName}-done`,(cp,callback)=>{
          // SDK目录
          const sdkDir = 'aos-lib'

          // 删除老代码
          removeSync(path.resolve(rootPath,`${relativePath}iframe-dist`))

          // 复制代码
          copySync(path.resolve(rootPath,`${relativePath}dist`),path.resolve(rootPath,`${relativePath}iframe-dist/${sdkDir}`))

          // 复制SDK声明文件
          copySync(path.resolve(rootPath,`${relativePath}iframe.d.ts`),path.resolve(rootPath,`${relativePath}iframe-dist/${sdkId}.d.ts`))

          // rollup构建
          build()

          callback()
      })
    }
}

export default IFramePlugin