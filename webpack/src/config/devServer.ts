//开发服务
import path from 'path'
import webpack_dev_server from 'webpack-dev-server'
import {existsSync} from '@aos-cli/utils'

const rootPath = process.cwd()
const relativePath = './'

//外部配置文件名
const external_config_name = 'aos.config.ts'
const external_config_path = path.resolve(rootPath,`${relativePath}${external_config_name}`)
const extrnal_config = existsSync(external_config_path) ? require(external_config_path) : {}

const config:webpack_dev_server.Configuration = {
  port: extrnal_config.devServer ? extrnal_config.devServer.port || 9000 : 9000,
  https: extrnal_config.devServer ? extrnal_config.devServer.https || false : false,
  compress:true,
  historyApiFallback:true,
  open:false,
  static:{
    directory:path.resolve(rootPath,`${relativePath}dist`),
    watch:true
  },
  client:{
    logging:'none',
    progress:true,
    overlay:true
  },
  hot:true,
  proxy:extrnal_config.devServer ? extrnal_config.devServer.proxy : {}
}

export default config
