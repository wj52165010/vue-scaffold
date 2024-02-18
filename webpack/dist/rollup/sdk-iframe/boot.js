"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
// SDK目录(打包后单独包裹项目代码目录)
const lodash_1 = require("lodash");
const callback_1 = require("./callback");
const sdkDir = 'aos-lib';
// 获取html引用中SDK的基地址
const getSDKBaseUrl = (id) => {
    var _a, _b;
    const sdkScript = (0, lodash_1.map)((0, lodash_1.filter)(document.getElementsByTagName('script') || [], dom => (dom.getAttribute('src') || '').indexOf(`${id}.js`) >= 0), dom => dom.getAttribute('src'));
    return {
        path: sdkScript[0],
        baseUrl: (sdkScript[0] || '').slice(0, (_a = sdkScript[0]) === null || _a === void 0 ? void 0 : _a.indexOf(`${id}.js`)),
        search: (sdkScript[0] || '').slice((_b = sdkScript[0]) === null || _b === void 0 ? void 0 : _b.indexOf(`?`))
    };
};
const init = (param = { selector: '', callback: {}, btns: {}, routerParam: {}, projectBaseUrl: '', sdkScriptId: '' }) => {
    const { selector, callback, projectBaseUrl, sdkScriptId, btns, routerParam = { btns: null } } = param, rest = __rest(param, ["selector", "callback", "projectBaseUrl", "sdkScriptId", "btns", "routerParam"]);
    const dom = document.querySelector(selector);
    const iframe = document.createElement('iframe');
    const sdkInfo = getSDKBaseUrl(sdkScriptId);
    const baseUrl = projectBaseUrl || sdkInfo.baseUrl;
    iframe.src = `${baseUrl || './'}${sdkDir}/index.html${sdkInfo.search ? `?${sdkInfo.search}` : ''}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allow', 'geolocation; microphone; camera; midi; encrypted-media');
    dom.appendChild(iframe);
    const CallBackIns = (0, callback_1.RegisterCallback)(callback, (routerParam).btns, iframe);
    iframe.onload = function () {
        iframe.contentWindow.postMessage(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (rest || {})), { sdkInfo }), {
            routerParam: Object.assign(Object.assign({}, (routerParam || {})), (routerParam).btns ? { btns: (0, lodash_1.mapValues)((routerParam).btns || {}, (item) => ((0, lodash_1.mapValues)(item, (val) => ({
                    callback: (0, lodash_1.isBoolean)(val) ? false : !!val.callback,
                    param: val.param,
                    blnShow: (0, lodash_1.isBoolean)(val) ? val : val.blnShow,
                    name: val.name,
                    type: val.type
                })))) } : {})
        }), {
            callback: (0, lodash_1.mapValues)(callback || {}, (item) => ((0, lodash_1.mapValues)(item, (val) => ({
                callback: (0, lodash_1.isBoolean)(val) ? false : !!val.callback,
                param: val.param,
                blnShow: (0, lodash_1.isBoolean)(val) ? val : val.blnShow,
                name: val.name,
                type: val.type
            }))))
        }), { baseUrl: `${baseUrl || './'}` + sdkDir }), '*');
        window.onmessage = (param) => {
            const { data } = param;
            switch (data.type) {
                case 'callback':
                    CallBackIns(data.name, data.param);
                    break;
                case 'open':
                    window.open(data.url, '*');
                    break;
            }
        };
        // window.addEventListener('message',(param)=>{
        //   const { data } = param;
        //   switch(data.type){
        //     case 'callback':
        //       CallBackIns(data.name,data.param)
        //       break
        //   }
        // },false)
    };
};
exports.init = init;
