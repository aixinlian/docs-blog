## 1 开始(基础配置)

webpack 主要有五个核心概念：

- entry（入口）：配置入口文件，从哪个文件开始解析和构建。
- output（输出）：打包完后的文件输出的具体信息。主要的两个选项就是导出路径 path 和导出 bundle 文件名称 filename。
- loader（加载器）：webpack 自身只能理解 JavaScript 模块，如果遇到其他类型的文件，就需要使用 loader 进行转换。
- plugins（插件）：扩展 webpack 的功能，用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
- mode（模式）：development（开发环境 dev）和 production（生产环境 prod）

### 1-1 vite 与 webpack

vite 与 webpack 都是前端构建工具，两者的区别主要在于：

- 开发环境：vite 使用原生 ESM 模块，可以直接在浏览器中运行，而 webpack 需要配置 loader 来处理各种文件类型，并且需要额外的插件来优化打包结果。
- 打包大小：vite 的打包大小更小，因为它使用 ESM 模块，并且使用 Rollup 打包，可以将模块按需加载，而 webpack 的打包大小更大，因为它需要处理各种文件类型，并且需要额外的插件来优化打包结果。
- 热更新：vite 使用 HMR（Hot Module Replacement）热更新，可以实时更新浏览器中的模块，而 webpack 需要配置插件来实现热更新。
- 性能：vite 的性能更好，因为它使用原生 ESM 模块，并且使用 Rollup 打包，可以将模块按需加载，而 webpack 的性能更差，因为它需要处理各种文件类型，并且需要额外的插件来优化打包结果。
- 配置：vite 的配置更简单，因为它使用 Rollup 作为打包工具，而 webpack 的配置更复杂，因为它需要处理各种文件类型，并且需要额外的插件来优化打包结果。

### 1-2 安装 webpack

```
yarn init -y // 初始化项目
// yarn add -D 是 yarn add --save-dev 的简写，是指安装模块并保存到 package.json 的 devDependencies
// 3版本以上的需要安装webpack-cli,默认为5
yarn add webpack webpack-cli -D
```

package.json

```
{
  "name": "webpack",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack"
  },
  "dependencies": {},
  "devDependencies": {
    "webpack": "^5.91.0",
    "webpack-cli": "^5.1.4"
  }
}
```

webpack.config.js

```
// require 是 CommonJS 规范中使用的模块引入方式，而 import 是 ES6 模块系统中定义的语法。
// import 是编译时执行，会在代码加载前执行模块的静态分析，而 require 是运行时执行，会在运行时动态加载模块。
// import 是默认从被引入的模块中导出的内容中选择需要的部分进行引入，而 require 是将整个模块对象引入到当前模块中。
// 在使用 import 时，被引入的模块路径必须是相对路径或者绝对路径，并且可以省略 .js 扩展名，而 require 没有这个限制。
// 在 Node.js 中，目前仍然推荐使用 require 来引入模块，因为大多数 Node.js 库和框架都是基于 CommonJS 规范编写的。

const path = require("path")

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // 加载器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "development", // 开发模式
};
```

新建 src 文件夹，并在其中创建 src/js/count.js 和 src/main.js 文件

count.js

```
function count (x, y) {
  console.log(x, y)
  return x + y
}
// 通过 CommonJS 规范导出
module.exports = count
```

main.js

```
const count =require('./js/count.js');
count(1,2)
```

此时目录如下

```
├── node_modules
├── src
│ ├── js
│ │ └── count.js
│ ├── main.js
├── package.json
└── webpack.config.js
```

执行打包命令`yarn webpack`,这里为了简便直接使用`webpack`，会在 dist 文件夹下生成 bundle.js 文件。

没有写配置文件的话用`yarn webpack --mode=development`,npm 是`npx webpack --mode=development`

### 1-3 Loader

#### 1-3-1 处理 css

添加目录 src/css/main.css 中添加一些样式

```
*{
  padding: 0;
  margin: 0;
}
.box {
  width: 100px;
  height: 100px;
  background-color: skyblue;
}
```

main.js

```
// 通过 CommonJS 规范导入 CSS 模块
require('./css/main.css');
```

现在执行 webpack 命令，会报错，因为 webpack 默认只能处理 JavaScript 模块，无法处理 CSS 模块。

解决方法是使用 Loader，通过 Loader 告诉 webpack 如何处理 css 模块。

```
yarn add -D style-loader css-loader
```

