const sidebar = [
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
]

export { sidebar }