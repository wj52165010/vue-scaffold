/// <reference types="node" />
import chalk from 'chalk';
import fs from 'fs-extra';
declare function getLocalIP(): string;
declare const existsSync: typeof fs.existsSync;
declare const writeFile: typeof fs.writeFile;
declare const removeSync: typeof fs.removeSync;
declare const copySync: typeof fs.copySync;
export { chalk, getLocalIP, existsSync, writeFile, removeSync, copySync };