```
const path = require("path")

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // 加载器
  module: {
    rules: [
      {
      // 用来匹配 .css 结尾的文件
      test: /\.css$/,
      // use 里面的 loader 执行顺序是 从右往左执行的
      use: ["style-loader", "css-loader"],
      }
    ],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "development", // 开发模式
};
```

`module.rules`数组配置了一组规则。如上配置告诉 Webpack 在遇到以 .css 结尾的文件时先使用 css-loader 读取 CSS 文件将其编译为 commonjs 加入到 js 中，再交给 style-loader 把 CSS 通过创建 style 标签内容注入到 html 文件中生效。

添加 index.html 文件

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>

<body>
  <h1>Hello Webpack5</h1>
  <div class="box"></div>
  <script src="./dist/bundle.js"></script>
</body>

</html>
```

执行 `yarn build` / `webpack` 打包，会在 dist 文件夹下生成 bundle.js 文件，打开 index.html 文件，可以看到页面上显示了 Hello Webpack5 和一个蓝色的 box。

#### 1-3-2 处理 less

```
yarn add -D less less-loader
```

webpack.config.js

```
{
  test: /\.less$/,
  use: ["style-loader", "css-loader", "less-loader"],
},
```

添加 src/less/main.less 文件

```
.box2 {
  width: 100px;
  height: 100px;
  background: orange;
}

```

main.js

```
require('./less/main.less');
```

index.html

```
<body>
  <h1>Hello Webpack5</h1>
  <div class="box"></div>
  <div class="box2"></div>
  <script src="./dist/bundle.js"></script>
</body>
```

#### 1-3-3 处理图片/svg

webpack5 内置了 `file-loader` 和 `url-loader`， 不用我们自己去安装`loader`。

webpack.config.js

```
{
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: 'asset/resource', // 生成一个单独的文件资源
  generator: {
    filename: 'images/[hash:8][ext][query]', //生成的文件将放置在 images 目录下，[hash:8] 表示生成 8 位哈希值作为文件名，[ext] 表示原始文件扩展名，[query] 表示查询参数
  },
  parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024, // 小于 10kb的图片会被base64处理
      },
  },
},
```

这里区分一下 type:"asset/resource"和 type:"asset"的区别：

```
1. type:"asset/resource"相当于file-loader，将文件转化成Webpack能识别的资源，不做其他处理。
2. type:"asset"相当于url-loader，将文件转化成Webpack能识别的资源，同时小于某个大小的资源会处理成 data URL 的形式。
```

添加图片 src/images/1.jpeg

src/less/main.less

```
.box3 {
  width: 100px;
  height: 100px;
  background-image: url('../images/1.jpeg');
  background-size: cover;
}
```

在 html 中添加这个盒子，执行打包命令

#### 1-3-4 自动清空 dist 目录

```
  output: {
    ...
    clean: true, // 每次打包前清空输出目录
  }
```

#### 1-3-5 处理 js eslint/babel

因为 webpack 对 js 处理是有限的，只能编译 js 中的 ES 模块化语法，不能编译其他语法，导致 js 不能在 IE 等浏览器上面运行，所以我们需要做兼容性处理。

1.使用 eslint 格式化代码

```
yarn add eslint-webpack-plugin eslint -D

```

添加 eslint 配置文件 .eslintrc.js

```
module.exports = {
  // 继承 eslint 规则
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用 node 中的全局变量
    browser: true, // 启用 浏览器中全局变量
  },
  // 解析选项
  parserOptions: {
    ecmaVersion: 6, //ES6解析版本
    sourceType: "module", // ES6模块
  },
  // 具体规则
  //off 或 0 - 关闭规则
  //warn 或 1 - 将规则视为警告（不影响退出代码）
  //error 或 2 - 将规则视为错误（退出代码时触发）
  //具体规则查看 https://zhuanlan.zhihu.com/p/547023787
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
  },
};
```

开发中一点点写 rules 规则太费劲了，所以有更好的办法，继承现有的规则。现有以下较为有名的规则：

[Eslint 官方的规则 open in new window](https://eslint.bootcss.com/docs/rules/)：eslint:recommended

[Vue Cli 官方的规则 open in new window](https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-eslint)：plugin:vue/essential

[React Cli 官方的规则 open in new window](https://github.com/facebook/create-react-app/tree/main/packages/eslint-config-react-app)：react-app

webpack.config.js

```
const ESlintWebpackPlugin = require("eslint-webpack-plugin");

  plugins: [
    new ESlintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "src"),
    }),
  ],
