"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge_css = void 0;
//基础样式配置
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const enum_1 = require("../enum");
const config = new webpack_chain_1.default();
const isWin = os_1.default.type() === 'Windows_NT';
const themeFilesNames = process.env.THEME_FILE_NAMES.split(','); //主题文件名,这里后面更改成配置项
const rootPath = process.cwd();
const relativePath = './src';
const rootAbsolutePath = path_1.default.resolve(rootPath, `${relativePath}`);
//不同前端框架打包时需要去除的Loader
const FilterLoaderByPro = {
    [enum_1.FF.vue3]: ['vue-style-loader'],
    [enum_1.FF['vue2.7']]: ['vue-style-loader']
};
//不同前端框架DEV时需要去除的Loader
const DevFilterLoaderByPro = {
    [enum_1.FF.vue3]: ['style-loader'],
    [enum_1.FF['vue2.7']]: ['style-loader']
};
const cssRule = [
    {
        ruleName: 'css-normal',
        name: 'css-loader',
        loader: 'css-loader',
        options: {
            modules: false
        }
    },
    {
        ruleName: 'less-normal',
        name: 'less-loader',
        loader: 'less-loader',
        resourceQuerys: themeFilesNames,
        options: {
            additionalData: (content, loaderContext) => {
                let { resourcePath, resourceQuery } = loaderContext;
                resourcePath = resourcePath.replace(rootAbsolutePath, '');
                const level = resourcePath.split(isWin ? '\\' : '/').length - 2; //引用less文件的层级数
                const res = themeFilesNames.includes(resourceQuery.replace('?', '')) ? '@import "' + ('../'.repeat(level) || './') + `${process.env.THEME_DIR_NAME}/` + resourceQuery.replace('?', '') + '.var";' : '';
                return `${res}${content}`;
            }
        }
    },
    {
        ruleName: 'postcss-normal',
        name: 'postcss-loader',
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                require('autoprefixer')(),
                require('postcss-preset-env')()
            ]
        }
    },
    {
        ruleName: 'mini-css-extract-normal',
        name: 'extract-css-loader',
        loader: require('mini-css-extract-plugin').loader
    },
];
//过滤开发环境不必要的CssLoader(这里mini-css-extract-plugin与vue-style-loader 在开发环境不能同时存在)
const filter_loader = (ruleNames) => {
    const propRuleNames = ['mini-css-extract-normal'];
    return process.env.AOS_MODE === 'DEV' ? ruleNames.filter(rn => propRuleNames.findIndex(prn => prn === rn) < 0) : ruleNames;
};
//合并样式Loader
const merge_css = (targetRuleName, sourceRuleNames, targetConfig) => {
    const targetRuleUses = targetConfig.module.rule(targetRuleName).uses;
    filter_loader(sourceRuleNames).forEach(sourceRuleName => {
        const sourceRuleUses = config.module.rule(sourceRuleName).uses;
        const sourceRuleOneOfs = config.module.rule(sourceRuleName).oneOfs;
        //过滤打包时需要的Loader
        process.env.AOS_MODE !== 'DEV' && FilterLoaderByPro[process.env.AOS_FONTFRAME].forEach(loaderUseName => targetRuleUses.delete(loaderUseName));
        //过滤DEV时需要的Loader
        process.env.AOS_MODE === 'DEV' && DevFilterLoaderByPro[process.env.AOS_FONTFRAME].forEach(loaderUseName => targetRuleUses.delete(loaderUseName));
        sourceRuleUses.values().map(i => {
            return { 'loader': i.get('loader'), 'options': i.get('options') };
        }).forEach(bc => {
            targetConfig.module.rule(targetRuleName).use(sourceRuleName).merge(bc).end();
        });
        sourceRuleOneOfs.values().map((i) => {
            return {
                'oneOfName': i.name,
                'uses': i.uses.values(),
                'oriUsesValues': targetConfig.module.rule(targetRuleName).uses.values(),
                'oriUses': targetConfig.module.rule(targetRuleName).uses,
                'resourceQuery': i.store.get('resourceQuery')
            };
        }).forEach((bc, i) => {
            if (i === 0) {
                bc.oriUses.clear();
            }
            (bc.oriUsesValues.concat(bc.uses)).forEach((ouv) => {
                targetConfig.module
                    .rule(targetRuleName)
                    .oneOf(bc.oneOfName)
                    .resourceQuery(bc.resourceQuery)
                    .use(`${bc.oneOfName}-${ouv.name}`)
                    .merge({ 'loader': ouv.get('loader'), 'options': ouv.get('options') || {} })
                    .end();
            });
            if (i === sourceRuleOneOfs.values().length - 1) {
                (bc.oriUsesValues.concat(bc.uses)).forEach((ouv) => {
                    targetConfig.module
                        .rule(targetRuleName)
                        .oneOf(sourceRuleName)
                        .use(`${bc.oneOfName}-${ouv.name}`)
                        .merge({ 'loader': ouv.get('loader'), 'options': ouv.get('options') || {} })
                        .end();
                });
            }
        });
    });
    return targetConfig;
};
exports.merge_css = merge_css;
cssRule.forEach(rule => {
    if (rule.resourceQuerys && rule.resourceQuerys.length > 0) {
        rule.resourceQuerys.forEach(query => {
            config.module
                .rule(rule.ruleName)
                .oneOf(`${rule.name}-${query}`)
                .resourceQuery(new RegExp(`\\?${query}`))
                .use(rule.name)
                .loader(rule.loader)
                .options(rule.options || {})
                .end()
                .end();
        });
    }
    else {
        config.module
            .rule(rule.ruleName)
            .use(rule.name)
            .loader(rule.loader)
            .options(rule.options || {})
            .end()
            .end();
    }
});
exports.default = config;
