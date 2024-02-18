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
exports.RegisterCallback = void 0;
// SDK项目回调
const lodash_1 = require("lodash");
// 暂存回调函数(全局)
let CALLBACK = {};
const RegisterCallback = (callback, oneCallback, iframe) => {
    CALLBACK = (0, lodash_1.merge)(callback, oneCallback);
    return (callbackName, param) => {
        const _a = (param || {}), { blnOnce } = _a, rest = __rest(_a, ["blnOnce"]);
        const callback = ((0, lodash_1.compact)((0, lodash_1.map)(callbackName.split(','), cn => (0, lodash_1.get)(CALLBACK || {}, cn)))[0] || {}).callback; //(get( CALLBACK || {},callbackName) || {}).callback
        if (callback) {
            callback({
                rest,
                router: {
                    push: (param) => {
                        if (param.param && param.param.btns) {
                            CALLBACK = (0, lodash_1.merge)(CALLBACK, param.param.btns);
                            param.param.btns = (0, lodash_1.mapValues)(param.param.btns || {}, (item) => ((0, lodash_1.mapValues)(item, (val) => ({
                                callback: (0, lodash_1.isBoolean)(val) ? false : !!val.callback,
                                param: val.param,
                                blnShow: (0, lodash_1.isBoolean)(val) ? val : val.blnShow,
                                name: val.name,
                                type: val.type
                            }))));
                        }
                        iframe.contentWindow.postMessage(Object.assign({ type: 'page-router' }, param), '*');
                    }
                }
            });
        }
    };
};
exports.RegisterCallback = RegisterCallback;
