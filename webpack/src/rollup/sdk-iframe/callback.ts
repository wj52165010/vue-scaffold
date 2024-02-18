// SDK项目回调
import {get,mapValues,isBoolean,merge,map,compact} from 'lodash'
// 暂存回调函数(全局)
let CALLBACK = {}

export const RegisterCallback = (callback:{[x:string]:any},oneCallback:{[x:string]:any},iframe:HTMLIFrameElement) => {
  CALLBACK = merge(callback,oneCallback)

  return (callbackName:string,param?:{[x:string]:any}) => {
    const {blnOnce,...rest} = (param || {})

    const callback = (compact(map(callbackName.split(','),cn=>get( CALLBACK || {},cn)))[0] || {}).callback //(get( CALLBACK || {},callbackName) || {}).callback

    if(callback){

      callback({
        rest,
        router:{
          push:(param:any)=>{
            if(param.param && param.param.btns){
              CALLBACK =merge(CALLBACK,param.param.btns)
              param.param.btns = mapValues(param.param.btns || {},(item:any)=>(mapValues(item,(val)=>({
                  callback:isBoolean(val)? false : !!val.callback,
                  param:val.param,
                  blnShow:isBoolean(val)? val : val.blnShow,
                  name:val.name,
                  type:val.type
                }
              ))))
            }

            iframe!.contentWindow!.postMessage({
              type:'page-router',
              ...param
            },'*')
          }
        }
      })
    }
  }
}