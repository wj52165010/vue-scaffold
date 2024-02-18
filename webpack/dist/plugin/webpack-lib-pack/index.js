"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// webpack打包库(引用lib中未引用的JS/CSS)
const ConcatSource = require("webpack-sources").ConcatSource;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pluginName = 'MagicComment';
class MagicCommentPlugin {
    constructor(options = { dir: '' }) {
        console.log(1111, options);
    }
    apply(compiler) {
        if (process.env.AOS_MODE === 'LIB')
            return;
        let blnCompiled = false;
        compiler.hooks.beforeRun.tapAsync(pluginName, (cp, callback) => {
            cp.hooks.normalModuleFactory.tap(`${pluginName}-normalModuleFactory`, (normalModuleFactory) => {
                normalModuleFactory.hooks.parser.for('javascript/auto').tap('js', (parser) => {
                    parser.hooks.import.tap('MyPlugin', () => {
                        blnCompiled = true;
                    });
                });
            });
            callback();
        });
        compiler.hooks.compilation.tap('compilation', (compilation) => {
            compilation.hooks.processAssets.tapAsync('optimizeChunkAssets', (chunks, done) => {
                const external_config_path = path_1.default.resolve(process.cwd(), `./mylib/images/26bd867dd65e26dbc77d.png`);
                if (blnCompiled) {
                    !compilation.assets['images/26bd867dd65e26dbc77d.png'] &&
                        (compilation.assets['images/26bd867dd65e26dbc77d.png'] = new ConcatSource(fs_1.default.readFileSync(external_config_path, { encoding: 'utf-8' })));
                }
                // (((<Compilation>compilation).assets as any)['images/26bd867dd65e26dbc77d.png']=new ConcatSource(fs.readFileSync(external_config_path,{encoding:'utf-8'})))
                done();
            });
        });
    }
}
exports.default = MagicCommentPlugin;
