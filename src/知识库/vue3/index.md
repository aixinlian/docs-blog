# vue3

## 生命周期

- beforeCreate 创建实例之前

- created 创建实例之后

setup 代替上面两个钩子

- onBeforeMount 组件创建之前

- onMounted 组件创建之后

- onBeforeUpdate 组件更新之前

- onUpdated 组件更新之后

- onBeforeUnmount 组件销毁之前

- onUnmounted 组件销毁之后

## ref 全家桶

### ref

- 将数据包装成深层响应式，需要加.value
- 支持所有类型
- 获取 DOM 元素

### shallowRef

将数据包装成浅层响应式，需要加.value

### isRef

判断是否是 ref

### toRef

- 将数据包装成响应式，需要加.value
- 只能修改响应式对象的值

```js
const man = reactive({ name: '张三', age: 18 })
const name = toRef(man, 'name')
name.value = '篮球'
```

### toRefs

- 将数据包装成响应式，需要加.value
- 只能修改响应式对象的值
- reactive 解构不是响应式，可以使用 toRefs

```js
const man = reactive({ name: '张三', age: 18 })
const { name, age } = toRefs(man)
name.value = '篮球'
age.value = 20
```

### toRaw

- 响应式用 toRaw 包装，包装出来的对象不再是响应式的

### reactive

- 将数据包装成响应式，不用加.value
- 只能传复杂数据类型
- 解构出来不是响应式的

### shallowReactive

将数据包装成浅层响应式，不用加.value

## computed 计算属性

### get,set 写法，可以修改值

```js
import { ref, computed } from 'vue'
const firstName = ref('John')
const lastName = ref('Doe')
let name = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newVal) {
    ;[firstName.value, lastName.value] = newVal.split(' ')
  },
})
```

### 函数式写法，不可以修改值

```js
import { ref, computed } from 'vue'
const firstName = ref('John')
const lastName = ref('Doe')
const name = computed(() => `${firstName.value} ${lastName.value}`)
```

## 监听器

### watch

- ref 引用类型嵌套过深需要开启深度监听 {deep: true}
- reactive 默认是开启的
- 立即监听 {immediate: true}

监听一个

```js
import { ref, watch } from 'vue'
const message = ref('message')
watch(message, (newVal, oldVal) => {})
```

监听多个

```js
import { ref, watch } from 'vue'
const message = ref('message')
const msg = ref({ name: '张三', age: 18 })
watch([message, msg], (newVal, oldVal) => {}, {
  deep: true, // 深度监听
  immediate: true, // 立即监听
})
```

监听属性的单一值

```js
import { ref, watch } from 'vue'
const msg = ref({ name: '张三', age: 18 })
watch(
  () => msg.value.name,
  (newVal, oldVal) => {}
)
```

### watchEffect

- 默认会立即执行

```js
import { ref, watchEffect } from 'vue'
const msg = ref({ name: '张三', age: 18 })
const stop = watchEffect((oninvalidate) => {
  oninvalidate(() => {
    //监听之前执行函数
  })
  console.log(msg.value)
})
stop() //停止监听
```

## nextTick

视图更新是异步的，代码执行是同步的，所以需要等待视图更新完成后再执行下一步操作。

两种写法

```js
const send (){
  list.push({})
  nextTick(()=>{
    box.value.scrollTop = 999
  })
}

const send async(){
  list.push({})
  await nextTick()

  box.value.scrollTop = 999
}

```

## 编译宏

- defineProps 接收父组件传递过来的数据

- defineEmits 定义子组件触发的自定义事件

- defineOptions 定义组件 name `vue3.3`内置

- defineSlots 约束插槽，提供类型提示 只能接受 ts 类型 只有声明没有实现

## 组件通信

### defineProps defineEmits

父传子

父组件向子组件传递使用 `v-bind` 简写为 `:`

```vue
<template>
  <div>
    父组件
    <hr />
    <Children :name="name" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Children from './components/Children.vue'
const name = ref('张三')
</script>
```

子组件使用 `defineProps`接收

```vue
<template>
  <div>子组件</div>
  {{ name }}
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: 'world', // 默认值
  },
})
//-------------------------
const props = defineProps<{
  name: string //ts字面量定义类型
}>()
//-------------------------
const props = withDefaults(
  defineProps<{
    name: string
    title: string
  }>(),
  {
    name: () => 'world', // 默认值
  }
)
</script>
```

子传父

子组件通过 `defineEmits` 定义自定义事件，并通过 `emit` 触发事件

```vue
<template>
  <button @click="send">给父组件传值</button>
</template>

<script setup lang="ts">
const emit = defineEmits(['on-click']) //定义自定义事件
// const emit = defineEmits<{
//   (e: 'on-click', name: string, age: number): void
// }>()
const send = () => {
  //触发自定义事件
  emit('on-click', '值1', 123)
}
</script>
```

父组件通过 函数 接收子组件的自定义事件

```vue
<template>
  <div>
    父组件
    <hr />
    <Children @on-click="getName" />
  </div>
</template>

<script setup lang="ts">
import Children from './components/Children.vue'
const getName = (name: string, age: number) => {
  console.log(name, age)
}
</script>
```

