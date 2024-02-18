declare const _default: {
    config: (alias: any) => {
        env: {
            browser: boolean;
            es2021: boolean;
        };
        globals: {
            aosTheme: boolean;
            aosApi: boolean;
        };
        extends: string[];
        overrides: never[];
        parser: string;
        parserOptions: {
            parser: string;
            ecmaVersion: number;
            sourceType: string;
        };
        plugins: string[];
        settings: {
            "import/resolver": {
                webpack: {
                    config: {
                        resolve: {
                            alias: any;
                            extensions: string[];
                        };
                    };
                };
            };
        };
        rules: {
            "no-console": string;
            "@typescript-eslint/no-this-alias": string;
            "no-underscore-dangle": string;
            "vue/multi-word-component-names": string;
            "@typescript-eslint/ban-types": string;
            "func-names": string;
            "no-new-func": string;
            "no-restricted-syntax": string;
            "max-len": (string | {
                code: number;
            })[];
            "@typescript-eslint/no-explicit-any": string;
            "no-shadow": string;
            "no-tabs": string;
            "no-nested-ternary": string;
            "no-useless-escape": string;
            "prefer-destructuring": string;
            "vue/no-deprecated-dollar-listeners-api": string;
            "vue/no-v-model-argument": string;
            "import/no-self-import": string;
            "vue/no-v-html": string;
            'import/extensions': (string | {
                ts: string;
                vue: string;
                js: string;
            })[];
        };
    };
    extensions: string[];
};
export default _default;
