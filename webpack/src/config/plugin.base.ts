//基础插件配置
import webpack_chain from 'webpack-chain'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
const config = new webpack_chain()

// if(process.env.AOS_MODE !== 'DEV'){ //生产环境进行css提取

  config
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin,[{filename:"[name].css",chunkFilename:(pathdata:any)=>{
      if(process.env.AOS_MODE === 'LIB') return '[name].css'
  
      return `${pathdata.chunk.id.indexOf('-')>=0 ? `${(Array.from(pathdata.chunk._groups)[0] as any).origins[0].request}` : `${pathdata.chunk.id}.css`}`
    },attributes:{id:'aos_theme'}}])
// }

export default config.toConfig()
