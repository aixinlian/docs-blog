---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'My Awesome Project'
  text: 'A VitePress Site'
  tagline: My great project tagline
  image:
    src: /images/background.png
  actions:
    - theme: brand
      text: 开始学习
      link: /src/api-examples
    - theme: alt
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - icon: 🎉
    title: 前端
    details: 从编码到页面，PC端，移动端，桌面端，以及性能优化，问题排查
    link: /前端/vue3/index.md
    linkText: vue3
  - icon: 🛠️
    title: 服务端
    details: 接口设计，部署服务
    link: /服务端/nest/index.md
    linkText: nest
  - icon: ⚡️
    title: 知识库
    details: 整理资料，打造个人专属知识宝集
    link: /知识库/node/index.md
    linkText: node
---
