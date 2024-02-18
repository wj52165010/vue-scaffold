// SDK目录(打包后单独包裹项目代码目录)
import {mapValues,filter,map,isBoolean} from 'lodash'
import {RegisterCallback} from './callback'
const sdkDir = 'aos-lib'

// 获取html引用中SDK的基地址
const getSDKBaseUrl = (id:string) => {
  const sdkScript =  map(filter(document.getElementsByTagName('script') || [],dom=>(dom.getAttribute('src')! || '').indexOf(`${id}.js`)>=0),dom=>dom.getAttribute('src'))

  return {
    path:sdkScript[0],
    baseUrl:(sdkScript[0] || '').slice(0,sdkScript[0]?.indexOf(`${id}.js`)),
    search:(sdkScript[0] || '').slice(sdkScript[0]?.indexOf(`?`))
  }
}

export const init = (param={selector:'',callback:{},btns:{},routerParam:{},projectBaseUrl:'',sdkScriptId:''}) => {
  const {selector,callback,projectBaseUrl,sdkScriptId,btns,routerParam={btns:null},...rest} = param
  const dom = document.querySelector(selector);

  const iframe = document.createElement('iframe');

  const sdkInfo = getSDKBaseUrl(sdkScriptId);

  const baseUrl = projectBaseUrl || sdkInfo.baseUrl;

  iframe.src = `${baseUrl || './'}${sdkDir}/index.html${sdkInfo.search ? `?${sdkInfo.search}`: ''}`;
  iframe.style.width='100%';
  iframe.style.height='100%';
  iframe.style.border='none';
  iframe.setAttribute('allow','geolocation; microphone; camera; midi; encrypted-media')
  dom!.appendChild(iframe);

  const CallBackIns = RegisterCallback(callback,((routerParam) as any).btns,iframe)

  iframe.onload = function(){
    iframe!.contentWindow!.postMessage({
      ...(rest || {}),
      sdkInfo,
      ...{
        routerParam:{
          ...(routerParam || {}),
          ...((routerParam) as any).btns ? {btns:mapValues(((routerParam) as any).btns || {},(item:any)=>(mapValues(item,(val)=>({
            callback:isBoolean(val)? false : !!val.callback,
            param:val.param,
            blnShow:isBoolean(val)? val : val.blnShow,
            name:val.name,
            type:val.type
          }
        ))))} : {}
        }
      },
      ...{
          callback:mapValues(callback || {},(item:any)=>(mapValues(item,(val)=>({
            callback:isBoolean(val)? false : !!val.callback,
            param:val.param,
            blnShow:isBoolean(val)? val : val.blnShow,
            name:val.name,
            type:val.type
          }
        ))))
      },
      baseUrl:`${baseUrl || './'}`+sdkDir
    },'*')
    window.onmessage=(param)=>{
      const { data } = param;

      switch(data.type){
        case 'callback':
          CallBackIns(data.name,data.param)
          break
        case 'open':
          window.open(data.url,'*')
          break
      }
    }

    // window.addEventListener('message',(param)=>{
    //   const { data } = param;

    //   switch(data.type){
    //     case 'callback':
    //       CallBackIns(data.name,data.param)
    //       break
    //   }

    // },false)
  }
}