"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copySync = exports.removeSync = exports.writeFile = exports.existsSync = exports.getLocalIP = exports.chalk = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.chalk = chalk_1.default;
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
let localIP = '';
function getLocalIP() {
    var _a;
    if (!localIP) {
        localIP = 'localhost';
        const interfaces = os_1.default.networkInterfaces();
        for (const devName in interfaces) {
            const isEnd = (_a = interfaces[devName]) === null || _a === void 0 ? void 0 : _a.some((item) => {
                if (item.family === 'IPv4' &&
                    item.address !== '127.0.0.1' &&
                    !item.internal) {
                    localIP = item.address;
                    return true;
                }
                return false;
            });
            if (isEnd) {
                break;
            }
        }
    }
    return localIP;
}
exports.getLocalIP = getLocalIP;
const existsSync = fs_extra_1.default.existsSync;
exports.existsSync = existsSync;
const writeFile = fs_extra_1.default.writeFile;
exports.writeFile = writeFile;
const removeSync = fs_extra_1.default.removeSync;
exports.removeSync = removeSync;
const copySync = fs_extra_1.default.copySync;
exports.copySync = copySync;