### ref defineExpose

子组件通过 `defineExpose` 定义暴露给父组件的属性

```js
defineExpose({
  name: 'myName',
  fn: () => {},
})
```

父组件通过 `ref` 接收

```vue
<template>
  <div>
    父组件
    <hr />
    <Children ref="chidrenRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Children from './components/Children.vue'
const chidrenRef = ref<InstanceType<typeof Children>>()
onMounted(() => {
  console.log(chidrenRef.value?.name)
})
</script>
```

### 依赖注入 provide inject

父组件通过 `provide` 向下传递数据，子组件通过 `inject` 接收数据

子组件是可以修改值的，如果不想让子组件修改，可以将值设为只读`readonly`

```js
provide('name', name.value) //父组件
const name = inject('name') //子组件
```

### 发布订阅 EventBus

了解

### mitt

别人写好的发布订阅库

```bash
npm i mitt
```

main.ts

```js
import mitt from 'mitt'
const Mitt = mitt()

const app = createApp(App)
app.config.globalProperties.$Bus = Mitt
app.mount('#app')

declare module 'vue'{
  export interface ComponentCustomProperties {
    $Bus: typeof Mitt
  }
}
```

使用

```js
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()

// ----------发送消息--------------
const handleClick = () => {
  instance?.proxy?.$Bus.emit('on-click', 'hello world') //自定义事件
}

// ----------监听消息--------------
//监听自定义事件
instance?.proxy?.$Bus.on('on-click', (value) => {
  console.log(value)
})

// ----------删除监听--------------
instance?.proxy?.$Bus.off('on-click')

// ----------删除所有监听--------------
instance?.proxy?.$Bus.all.clear()
```

### v-model modelValue

父组件使用 `v-model` 绑定子组件，子组件使用`modelValue`接收

子组件使用 `emit` 发送 `update:modelValue` 事件

```js
defineProps<{ modelValue: number }>()

const emit = defineEmits(['update:modelValue'])
const click = () => {
  emit('update:modelValue', 1)
}
```

多 v-model

```vue
<template>
  <div>
    <A v-model="count" v-model:textValue="text" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import A from './components/A.vue'
const count = ref(0)
const text = ref('hello world')
</script>
```

```vue
<script setup lang="ts">
defineProps<{
  modelValue: number
  textValue: string
}>()

const emit = defineEmits(['update:modelValue', 'update:textValue'])
const click = () => {
  emit('update:modelValue', 1)
  emit('update:textValue', 'hello')
}
</script>
```

### 属性透传

```vue
<script setup lang="ts">
import { useAttrs } from 'vue'
const attrs = useAttrs()
console.log(attrs) //接收到props以外的内容
</script>
```

### 路由传参 query params

### 状态管理 vuex pinia

### 浏览器缓存 localStorage sessionStorage

### 挂载全局 app.config.globalProperties

### 挂载 window window.name 不推荐

## 组件

### 递归组件

父组件

```vue
<template>
  <div>
    <Tree :data="data"></Tree>
  </div>
</template>

<script setup lang="ts">
import Tree from './components/Tree.vue'
import { reactive } from 'vue'

interface Tree {
  name: string
  checked: boolean
  children?: Tree[]
}

const data = reactive<Tree[]>([
  { name: '1', checked: false },
  {
    name: '2',
    checked: false,
    children: [
      { name: '2-1', checked: false },
      {
        name: '2-2',
        checked: false,
        children: [
          { name: '2-2-1', checked: false },
          { name: '2-2-2', checked: false },
        ],
      },
    ],
  },
])
</script>

<style scoped></style>
```

Tree.vue

```vue
<template>
  <div @click.stop="click($event)" v-for="item in data" class="tree">
    <input type="checkbox" v-model="item.checked" />
    <span>{{ item.name }}</span>
    <!-- 递归,标签名为文件名 -->
    <Tree v-if="item?.children?.length" :data="item?.children"></Tree>
  </div>
</template>

<script setup lang="ts">
interface Tree {
  name: string
  checked: boolean
  children?: Tree[]
}
defineProps<{ data?: Tree[] }>()
</script>

<style scoped>
.tree {
  margin-left: 10px;
}
</style>
```

<img src="./img/tree.png"/>

如果要修改递归的标签名

- 新增一个`script`标签

```js
<script lang="ts">
export default {
  name: 'VT',
}
</script>
```

defineOptions 不用新增`script`标签

```js
<script setup lang="ts">
defineOptions({
  name: 'VT',
})
</script>
```

### 动态组件

一般用于 tab 栏切换

```vue
<template>
  <div>
    <div @click="switchCom(item, index)" v-for="item in data">
      <div>{{ item.name }}</div>
    </div>
  </div>
  <component :is="comId"></component>
</template>

<script setup lang="ts">
import { reactive, ref, markRaw, shallowRef } from 'vue'
import A from './components/A.vue'
import B from './components/B.vue'
import C from './components/C.vue'

const comId = shallowRef(A)

const data = reactive([
  { name: 'A组件', com: markRaw(A) },
  { name: 'B组件', com: markRaw(B) },
  { name: 'C组件', com: markRaw(C) },
])
const switchCom = (item, index) => {
  comId.value = item.com
}
</script>

<style scoped></style>
```

