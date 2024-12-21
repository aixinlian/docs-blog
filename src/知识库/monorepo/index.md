# Monorepo

https://www.pnpm.cn/installation

-D / --save-dev 安装到开发依赖 （devDependencies）
默认 安装到开发和生产依赖 （dependencies）

## 项目结构

新建文件夹`monorepo`

创建文件

```
monorepo
├── apps
│   ├── project-1
│   │   ├── src
│   │   │   ├── index.js
│   │   ├── index.html
│   │   └── package.json
│   ├── project-2
│   │   ├── src
│   │   │   ├── index.js
│   │   ├── index.html
│   │   └── package.json
├── packages
│   ├── utils
│   │   ├── src
│   │   │   ├── index.js
│   │   └── package.json
├── package.json
├── pnpm-workspace.yaml
└── Readme.md
```

package.json

```json{2-3,5}
{
  "name": "@monorepo/root", //"@monorepo/project-1", "@monorepo/project-2", "@monorepo/utils"
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "vite"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <script type="module" src="./src/index.js"></script>
  </body>
</html>
```

pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 安装依赖

```bash
pnpm add vite -w -D
```

-w 根目录 -D 开发依赖

packages/utils/src/index.js

```js
export const add = (a, b) => a + b
```

在 apps/project-1 根目录下安装 utils 依赖

每次修改完都需要重新安装依赖

```bash
pnpm add @monorepo/utils --workspace
```

在 apps/project-1/src/index.js 中使用 utils

```js
import { add } from '@monorepo/utils'

console.log(add(1, 2))
```

## 运行项目

根目录下

```bash
pnpm run --filter[-F] @monorepo/project-1 dev
```

## 简化命令

```json
  "scripts": {
    "dev:project1": "pnpm run --filter @monorepo/project-1 dev",
    "dev:project2": "pnpm run --filter @monorepo/project-2 dev"
  },
```
