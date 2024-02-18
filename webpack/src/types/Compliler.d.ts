//webpack编译上下文
type Compilation = {
  assets:any
  getStats:()=>any
}

//钩子方法
type HookMethod = {
  tap:(pluginName:string,callback:(compilation?:Compilation | Compiler,callback?:()=>void)=>any)=> void,
  tapAsync:(pluginName:string,callback:(compilation?:Compilation | Compiler,param:any,callback?:()=>void)=>any)=> void,
}

// 钩子定义
type Hook = {
  run:HookMethod,
  beforeRun:HookMethod,
  beforeCompile:HookMethod,
  watchRun:HookMethod,
  emit:HookMethod
  done:HookMethod,
  assetEmitted:{tap:(pluginName:string,callback:(file:any)=>void)=>void}
  normalModuleFactory:HookMethod
  contextModuleFactory:HookMethod
  contextModuleFiles:{tap:(pluginName:string,callback:(fileNames:string[])=>void)=>void}
  compilation:HookMethod
}

// webpack编译对象
type Compiler = {
  hooks:Hook
}