//node环境变量声明

declare namespace NodeJS {
  interface Process{
    env:{
      [x:string]: any,
      AOS_MODE:string,                                                                //当前执行环境 DEV | PRODUCTION
      AOS_FONTFRAME:'vue3' | 'vue2.7',                                                //当前使用的前端框架
      SDK_NAME:string,                                                                //SDK打包后暴露的对象
      SDK_REMOTE_URL:string,                                                          //SDK远程访问地址
      PUBLIC_PATH:string,                                                             //公共路径
      THEME_DIR_NAME:string,                                                          //主题目录名字
      THEME_FILE_NAMES:string,                                                        //主题文件名数组
      THEME_FILE_SUFFIX:string,                                                       //主题文件后缀
      MAGIC_COMMENT:string,                                                           //魔法注释   
      NODE_ENV:string                                                                 //Node环境        
      RUN_ENV:string                                                                  //项目运行环境(develop/standard)           
    }
  }
  
}