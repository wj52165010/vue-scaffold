// webpack打包库(引用lib中未引用的JS/CSS)
const ConcatSource = require("webpack-sources").ConcatSource
import path from 'path'
import fs from 'fs'
const pluginName = 'MagicComment'

class MagicCommentPlugin {
  constructor(options:{dir:string} = {dir:''}){
    console.log(1111,options)
  }
  apply(compiler:Compiler){
    if(process.env.AOS_MODE === 'LIB') return
    
    let blnCompiled = false
    compiler.hooks.beforeRun.tapAsync(pluginName,(cp,callback)=>{

      (<Compiler>cp).hooks.normalModuleFactory.tap(`${pluginName}-normalModuleFactory`,(normalModuleFactory:any)=>{

        normalModuleFactory.hooks.parser.for('javascript/auto').tap('js',(parser:any)=>{
          parser.hooks.import.tap('MyPlugin', () => {
            blnCompiled=true
          });
        })
        
        
      })
      callback!()
    })

    compiler.hooks.compilation.tap('compilation',(compilation:any)=>{
      compilation.hooks.processAssets.tapAsync('optimizeChunkAssets', (chunks:any, done:any) => {

        const external_config_path = path.resolve(process.cwd(),`./mylib/images/26bd867dd65e26dbc77d.png`);

        if(blnCompiled){
          !((<Compilation>compilation).assets as any)['images/26bd867dd65e26dbc77d.png'] &&
          (((<Compilation>compilation).assets as any)['images/26bd867dd65e26dbc77d.png']=new ConcatSource(fs.readFileSync(external_config_path,{encoding:'utf-8'})))
        }
        // (((<Compilation>compilation).assets as any)['images/26bd867dd65e26dbc77d.png']=new ConcatSource(fs.readFileSync(external_config_path,{encoding:'utf-8'})))
 
        done()
      })
      
    })
  }
}


export default MagicCommentPlugin