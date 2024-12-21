# 记录

## null 和 undefined 的区别

null 表示空对象，未来会赋值一个对象

undefined 表示一个属性没有定义，或者是缺少值，此处应该有值但是还没有被定义

null 表对象，undefined 表属性

```js
const obj = null
obj = { name: 'John' }

const obj = { name: 'myName' }
obj.age = undefined
obj.address // undefined
```

## 过滤对象中的某个属性

```js
const state = {
  name: 'John',
  age: 30,
  price: 100,
}
Object.fromEntries(Object.entries(state).filter(([key]) => !['price'].includes(key)))
```

## row,col 的响应式

```js
// col 组件的响应式，row 中有 4 个 col
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
}
```
