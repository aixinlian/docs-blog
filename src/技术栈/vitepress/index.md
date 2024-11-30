# VitePress

官网地址：https://vitepress.dev/zh/

## 开始

新建文件夹 docs-blog，在文件夹中初始化依赖文件：

```js
npm init -y
```

初始化 VitePress

```js
npx vitepress init
```

![alt text](img/base_init.png)

修改依赖

```json
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
```

执行

```js
npm i vitepress
```

## 修改文件结构

::: info
根目录下新建 src 文件夹（存放页面）、public 文件夹（存放静态资源、图片）

将`index.md` `api-examples.md` `markdown-examples.md`移动至`src`文件夹下

:::

新建.gitignore

```bash
node_modules
.vitepress/cache/
dist
package-lock.json
```

## 修改配置文件

.vitepress/config.mjs

```js
export default defineConfig({
  base: '/docs-blog/', // 设置站点根路径
  lang: 'zh-Hans',
  langMenuLabel: '切换语言',
  darkModeSwitchLabel: '主题',
  head: [['link', { rel: 'icon', href: '/svg/logo.svg' }]],
  title: '前端学习录',
  description: 'A VitePress Site',
  outDir: 'dist',
  srcDir: 'src',
  vite: {
    // https://cn.vitejs.dev/config/shared-options.html#publicdir
    publicDir: '../public', // 指定 public 目录路径
  },
  markdown: {
    // 代码块风格
    theme: 'material-theme-palenight',
    // theme:'github-light',
    // 代码块显示行数
    lineNumbers: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            /* ... */
          },
          searchOptions: {
            /* ... */
          },
        },
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除搜索条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    logo: '/svg/index.svg',
    //顶部导航
    nav: [{ text: '首页', link: '/' }],
    //底部信息
    footer: {
      copyright: `版权所有 © 2019-${new Date().getFullYear()} Vue.js`,
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // https://vitepress.dev/zh/reference/default-theme-config#outline
    //右侧边栏
    outline: {
      level: 'deep',
      label: '页面导航',
    },

    //只有上传到github，每次提交时要有记录才会生效
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short', // full
        timeStyle: 'short', // medium
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    //左侧边栏
    sidebar: [
      {
        text: '工具',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
      {
        text: '工具',
        /**
         * 如果未指定，侧边栏组不可折叠
         *
         * 如果为 `true`，则侧边栏组可折叠并且默认折叠
         *
         * 如果为 `false`，则侧边栏组可折叠但默认展开
         */
        collapsed: false,
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],
    //右上角链接
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
  },
})
```

src/index.md

```md
features:

- title: vue3
  details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  # 鼠标移入展示效果，默认无效果
  link: https://notes.fe-mm.com/fe/javascript/types
  # 链接文字
  linkText: 前端常用知识
```

## 使用 icon

```bash
npm install @iconify/vue
```

https://iconify.design/

.vitepress/theme/index.js

```js
import { Icon } from '@iconify/vue'

enhanceApp ({ app, router, siteData }) {
  app.component('Icon', Icon)
}
```

使用方法

```md
<Icon icon="material-symbols:add-home" />
```

## 修改样式

.vitepress/theme/index.css

```css
.fa-solid,
.fa-regular,
.fa-brands {
  width: 1.2em;
  vertical-align: middle;
  text-align: center;
}

:where(.iconify) {
  display: inline-block;
  flex-shrink: 0;
  font-size: 1.2em;
  vertical-align: sub;
}
/* 首页 Feature 图标样式 */
.VPFeature {
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.VPFeature .icon {
  position: absolute;
  opacity: 0.15;
  right: 10%;
  background-color: transparent;
  font-size: 8em;
  z-index: -1;
}

/* 文档二级标题编号 */
.vp-doc {
  counter-reset: section-counter;
}

.vp-doc h2 {
  counter-increment: section-counter;
}

.vp-doc h2::before {
  content: counter(section-counter);
  position: absolute;
  left: -2rem;
  font-size: 3rem;
  font-weight: bold;
  color: var(--vp-c-divider);
  z-index: -1;
}
```

## 部署

新建项目仓库 docs-blog，按照提示推送代码至远程仓库。
