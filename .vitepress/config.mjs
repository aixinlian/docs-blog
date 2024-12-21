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
      { text: '例一', link: '/markdown-examples' },
      { text: '例二', link: '/api-examples' },
      { text: '代码提交格式', link: '/header/代码提交格式' },
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
        text: '前端',
        collapsed: false,
        items: [
          {
            text: 'vue3', link: '/前端/vue3/index.md', items: [
              { text: 'pinia', link: '/前端/vue3/pinia/index.md', },
              { text: 'router', link: '/前端/vue3/router/index.md', },
            ]
          },
          {
            text: 'react', link: '/前端/react/index.md', items: [
              { text: 'hooks', link: '/前端/react/hooks/index.md', },
              { text: 'zustand', link: '/前端/react/zustand/index.md', },
              { text: 'router', link: '/前端/react/router/index.md', },
            ]
          },
          { text: 'reactnative', link: '/前端/reactnative/index.md' },
          { text: 'electron', link: '/前端/electron/index.md' },
          { text: 'typescript', link: '/前端/typescript/index.md' },
          { text: '常见问题', link: '/前端/常见问题/index.md' },
        ]
      },
      {
        text: '服务端',
        collapsed: false,
        items: [
          { text: 'pm2', link: '/服务端/pm2/index.md' },
          { text: 'nginx', link: '/服务端/nginx/index.md' },
          { text: 'docker', link: '/服务端/docker/index.md' },
          { text: 'express', link: '/服务端/express/index.md' },
          { text: 'nest', link: '/服务端/nest/index.md' },
          { text: 'bun', link: '/服务端/bun/index' },
        ]
      },
      {
        text: '知识库',
        collapsed: false,
        items: [
          { text: 'vitepress', link: '/知识库/vitepress/index.md' },
          { text: 'monorepo', link: '/知识库/monorepo/index' },
          { text: 'prettier统一代码格式', link: '/知识库/prettier统一代码格式/index.md' },
          { text: 'mockjs', link: '/知识库/mockjs/index.md' },
        ]
      },
      {
        text: '常用',
        collapsed: false,
        items: [
          { text: '软件分享', link: '/常用/软件分享/index' },
          { text: 'vscood', link: '/常用/vscood/index' },
          { text: '网址导航', link: '/常用/网址导航/index' },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aixinlian' }
    ]
  },
})