```

安装 eslint 插件，这样在编辑器中就有对应的错误提示了。

如果有不需要通过 selint 校验的文件

添加 .eslintignore

```
# 忽略 dist 目录下所有文件
dist
```

2.使用 babel-loader 处理 js

babel 是 javascript 编译器。能将 es6 语法编写的代码转换成为向后兼容的 javascript 语法，能够兼容当前版本的浏览器或在其他环境中运行。

```
yarn add babel-loader @babel/core @babel/preset-env -D
```

添加 babel.config.js

```
module.exports = {
  // 预设
  presets: ["@babel/preset-env"],
}
// @babel/preset-env：一个智能预设，允许你使用最新的 javascript 语法
// @babel/preset-react：一个用来编译 React jsx 语法的预设
// @babel/preset-typescript：用来编译 TypeScript 语法的预设
```

webpack.config.js

```
rules: [
  //.....
    {
    test: /\.js$/,
    exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
    loader: "babel-loader",
  },
],
```

#### 1-3-6 处理 html

```
yarn add html-webpack-plugin -D
```

webpack.config.js

```
const HtmlWebpackPlugin = require("html-webpack-plugin")
  plugins: [
    ...
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
```

打包后 dist 下面输出的 index.html 文件，中会自动引入项目配置的入口文件。并且这个 js 文件中会存在 defer 属性。

async 属性表示脚本的下载和执行是异步进行的，下载完成后立即执行，不会阻塞页面的解析和渲染，而执行顺序不确定；而 defer 属性也表示脚本的下载是异步进行的，但是执行被延迟到 HTML 解析完成之后，按照它们在文档中出现的顺序执行，不会阻塞页面的解析。

#### 1-3-7 开发环境搭建

```
yarn add webpack-dev-server -D
```

webpack.config.js

```
  // 开发服务器配置
  devServer: {
    host: "localhost", // 主机名
    port: "3000", // 端口号
    open: true, // 自动打开浏览器
  },
```

执行命令`webpack serve`会开启一个服务并自动打开浏览器，并且会自动监听文件的变化，自动重新打包。

#### 1-3-8 生产模式

添加目录 src/config/webpack.dev.js

```
const path = require("path")
const ESlintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  // 入口
  entry: path.resolve(__dirname, "../main.js"),
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "../../dist"),
    filename: "bundle.js",
  },
  // 加载器
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 里面的 loader 执行顺序是 从右往左执行的
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于 10kb的图片会被base64处理
          },
        },
        generator: {
          // [ext] 使用之前的文件扩展名
          // [query] 添加之前的 query 查询参数
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
      {
        test: /\.(ttf|woof2?)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
        loader: "babel-loader",
      },
    ],
  },
  // 模式
  mode: "development", // 开发模式
  // 插件

  plugins: [
    new ESlintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../../index.html"),
    }),
  ],
  // 开发服务器配置
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
  },
};
```

src/config/webpack.prod.js

```
const path = require("path");
const ESlintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: path.resolve(__dirname, "../src/main.js"),
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js", // 把文件打包到 static/js 下面的目录中
    clean: true, // 自动清空上次打包生成的文件
  },
  // 加载器
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 里面的 loader 执行顺序是 从右往左执行的
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于 10kb的图片会被base64处理
          },
        },
        generator: {
          // [ext] 使用之前的文件扩展名
          // [query] 添加之前的 query 查询参数
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
      {
        test: /\.(ttf|woof2?)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
        loader: "babel-loader",
      },
    ],
  },
  // 模式
  mode: "production", // 开发模式
  // 插件

  plugins: [
    new ESlintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html"),
    }),
  ],
};
```

添加 script 脚本

```
"dev": "webpack server --config ./src/config/webpack.dev.js"
"prod": "webpack server --config ./src/config/webpack.prod.js"
```

#### 1-3-9 处理 css

现在打包是 将 css 打包到 js 中，在加载 js 文件的时候，会动态创建一个 style 标签来生成样式，有可能出现闪屏的现象，用户体验不好，我们要将 css 文件单独提取出来，通过 link 标签来加载。

1. 单独提取 css

```
yarn add mini-css-extract-plugin -D
```

webpack.prod.js

```
const path = require("path")
const ESlintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  // 入口
  entry: path.resolve(__dirname, "../main.js"),
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "../../dist"),
    filename: "bundle.js",
    clean: true, // 自动清空上次打包生成的文件
  },
  // 加载器
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 里面的 loader 执行顺序是 从右往左执行的
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      }
    ],
  },
  // 模式
  mode: "production", // 开发模式
  // 插件

  plugins: [
    new MiniCssExtractPlugin({
      filename: "mini.css",
    }),
  ],
}

