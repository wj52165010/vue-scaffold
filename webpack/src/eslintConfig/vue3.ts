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
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
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
    "@typescript-eslint/no-this-alias":"off",
    "no-underscore-dangle":"off",
    "vue/multi-word-component-names":"off",
    "@typescript-eslint/ban-types":"off",
    "func-names":"off",
    "no-new-func":"off",
    "no-restricted-syntax":"off",
    "max-len":["error",{"code":300}],
    "@typescript-eslint/no-explicit-any":"off",
    "no-shadow":"off",
    "no-tabs":"off",
    "no-nested-ternary":"off",
    "no-useless-escape":"off",
    "prefer-destructuring":"off",
    "vue/no-deprecated-dollar-listeners-api":"off",
    "vue/no-v-model-argument":"off",
    "import/no-self-import":"off",
    "vue/no-v-html":"off",
    'import/extensions': ['error', 'always', {
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