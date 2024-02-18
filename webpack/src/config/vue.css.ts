//样式配置
import webpack_chain from 'webpack-chain'
import {merge_css} from './css.base'
const config = new webpack_chain()

config.module
        .rule('vue-normarl')
          .test(/\.css$/i)
          .use('vue-style-loader')
            .loader('vue-style-loader')
            .end()
        .end()
        .rule('less-normarl')
          .test(/\.less$/i)
          .exclude
            .add(/\.module\.less$/i)
            .end()
          .use('vue-style-loader')
            .loader('vue-style-loader')
            .end()
        .end()
        .rule('less-module')
          .test(/\.module\.less$/i)
          .use('vue-style-loader')
            .loader('vue-style-loader')
            .end()
          .use('style-loader')
            .loader('style-loader')
            .end()
          .use('css-loader')
            .loader('css-loader')
            .options({
              modules:true
            })
            .end()
        .end()

merge_css('vue-normarl',['mini-css-extract-normal','css-normal','postcss-normal'],config)
merge_css('less-normarl',['mini-css-extract-normal','css-normal','postcss-normal','less-normal'],config)
merge_css('less-module',['postcss-normal','less-normal'],config)

export default  config.toConfig()