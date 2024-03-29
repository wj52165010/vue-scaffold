//内部eslint配置文件
const extensions = ['.vue']
const config = (alias:any) => ({
  "env": {
      "browser": true,
      "es2021": true
  },
  globals:{
    aosTheme:true,
    aosApi:true
  },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    ecmaFeatures:{
      legacyDecorators:true
    },
    sourceType: 'module',
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
  settings:{
    "import/resolver": {
      "webpack":{
        "config":{
          "resolve":{
            alias:alias,
            extensions: ['.ts', '.js'],
          }
        }
      }
    }
  },
  rules: {
    "no-console":"off",
    "class-methods-use-this":"off",
    "import/prefer-default-export":"off",
    "no-param-reassign":"off",
    "no-underscore-dangle":"off",
    "@typescript-eslint/no-this-alias":"off",
    "vue/multi-word-component-names":"off",
    "@typescript-eslint/ban-types":"off",
    "func-names":"off",
    "no-new-func":"off",
    "no-restricted-syntax":"off",
    "@typescript-eslint/no-explicit-any":"off",
    "no-shadow":"off",
    "no-nested-ternary":"off",
    "no-useless-escape":"off",
    "no-tabs":"off",
    "prefer-destructuring":"off",
    "vue/no-deprecated-dollar-listeners-api":"off",
    "vue/no-v-model-argument":"off",
    "import/no-self-import":"off",
    "vue/no-v-html":"off",
    "max-len":["error",{"code":300}],
    'import/extensions': ["error", "always", {
      'ts': 'never',
      'vue': 'never',
      'js': 'never'
    }]
  }
})


export default {
  config,
  extensions
}