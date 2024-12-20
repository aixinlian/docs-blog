# Pinia

## 安装

```bash
npm install pinia
```

main.ts

```ts
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
```

## 初始化仓库

src/store/index.ts

选项式写法

```ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      current: 0,
      name: 'app',
    }
  },
  //computed
  getters: {
    newName(): string {
      return this.name + this.current
    },
  },
  //methods
  actions: {
    setCurrent() {
      this.current = 999
    },
    addCurrent() {
      this.current += 1
    },
  },
})
```

组合式写法

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const current = ref(0)
  const name = ref('app')

  return {
    name,
    current,
  }
})
```

## 使用

```ts
import { useAppStore } from './store'
const appStore = useAppStore()
1. appStore.current++
2. appStore.$patch({ current: 888 })
3. appStore.$patch((state) => {state.current = 999})
4. 通过 store 的 actions
```

## 解构

从 store 中解构出来的数据不具有响应式，需要使用 `storeToRefs`，然后使用.value 取值

```ts
import { useAppStore } from './store'
import { storeToRefs } from 'pinia'
const appStore = useAppStore()
const { current, name } = storeToRefs(appStore)
```

## 持久化

安装插件 `pinia-plugin-persistedstate` 默认存储位置为 `localStorage`

main.ts

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
app.use(pinia)
```

选项式

```ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {},
  getters: {},
  actions: {},
  // persist: true,
  persist: {
    key: 'app',
  },
})
```

组合式

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    return {}
  },
  {
    persist: true,
  }
)
```
