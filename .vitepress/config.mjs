import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-Hans',
  langMenuLabel: '切换语言',
  darkModeSwitchLabel: '主题',
  head: [["link", { rel: "icon", href: "/svg/logo.svg" }]],
  title: "前端学习录",
  description: "A VitePress Site",
  outDir: "dist",
  srcDir: "src",
  vite: {
    // https://cn.vitejs.dev/config/shared-options.html#publicdir
    publicDir: "../public", // 指定 public 目录路径
    plugins: [
      SearchPlugin({
        previewLength: 80, // 这个选项决定了搜索结果预览的长度，单位是字符数
        buttonLabel: "搜索", // 这个选项可以用来改变搜索按钮的标签
        placeholder: "搜索文档", // 这个选项可以用来设置搜索输入框的占位符
        allow: [], // 这是一个数组，你可以在这个数组中指定哪些页面可以被搜索
        ignore: [], // 这也是一个数组，你可以在这个数组中指定哪些页面不被搜索
      }),
    ],
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
      provider: "local",
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
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除搜索条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    logo: "/svg/index.svg",
    nav: [
      { text: '首页', link: '/' },
      { text: '例子', link: '/markdown-examples' }
    ],
    footer: {
      copyright: `版权所有 © 2019-${new Date().getFullYear()} Vue.js`,
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // https://vitepress.dev/zh/reference/default-theme-config#outline
    outline: {
      level: 'deep',
      label: "页面导航",
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short", // full
        timeStyle: "short", // medium
      },
    },
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '技术栈',
        collapsed: true,
        items: [
          { text: 'vitepress', link: '/技术栈/vitepress/index.md' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aixinlian' }
    ]
  },
})