### 异步组件 Suspense

- 性能优化，异步组件在打包的时候会被单独拆出来

```vue
<template>
  <div>
    <Suspense>
      <template #default>
        <!-- 要展示的异步组件 -->
        <SyncVue></SyncVue>
      </template>
      <template #fallback>
        <!-- 加载中组件 -->
        <SkeletonVue></SkeletonVue>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const SyncVue = defineAsyncComponent(() => import('@/components/Sync.vue'))
import skeletonVue from '@/components/Skeleton.vue'
</script>
```

### 传送组件 Teleport

```vue
<template>
  <div>
    <Teleport :disabled="true" to="body">
      <A></A>
    </Teleport>
  </div>
</template>
```

### 缓存组件 keep-alive

keep-alive 包裹的组件，切换时不会重新渲染，提高性能

- keep-alive 缓存的组件，会多两个生命周期，onActivated(每次显示页面时触发)、onDeactivated(每次隐藏页面时触发)

- onUnmounted 生命周期则不会触发

```vue
<template>
  <!--include 缓存哪个组件 exclude 排除哪个组件 max 最大缓存数量  -->
  <keep-alive :include="['A', 'B']" :exclude="['C']" :max="10">
    <A />
    <B />
  </keep-alive>
</template>
```

### 动画组件 transition

- transition 过渡动画
- transition-group 过渡列表

https://animate.style/

https://gsap.com/

```vue
<template>
  <button>切换</button>
  <transition name="xxx">
    <!-- 可以包裹元素，组件 -->
    <div v-if="flag"></div>
  </transition>
  <transition-group>
    <!-- 包裹多个 -->
    <div v-for="(item, index) in list" :key="index"></div>
  </transition-group>
</template>
```

## 插槽

- 匿名插槽

```vue
<slot></slot>

<template v-slot></template>
<template #></template>
<template #default></template>
```

- 具名插槽

```vue
<slot name="header"></slot>

<template v-slot:header></template>
<template #header></template>
```

- 作用域插槽

```vue
<div v-for="(item, index) in data">
  <slot :index="index" :data="item"></slot>
</div>

<template v-slot="{ data, index }"></template>
<template #default="{ data, index }"></template>
```

- 动态插槽

```vue
<template>
  <div>
    <A>
      <template #[name]> 123 </template>
    </A>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import A from './components/A.vue'
const name = ref('header')
</script>
```

## 全局注册

main.ts

### 注册单个组件

```js
import WangEditor from '@/components/WangEditor'
const app = createApp(App)
app.component('WangEditor', WangEditor)
```

### 批量注册组件

```js
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

### 挂载方法

方法一

```js
import { download } from '@/utils/request'
const app = createApp(App)
app.config.globalProperties.download = download // 字符串、对象、函数

declare module 'vue'{
  export interface ComponentCustomProperties {
    $Bus: typeof Mitt,
    download: typeof download
  }
}
```

使用

```js
const instance = getCurrentInstance()
// const { proxy } = getCurrentInstance()
instance.proxy.parseTime()
```

方法二

```js
import { parseTime } from '@/utils'
const app = createApp(App)
app.provide('parseTime', parseTime)
```

使用

```js
const parseTime = inject('parseTime')
```

## 使用 tsx

```bash
npm i -D @vitejs/plugin-vue-jsx
```

vite.config.ts

```js
import vueJsx from '@vitejs/plugin-vue-jsx'
plugins: [vue(), vueJsx()]
```

使用方式

- v-show 支持
- ref template 需要.value
- v-if 不支持
- v-for 不支持
- v-bind 用{}代替
- 传参 (props,{emit,slots})
- v-model 支持

```tsx
// 返回一个渲染函数
export default function () {
  return <div></div>
}

// setup函数模式
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return () => <div></div>
  },
})
```

## 插件

### 自动引入 api

```bash
npm i -D unplugin-auto-import
```

vite.config.ts

```js
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts', // 声明文件的存放目录
    }),
  ],
})
```

## css

### 样式穿透

```css
:deep(.el-dialog__body) {
  padding-top: 10px;
}
```

### 动态 css

```vue
<template>
  <div>奶茶我今年几万块</div>
  <span>wnjwnw</span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const style = ref('red')
const style2 = ref({ color: 'pink' })
</script>

<style scoped>
div {
  color: v-bind(style);
}
span {
  color: v-bind('style2.color');
}
</style>
```

## 环境变量 env

- 开发环境下默认读取 `.env` `.env.development`
- 开发环境下默认读取 `.env` `.env.production`
- 定义环境变量要以 `VITE_` 开头

import.meta.env 自带的环境变量

```js
BASE_URL: '/'
DEV: true
MODE: 'development'
PROD: false
SSR: false
```

vite.config.ts 读取环境变量

```ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  console.log(mode) //开发环境
  console.log(loadEnv(mode, process.cwd())) //读取根目录下的.env/.env.development/env.production文件中的环境变量
  return defineConfig({
    plugins: [vue()],
  })
}
```
