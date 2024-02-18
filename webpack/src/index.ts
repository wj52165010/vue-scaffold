import type { WebpackPluginInstance } from 'webpack'
import Webpack from 'webpack'
import webpack_merge from 'webpack-merge'
import devConfig from './config/dev'
import proConfg from './config/pro'
import libConfig from './config/lib'
import devServerConfig from './config/devServer'
import { chalk,getLocalIP } from '@aos-cli/utils'
import { FF } from './enum'
import webpack_dev_server from 'webpack-dev-server'
import CopyPlugin from 'copy-webpack-plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import IFramePlugin from './plugin/webpack-iframe-pack'


// 开发阶段
export const dev = ({FontFrame}:{FontFrame: keyof typeof FF})=>{
  process.env.AOS_MODE = 'DEV'
  process.env.AOS_FONTFRAME = FontFrame
  const baseConfig = require('./config/base').default

  const FontFramConfig = require(`./config/${FF[FontFrame]}`).default
  const compiler = Webpack(webpack_merge(FontFramConfig,devConfig,baseConfig))

  const devServer = new webpack_dev_server(devServerConfig,compiler);
  let isFirstCompile = true

  const serverPort = devServerConfig.port
  const protocol = devServerConfig.https ? 'https' : 'http';
  const publicPath = '/';
  const localUrl = `${protocol}://localhost:${serverPort}${publicPath}`;
  const localIpUrl = `${protocol}://${getLocalIP()}:${serverPort}${publicPath}`;

  compiler.hooks.done.tap('webpack dev', (stats:any) => {
      if (stats.hasErrors()) {
          return;
      }
      if (isFirstCompile) {
          isFirstCompile = false;
          console.log(`

  ***************************************
  *                                     *
  *           ${chalk.green.bold('Welcome to Aos')}           *
  *                                     *
  ***************************************
  `);
          console.log(`🚀...${chalk.bgRedBright(' DevServer ')} running at ${chalk.green(localUrl)}`);
          console.log(`🚀...${chalk.bgRedBright(' DevServer ')} running at ${chalk.green(localIpUrl)} \n`);

      }
  });

  ['SIGINT', 'SIGTERM'].forEach((signal,) => {
      process.on(signal, () => {
          devServer.stop();
      });
  });
  devServer.start().catch(() => process.exit(1));
}

//构建阶段(项目)
export const pro = ({FontFrame}:{FontFrame: keyof typeof FF})=>{
  process.env.AOS_MODE = 'PRODUCTION'
  process.env.AOS_FONTFRAME = FontFrame
  const baseConfig = require('./config/base').default

  const FontFramConfig = require(`./config/${FF[FontFrame]}`).default

  Webpack(webpack_merge(FontFramConfig,proConfg,baseConfig),(err, stats)=>{
    if(err){
      console.log(err)
      return
    }
  })
}


//构建库(三方组件库)
export const lib = ({FontFrame}:{FontFrame: keyof typeof FF})=>{
  const filterPlugins = [CopyPlugin,ESLintWebpackPlugin,HtmlWebpackPlugin]
  process.env.AOS_MODE = 'LIB'
  process.env.AOS_FONTFRAME = FontFrame
  const baseConfig = require('./config/base').default
  baseConfig.plugins = baseConfig.plugins.filter((plugin:WebpackPluginInstance) => !filterPlugins.find(pt => plugin instanceof pt))
  baseConfig.externals= 'vue'

  const FontFramConfig = require(`./config/${FF[FontFrame]}`).default

  Webpack(webpack_merge(FontFramConfig,libConfig,baseConfig),(err)=>{
    if(err){
      console.log(err)
      return
    }
  })
}


//构建SDK
export const sdk = ({FontFrame}:{FontFrame: keyof typeof FF})=>{
  process.env.AOS_MODE = 'PRODUCTION'
  process.env.AOS_FONTFRAME = FontFrame
  const baseConfig = require('./config/base').default

  const FontFramConfig = require(`./config/${FF[FontFrame]}`).default

  Webpack(webpack_merge(FontFramConfig,proConfg,{plugins:[new IFramePlugin()]},baseConfig),(err, stats)=>{
    if(err){
      console.log(err)
      return
    }
  })
}
