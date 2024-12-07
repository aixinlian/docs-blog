# Prettier 统一代码格式

## 安装

```bash
npm i prettier -D
```

## 配置文件

配置文件 `.prettierrc`

格式化规则

```json
{
  "printWidth": 180, //每行代码数量
  "tabWidth": 2, // 缩进的空格个数
  "useTabs": false, //制表符使用空格
  "semi": false, // 语句结尾使用分号
  "endOfLine": "auto", //换行符
  "singleQuote": true, //使用单引号
  "jsxSingleQuote": false, //jsx使用单引号
  "trailingComma": "all", //对象末尾始终携带逗号
  "bracketSpacing": true, //对象花括号前后是否带空格
  "arrowParens": "always", //箭头函数参数是否带括号
  "bracketSameLine": true, //对象花括号是否同行
  "embeddedLanguageFormatting": "auto", //格式化嵌入式语言
  "htmlWhitespaceSensitivity": "css", //html空格敏感度
  "insertPragma": false, //是否插入pragma
  "proseWrap": "never", //markdown文本换行
  "quoteProps": "as-needed", //对象属性是否使用引号
  "requirePragma": false, //是否需要pragma
  "vueIndentScriptAndStyle": false, //vue文件script和style标签缩进
  "singleAttributePerLine": false //每行一个属性
}
```

忽略文件 `.prettierignore`

不需要格式化的文件

```
dist
node_modules
.eslintignore
.prettierignore
```

## 格式化命令

```json
"scripts": {
  "format": "prettier --write src/"
}
```

```json
"scripts": {
  "format": "prettier --write ."
}
```
