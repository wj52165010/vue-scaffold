import webpack_chain from 'webpack-chain';
declare const config: webpack_chain;
type RuleNames = 'css-normal' | 'less-normal' | 'postcss-normal' | 'mini-css-extract-normal';
export declare const merge_css: (targetRuleName: string, sourceRuleNames: RuleNames[], targetConfig: webpack_chain) => webpack_chain;
export default config;
