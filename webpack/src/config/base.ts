// 基础配置
import os from 'os'
import path from 'path'
import webpack from 'webpack'
import webpack_merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import {WebpackApiDefine} from '../plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin  from 'fork-ts-checker-webpack-plugin'
import {existsSync} from '@aos-cli/utils'
import theme from '../theme'
import { FF } from '../enum'
import provide from '../provide'

const CopyPlugin = require("copy-webpack-plugin")
const eslintConfig = require(`../eslintConfig/${FF[process.env.AOS_FONTFRAME]}`).default

const threads = os.cpus().length
const rootPath = process.cwd()
const relativePath = './'


//项目自主API实例文件路径
const auto_api_path = 'auto-import/api/axios/index.ts'

//外部配置文件名
const external_config_name = 'aos.config.ts'
const external_config_path = path.resolve(rootPath,`${relativePath}${external_config_name}`)
const extrnal_config = existsSync(external_config_path) ? require(external_config_path) : {}
const {publicPath,magicComment,sdkName,sdkRemoteUrl,...extrnal_webpack_config} = extrnal_config
process.env.SDK_NAME = sdkName
process.env.SDK_REMOTE_URL = sdkRemoteUrl

//非打包库需要去除打包库配置项
if(process.env.AOS_MODE !== 'LIB'){
  delete extrnal_webpack_config.entry
  delete extrnal_webpack_config.output
  delete extrnal_webpack_config.experiments
}

// 删除开发服务阶段代理配置
if(extrnal_webpack_config.devServer){
  delete extrnal_webpack_config.devServer
}

//注入主题切换方法
theme.register(extrnal_webpack_config.output?.filename || '')

process.env.PUBLIC_PATH = publicPath || './'
process.env.MAGIC_COMMENT = JSON.stringify(magicComment)

const config:webpack.Configuration = {
  entry:{
    app:path.resolve(rootPath,`${relativePath}src/main.ts`)
  },
  output:{
    path:path.resolve(rootPath,`${relativePath}dist`),
    filename:'[name].js',
    chunkFilename:'[chunkhash].js',
    assetModuleFilename:'images/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js','.mjs','.vue'],
    alias:{
      'aos_theme':path.resolve(__dirname,'../provide/theme.js'),
      'aos_api':path.resolve(rootPath,`${relativePath}src/${auto_api_path}`),
      ...(provide as any)
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {loader:'thread-loader'},
          // {loader:path.resolve(__dirname,'../loader/magic-comment/index.js')},
          {loader:'babel-loader',options:{
            presets:['@babel/preset-env'],
            plugins:[
              ["@babel/plugin-syntax-decorators",{"decoratorsBeforeExport": true}]
            ],
            cacheDirectory:true,
            cacheCompression:false
          }}
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.ts?$/,
        use: [
          {loader:'thread-loader'},
          {loader:'babel-loader',options:{
            presets:['@babel/preset-env'],
            plugins:[
              ["@babel/plugin-syntax-decorators",{"decoratorsBeforeExport": true}]
            ],
            cacheDirectory:true,
            cacheCompression:false
          }},
          {loader:'ts-loader',options:{
            happyPackMode:true,
            compilerOptions:{
              allowJs:true,
              module: "esnext",
              moduleResolution: "node",
              esModuleInterop: true,
              experimentalDecorators: true,
              lib: [
                  "es6",
                  "dom",
                  "es2017"
              ],
              allowSyntheticDefaultImports: true,
              baseUrl: ".",
              paths: {
                "@/*": [
                  "src/*"
                ]
              }
            }
          }},
          {loader:path.resolve(__dirname,'../loader/magic-comment/index.js'),options:{type:'ts'}},
        ],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      //   type:'asset',
      //   parser:{
      //     dataUrlCondition:{
      //       maxSize: 6 * 1024
      //     }
      //   }
      // },
      // {
      //   test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      //   dependency: { not: ['url'] },
      //   use:[
      //     {
      //       loader:'url-loader',
      //       options: {
      //         limit: 8192,
      //       }
      //     }
      //   ],
      //   type: 'javascript/auto'
      // },
      {
        test: /\.(ttf|woff2?|map4|map3|avi|svg)(\?.*)?$/,
        type:'asset/resource',
        generator:{
          filename:'resource/media/[hash][ext][query]'
        }
      },
    ],
  },
  plugins:[
    new webpack.ProvidePlugin({
      'aosTheme':['aos_theme','default'],
      'aosApi':['aos_api','default']
    }),
    new ESLintWebpackPlugin({
      context:path.resolve(rootPath,`${relativePath}src`),
      exclude:'node_modules',
      extensions:['js','ts'].concat(eslintConfig.extensions || []),
      cache:true,
      cacheLocation:path.resolve(rootPath,`${relativePath}node_modules/.cache/.eslintcache`),
      threads:threads,
      fix:true,
      overrideConfig:eslintConfig.config(provide)
    }),
    new CopyPlugin({
      patterns:[
        { 
          from: path.resolve(rootPath,`${relativePath}public`), 
          to: path.resolve(rootPath,`${relativePath}dist`),
          filter:async(resourcePath:string)=>{
            return resourcePath.replace(path.resolve(rootPath,`${relativePath}public`).split('\\').join('/'),'') !== '/index.html'
          },
          transform:(content:string,path:string)=>{
            let transContent = content
            if(path.indexOf('config.js')>=0){
              transContent =content.toString().replace(/\[runenv\]/g,process.env.RUN_ENV || 'develop')

            }
            return transContent
          }
          // globOptions:{
          //   ignore:[
          //     "**/index.html"
          //   ]
          // }
        }
      ]}
    ),
    new HtmlWebpackPlugin({
      title:'AOS',
      filename:path.resolve(rootPath,`${relativePath}dist/index.html`),
      template:path.resolve(rootPath,`${relativePath}public/index.html`),
      publicPath:process.env.AOS_MODE === 'DEV' ? '' : process.env.PUBLIC_PATH,
      templateParameters:{BASE_URL:process.env.AOS_MODE === 'DEV' ? '' : process.env.PUBLIC_PATH}
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.platform':`'${process.env.NODE_ENV}'`,
      'process.env.runenv':`'${process.env.RUN_ENV}'`,
      'process.env.device':`'${process.env.DEVICE_ENV}'`
    })
    // new WebpackApiDefine()
    // new WebpackLibPack({
    //   dir:'12345'
    // })
  ]
}
export default webpack_merge(config,extrnal_webpack_config)