```

2.css 兼容性处理

```
yarn add postcss-loader postcss postcss-preset-env -D
```

webpack.prod.js

```
const path = require("path")
const ESlintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  // 入口
  entry: path.resolve(__dirname, "../main.js"),
  // 出口
  output: {
    // __dirname 是当前文件的文件夹绝对路径
    // path.resolve 方法返回的是一个绝对路径
    // path 是文件输出的目录
    path: path.resolve(__dirname, "../../dist"),
    filename: "bundle.js",
    clean: true, // 自动清空上次打包生成的文件
  },
  // 加载器
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 里面的 loader 执行顺序是 从右往左执行的
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "poss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", // 兼容大多数样式兼容性
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "poss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", // 兼容大多数样式兼容性
                ],
              },
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.s[ac]ss/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "poss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", // 兼容大多数样式兼容性
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "poss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", // 兼容大多数样式兼容性
                ],
              },
            },
          },
          "stylus-loader",
        ],
      }
    ],
  },
  // 模式
  mode: "production", // 开发模式
  // 插件

  plugins: [
    new MiniCssExtractPlugin({
      filename: "mini.css",
    }),
  ],
}
```

添加.browserslistrc 配置文件

```
last 2 version # 支持最近两个主要版本的浏览器。
> 1% # 支持全球使用量超过1%的浏览器。
not dead # 排除已经停止更新维护的浏览器。
```

合并 css 等 loader 的配置文件

```
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 兼容大多数样式兼容性
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 里面的 loader 执行顺序是 从右往左执行的
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
    ],
  },
```

3. 压缩 css

```
yarn add css-minimizer-webpack-plugin -D
```

webpack.prod.js

```
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
  plugins: [
    new CssMinimizerPlugin(),
  ],
```

## 2 优化

以下都可以在 webpack.dev.js 跟 webpack.prod.js 中配置

### 1.提升开发体验

<br/>

#### 1.sourceMap

我们用 webpack 在编译生成的代码如果在生产环境报错了，定位错误会比较困难，因为编译后的代码被压缩了，没有对应的映射关系，这时候我们需要 sourceMap 来帮助我们定位错误，`映射源代码与编译后代码`之间的关系。当构建后的代码报错时，可以通过.map 文件，从构建后代码出错的位置找到映射后源代码出错的位置，这样就可以让浏览器提示出源代码出错的位置，帮助我们更快的找到错误的位置。

- 开发模式 `cheap-module-source-map` 只包含行映射，没有列映射

webpack.dev.js

```
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
};

```

- 生产模式 `source-map` 包含行/列映射

webpack.prod.js

```
module.exports = {
  mode: "production",
  devtool: "source-map",
};

```

### 2.提升打包构建速度

<br/>

#### 1.HotModuleReplacement

(HMR/热模块替换)：在程序运行中，替换、添加或删除模块，只需要重新打包编译当前模块,而不需要重新加载整个页面。

css 配置

```
module.exports = {
  // 其他省略
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
  },
};
```

js 配置

main.js

```
// 判断是否支持 HMR 功能
if (module.hot) {
  module.hot.accept("./js/count.js");
  module.hot.accept("./js/sum.js");
}
```

这样配置会比较麻烦，比较常用的是 vue-loader，react-hot-loader。

#### 2.oneOf

webpack 打包时，每个文件都会经过所有的 loader 处理，就算有 test 进行匹配，没有进行实际上的处理，但是都需要过一遍，比较慢。`oneOf`让他只匹配一个 loader，剩下的就不匹配了

```
  // 加载器
  module: {
    rules: [
      {
        //每个文件只能被其中一个loader选中
        oneOf: [
          ... 原有的 rule 规则
        ],
      },
    ],
  },
```

#### 3.include/exclude

- include 包含，只处理 包含的文件
- exclude 排除，处理 排除文件之外的文件

```
  {
    test: /\.js$/,
    // exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
    include: path.resolve(__dirname, "../src"),
    loader: "babel-loader",
  },


  plugins: [
    new ESlintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
    })
  ],
```

#### 4.Cache

每次打包的时候 js 文件都要经过 eslint 检查和 babel 编译，比较慢。

我们可以缓存之前 eslint 检查和 babel 编译的结果，这样在第二次构建的时候速度就会更快了。

`Cache`可以对 eslint 检查和 babel 编译结果进行缓存。

```
  {
    test: /\.js$/,
    // exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
    include: path.resolve(__dirname, "../src"),
    loader: "babel-loader",
    options:{
      cacheDirectory: true // 开启缓存
      cacheCompression: false // 关闭压缩缓存
    }
  },


  plugins: [
    new ESlintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"), // 缓存位置
    })
  ],
