import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs-blog/',
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
      { text: '例子', link: '/markdown-examples' },
      {
        text: '常见问题', items: [
          { text: 'vue', link: '/常见问题/vue' },
          { text: 'react', link: '/常见问题/react' },
          { text: '小程序', link: '/常见问题/小程序' },
          { text: 'ele-plus暗黑主题切换', link: '/常见问题/ele-plus暗黑主题切换' },
        ]
      },
      { text: '代码提交格式', link: '/代码提交格式' },
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
        text: '工具',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '软件分享', link: '/工具/软件分享/index' },
          { text: 'vscood', link: '/工具/vscood/index' },
          { text: 'monorepo', link: '/工具/monorepo/index' },
          { text: '文档', link: '/工具/文档/index' },
        ]
      },
      {
        text: '知识库',
        collapsed: false,
        items: [
          { text: 'vitepress', link: '/知识库/vitepress/index.md' },
          { text: 'docker', link: '/知识库/docker/index.md' },
          { text: 'nginx', link: '/知识库/nginx/index.md' },
          { text: 'vue3', link: '/知识库/vue3/index.md' },
          {
            text: 'react', link: '/知识库/react/index.md', items: [
              { text: 'hooks', link: '/知识库/react/hooks/index.md', },
              { text: 'zustand', link: '/知识库/react/zustand/index.md', },
            ]
          },
          { text: 'reactnative', link: '/知识库/reactnative/index.md' },
          { text: 'typescript', link: '/知识库/typescript/index.md' },
          { text: 'electron', link: '/知识库/electron/index.md' },
        ]
      },
      {
        text: '其他',
        items: [
          { text: 'prettier统一代码格式', link: '/其他/prettier统一代码格式/index.md' },
          { text: 'mockjs', link: '/其他/mockjs/index.md' },
          { text: '常见问题', link: '/其他/常见问题/index.md' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aixinlian' }
    ]
  },
})
