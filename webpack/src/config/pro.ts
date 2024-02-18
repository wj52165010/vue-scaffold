//打包配置pro
import webpack from 'webpack'
import webpack_merge from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import plugin from './plugin.base'
import { CleanPlugin } from 'webpack'
import os from 'os'

const threads = os.cpus().length

const config:webpack.Configuration = {
  mode:'production',
  devtool:'source-map',
  optimization:{
    chunkIds:'named',
    minimize:true,
    minimizer:[
      new CssMinimizerPlugin({
        parallel:threads
      }),
      new TerserPlugin({
        parallel:threads,
        terserOptions: {
          mangle: false
        }
      })
    ],
    splitChunks:({
      cacheGroups:{
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
  },
  plugins:[
    new webpack.ProgressPlugin({
      activeModules: true,         // 默认false，显示活动模块计数和一个活动模块正在进行消息。
      entries: true,  			       // 默认true，显示正在进行的条目计数消息。
      modules: false,              // 默认true，显示正在进行的模块计数消息。
      modulesCount: 5000,          // 默认5000，开始时的最小模块数。PS:modules启用属性时生效。
      profile: false,         	   // 默认false，告诉ProgressPlugin为进度步骤收集配置文件数据。
      dependencies: false,         // 默认true，显示正在进行的依赖项计数消息。
      dependenciesCount: 10000,    // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
    }),
    new CleanPlugin()
  ]
}

export default webpack_merge(config,plugin)