```

#### 5.Thread

开启多进程同时处理 js 文件，这样的速度就会比之前的单进程打包更快。

启动的进程数就是我们电脑 cpu 的核心数

```
yarn add thread-loader -D
```

```
const os = require("os");

// 获取 cpu 核数
const threads = os.cpus().length;

const TerserPlugin = require("terser-webpack-plugin");

  // babel-loader
  {
    test: /\.js$/,
    exclude: /node_modules/, // 排除 node_modules 下面的代码不进行编译
    use: [
      {
        loader: "thread-loader",
        options: {
          workers: threads,//开启进程数量
        },
      },
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },

  // eslint
  new ESlintWebpackPlugin({
    ...
    threads, //开启多进程
  }),

  // 压缩
  optimization: {
    //压缩的操作
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，如果我们有其他的配置就要在这里进行重写
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
    ],
  },
```

### 3.减少代码体积

<br/>

#### 1.tree shaking

如果没有特殊处理的话我们打包时会引入整个库，但是实际上可能我们可能只用上极小部分的功能。这样将整个库都打包进来，体积就太大了。webpack 4.x 开始支持 tree shaking，`production `下默认开启，可以自动剔除没有使用的代码，减少打包后的代码体积。

#### 2.Image Minimizer 压缩图片

```
yarn add image-minimizer-webpack-plugin imagemin -D
//无损压缩
yarn add imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

```
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

  // 压缩
  optimization: {
    //压缩的操作
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，如果我们有其他的配置就要在这里进行重写
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
      //压缩图片
      new ImageMinimizerPlugin({
        minimizer:{
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options:{
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo",
              {
                plugins: [
                  "preset-default",
                  "prefixIds",
                  {
                    name:"sortAttrs",
                    params:{
                      xmlnsOrder:"alphabetical"
                    }
                  }
                ]
              }
              ]
            ]
          }
        }

      })
    ],
  },
```

### 4.优化代码运行性能

<br/>

#### 1.Code Split

打包时会将所有的 js 文件打包到一个 js 文件中，体积会很大，如果只要渲染首页，就应该只加载首页的 js 文件

- 1.分割文件：将打包生成的文件进行分割，生成多个 js 文件
- 2.按需加载：需要哪个文件就加载哪个文件

```
module.exports = {
  entry:{
    //多个入口文件
    app:"./src/app.js", //app依赖的资源打包成一个模块，这个模块就叫chunk
    main:"src/main.js" //mian依赖的资源打包成一个模块，这个模块就叫chunk。打包进来的资源是chun，输出数据叫bundle
  },
  output:{
    //多个输出文件
    path:path.resolve(__dirname,"dist"),
    filename:"[name].js" //文件命名方式，[name]以文件名自己命名
  },
}
```

代码分割，将公共代码单独打包成一个 js 文件

```
optimization:{
  splitChunks:{
    chunks:"all",//对所有模块都进行分割
  }
}
```

按需导入

使用 import 动态导入（import()）js，会将动态导入的文件代码分割（拆分成单独模块），在需要的时候自动加载

eslint 无法识别动态导入语法，需要配置`plugins:["import"]`

此时这个单独的模块名是默认的无法分辨，需要配置他的文件名

```
在动态导入js的时候
///*webpackChunkName:"math"*/  webpack魔法命名
import(/*webpackChunkName:"math"*/ "./js/math").then((module => {}) )

webpack配置
output:{
  //给打包输出的其他文件命名
  chunkFilename:"static/js/[name].[hash:8].js"
}
```

命名为 chunk，我们可以配置`filename`属性来自定义 chunk 文件的命名，默认是`chunk.[name].js`

#### 统一命名

```
所有的命名都用 xxx/[name].css/.js
output:{
  path:path.resolve(__dirname,"../dist"),//绝对路径
  //入口文件打包输出文件名
  filename:"static/js/[name].js",
  //给打包输出的其他文件命名
  chunkFilename:"static/js/[name].chunk.js",
  //图片、字体等通过type:asset处理资源命名  只要是type:asset的，都会用这种方式命名
  assetModuleFilename:"static/media/[hash:10][ext][query]",
  //自动清空上次打包的内容
  //在打包时，将path整个目录清空再进行打包
  clean:true
}
```

#### 2.preload / prefetch

- Preload：告诉浏览器立即加载资源。
- Prefetch：告诉浏览器在空闲时才开始加载资源。

#### 3.network cache

#### 4.core-js
