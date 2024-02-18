"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const lodash_1 = __importDefault(require("lodash"));
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
//AOS,VUE实例命名标识
const vueNameIdentity = 'vueName';
//AOS,VUE实例命名分隔符
const vueNameSeparator = ':';
//AOS魔法注释标识
const magicCommentIdentity = 'aosMethod';
//AOS魔法注释分隔符
const magicCommentSeparator = '\n';
//AOS魔法注释变量前缀
const magicCommentVariablePreix = '$';
//AOS魔法注释函数内部参数分割符
const magicCommentMethodInnerSeparator = '::';
//AOS魔法注释函数分隔符
const magicCommentMethodSeparator = '|';
//AOS配置魔法注释插件
const magicCommentPlugin = JSON.parse(process.env.MAGIC_COMMENT);
//获取魔法注释
const getMagicComments = (comments = [], blnRemove = false) => {
    const blockComments = lodash_1.default.filter(comments, comment => comment.type === 'CommentBlock' && comment.value.indexOf(`${magicCommentIdentity}:`) >= 0);
    if (blnRemove) {
        comments.splice(0, comments.length);
    }
    return lodash_1.default.map(blockComments, comment => comment.value.slice(comment.value.indexOf(magicCommentIdentity), comment.value.lastIndexOf('"') + 1));
};
module.exports = function (content) {
    const fileType = this.getOptions().type; //处理文件类型                   
    const importArr = {};
    const oriContent = content;
    const scriptStartIndex = content.indexOf('<script');
    const scriptStartLength = content.slice(scriptStartIndex).indexOf('>') + 1;
    const scriptEndIndex = content.indexOf('</script>');
    const scriptContent = fileType === 'ts' ? content : content.slice(scriptStartIndex + scriptStartLength, scriptEndIndex);
    // vue实例名称
    let vueName = '';
    const ast = (0, parser_1.parse)(scriptContent, {
        sourceType: "module",
        plugins: [
            "typescript",
            "decorators"
        ]
    });
    traverse(ast, {
        enter: (path) => {
            if (path.node.trailingComments && lodash_1.default.find(path.node.trailingComments, comment => comment.value.indexOf(`${vueNameIdentity}${vueNameSeparator}`) >= 0)) {
                const comment = lodash_1.default.find(path.node.trailingComments, comment => comment.value.indexOf(`${vueNameIdentity}${vueNameSeparator}`) >= 0);
                vueName = comment.value.replace(`${vueNameIdentity}${vueNameSeparator}`, '').replace(/^\s*(.*?)\s*$/, '$1');
            }
        },
        VariableDeclaration: (path) => {
            const blockComments = path.node.leadingComments || path.parentPath.node.leadingComments;
            const aosCommments = getMagicComments(blockComments);
            if (blockComments && aosCommments.length > 0) {
                const commentsJson = aosCommments.map(aComment => eval('({' + lodash_1.default.chain(aComment.split(magicCommentSeparator)).map(ac => lodash_1.default.trim(ac)).compact().join(',').value() + '})'));
                const commentsSet = lodash_1.default.filter(lodash_1.default.flatMapDeep(commentsJson.map(comment => {
                    const methodsStrArr = comment[magicCommentIdentity].split(magicCommentMethodSeparator);
                    return lodash_1.default.map(methodsStrArr, msa => {
                        const methodItemStrArr = msa.split(magicCommentMethodInnerSeparator);
                        return {
                            module: methodItemStrArr[0],
                            method: methodItemStrArr[1],
                            params: methodItemStrArr[2] ? lodash_1.default.isNaN(parseInt(methodItemStrArr[2])) ? methodItemStrArr[2] : parseInt(methodItemStrArr[2]) : ''
                        };
                    });
                })), item => {
                    return magicCommentPlugin[item.module] &&
                        lodash_1.default.includes(magicCommentPlugin[item.module].expose, item.method);
                });
                path.traverse({
                    ArrowFunctionExpression(arrowPath) {
                        if (getMagicComments(arrowPath.parentPath.parent.leadingComments).length <= 0)
                            return;
                        arrowPath.replaceWith(lodash_1.default.reduce(commentsSet, (node, cs) => {
                            //收集import选项
                            importArr[cs.module] = importArr[cs.module] || {};
                            importArr[cs.module][cs.method] = `${cs.module}_${cs.method}`;
                            return t.callExpression(t.identifier(`${cs.module}_${cs.method}`), [
                                node,
                                lodash_1.default.isString(cs.params) ? cs.params.indexOf(magicCommentVariablePreix) === 0 ? t.identifier(cs.params.slice(1)) : t.stringLiteral(cs.params) : t.numericLiteral(cs.params || 0)
                            ]);
                        }, arrowPath.node));
                    }
                });
            }
        }
    });
    let { code } = generate(ast, {});
    //引入魔法注释插件字符串
    const magicCommentImportStr = lodash_1.default.map(importArr, (ia, module) => {
        const imports = lodash_1.default.map(ia, (val, key) => {
            return `${key} as ${val}`;
        }).join(',');
        return `import {${imports}} from "${magicCommentPlugin[module].url || module}"`;
    }).join(';');
    code = magicCommentImportStr + ';' + code;
    if (vueName) {
        const nameIndex = code.indexOf('__name');
        const restCode = code.slice(nameIndex);
        code = code.slice(0, nameIndex + restCode.indexOf("'") + 1) + vueName + restCode.slice(restCode.indexOf("'") + restCode.slice(restCode.indexOf("'") + 1).indexOf("'") + 1);
        code = code.slice(0, nameIndex) + `name:'${vueName}',` + code.slice(nameIndex);
    }
    return fileType === 'ts' ? code :
        oriContent.slice(0, scriptStartIndex + scriptStartLength) + //vue(Template字符串)
            code + //vue(Script字符串)
            oriContent.slice(scriptEndIndex); //vue(Style字符串)
};
