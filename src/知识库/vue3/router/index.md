# vue3 路由

## 安装

```bash
npm i vue-router
```

## 路由模式

### createWebHistory

```js
window.addEventListener('popstate', (e) => {
  e //监听浏览器前进后退按钮切换路由的变化
})
```

通过 history.pushState() 实现路由跳转

跳转不会被浏览器监听到，需要手动刷新

### createWebHashHistory

```js
window.addEventListener('hashchange', (e) => {
  e //监听浏览器前进后退按钮切换路由的变化
})
```

通过 location.hash() 实现路由跳转

跳转可以被浏览器监听到

## 路由跳转

### router-link 跳转

```js
<router-link to="/about">About</router-link>
<router-link :to="{ path: '/about' }">About</router-link>
<router-link :to="{name:'about'}">About</router-link>
<router-link replace to="/about">About</router-link> //replace不会保存历史记录
```

### useRouter 跳转

```js
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/about')
router.push({ path: '/about' })
router.push({ name: 'about' })
router.replace('/about') //replace不会保存历史记录
router.go() //前进
router.back() //后退
```

## 路由传参

```js
import { useRouter } from 'vue-router'
const router = useRouter()
router.push({ path: '/about', query: {} }) //路径 ? + &
router.push({ name: 'about', params: {} }) //路径 /1  params只能用name，一刷新会丢失
```

## 获取参数

```js
import { useRoute } from 'vue-router'
const route = useRoute()
route.query || route.params

import { useRouter } from 'vue-router'
const router = useRouter()
router.currentRoute.value.query
```

## 动态路由

```js
import { useRouter } from 'vue-router'
router.addRoute({ path: '/user', name: 'user', component: User })
```
