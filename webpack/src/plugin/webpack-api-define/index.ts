// 自助API服务自动生成声明文件
import {parse} from '@babel/parser'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
const pluginName = 'AutoApiDefine'
//匹配api文件正则表达式
const reg = /\.h\.ts$/

class AutoApiDefinePlugin { 
  apply(compiler:Compiler){
    (<Compiler>compiler).hooks.watchRun.tap(pluginName,(compiler:any)=>{
      (<Compiler>compiler).hooks.normalModuleFactory.tap('normalModuleFactory',(normalModuleFactory:any)=>{
        normalModuleFactory.hooks.afterResolve.tapAsync('afterResolve',(data:any,callback:any)=>{

          if(reg.test(data.request)){
            const {context,request} = data

            const ast:any = parse(fs.readFileSync(path.join(context,request),'utf8') as any,{
              sourceType:"module",
              plugins:[
                "typescript"
              ]
            })
            // console.log(data.createData.resourceResolveData.context)
            // console.log(ast.program.body[2].declaration.properties[0].argument.arguments)
          }
          callback()
        })
      })
    })
  }
}

export default AutoApiDefinePlugin