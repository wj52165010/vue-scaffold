//vue2.7项目配置
import path from 'path'
import webpack from 'webpack'
import {VueLoaderPlugin} from 'vue-loader'
import webpack_merge from 'webpack-merge'
import css from './vue.css'

const config:webpack.Configuration = {
  devtool: 'inline-source-map',
  module:{
    rules:[
      {
        test:/\.vue$/,
        use:[
          {loader:'vue-loader'},
          {loader:path.resolve(__dirname,'../loader/magic-comment/index.js'),options:{type:'vue'}}
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        type:'asset',
        parser:{
          dataUrlCondition:{
            maxSize: 6 * 1024
          }
        }
      }
    ]
  },
  resolve: {
    alias:{
      vue$:"vue/dist/vue.esm.js"
    },
    extensions: ['vue','ts'],
  },
  plugins:[
    new VueLoaderPlugin() as any
  ]
}

export default  webpack_merge(config,css)