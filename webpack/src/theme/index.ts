import fs from 'fs'
import path from 'path'
import {writeFile} from '@aos-cli/utils'

process.env.THEME_FILE_SUFFIX = '.var'
process.env.THEME_DIR_NAME = 'theme'

const rootPath = process.cwd()
const relativePath = './'
const projectPath = path.resolve(rootPath,`${relativePath}src`).split(path.sep).join('/') //转换文件路径变成项目路径


export default {
  //注册主题
  register(libNameBySuffix:string){
    //注入全局操作变量
    const themeFilesNames = this.getFileNames().split(',')
    const libName = libNameBySuffix.replace('.js','')

    const themeStr = `
    const themes = {};

    export default {
      switch:(themeName)=>{

        const themeElement = document.querySelector("#aos_theme");
        if (themeElement) {
          themeElement.remove();
        }

        if (themes[themeName]) {
          document.head.appendChild(themes[themeName]);
      
          return;
        }

        switch(themeName){
          ${themeFilesNames.map(name=>{
            return `case "${name}":
                      import(/* webpackChunkName: "${name}${libName?`-${libName}`:''}" */ "${projectPath}/${process.env.THEME_DIR_NAME}/index.less?${name}").then(()=>{
                        themes[themeName] = document.querySelector("#aos_theme");
                      })
                      break;
                  `
          }).join(' ')}
        }
    }}`
    writeFile(path.resolve(__dirname,'../provide/theme.js'),themeStr,(err:any)=>{
      if (err) throw err;
      console.log('The file has been saved!');
    })
  },
  //获取主题文件名
  getFileNames(){
    const fileSuffix = `${process.env.THEME_FILE_SUFFIX}.less`
    const files = fs.readdirSync(path.resolve(rootPath,`${relativePath}src/${process.env.THEME_DIR_NAME}`))
    const themeFiles = files.filter(f=>f.indexOf(fileSuffix)>=0).map(f=>f.replace(fileSuffix,''))
    
    process.env.THEME_FILE_NAMES = themeFiles.join(',')
    return process.env.THEME_FILE_NAMES
  },
  //设置主题切换ts声明文件
  setTsTypes(){
    const themeNames = this.getFileNames().split(',')
    const dirPath = path.resolve(rootPath,`${relativePath}node_modules/@types/aos`)

    if(!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath,{recursive:true})
    }

    
    const themeTsStr = `
      declare const aosTheme:{
        switch:(param:${themeNames.map(name=>'"'+name+'"').join('|')})=>void
      }
    `

    writeFile(`${dirPath}/theme.d.ts`,themeTsStr)

    const packageStr = `
      {
        "name": "@types/aos",
        "version": "1.0.0",
        "description": "TypeScript definitions for aos-webpack",
        "main": "",
        "types": "theme.d.ts",
        "scripts": {},
        "typeScriptVersion": "3.6"
      }
    `

    writeFile(`${dirPath}/package.json`,packageStr)
  }
}