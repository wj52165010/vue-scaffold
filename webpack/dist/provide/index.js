"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const rootPath = process.cwd();
const relativePath = './';
exports.default = {
    "@": path_1.default.resolve(rootPath, `${relativePath}src`)
};
