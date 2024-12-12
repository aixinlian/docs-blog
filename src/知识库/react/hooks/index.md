# Hooks

## useState

### 基本用法

```tsx
const [state, setState] = useState(initialState)
```

- 返回数组的原因是数组里的名字可以自定义

- 使用 setState 更新 state，调用 set 函数会更新组件的 state，并触发组件的重新渲染。

- set 函数为异步任务

- initialState 可以为一个函数，只会执行一次

### 示例

基本数据类型

```tsx
import { FC, useState } from 'react'

const App: FC = () => {
  const [count, setCount] = useState(0)
  const [str, setStr] = useState('hello')

  const handleChange = () => {
    setCount((prev) => prev + 1)
    setStr('hello world')
  }

  return (
    <div>
      <h1>
        {count} - {str}
      </h1>
      <button onClick={() => handleChange()}>修改值</button>
    </div>
  )
}

export default App
```

复杂数据类型

| 避免使用(会改变原数组)     | 推荐使用(会返回一个新数组)  |
| -------------------------- | --------------------------- |
| 添加元素 push,unshift      | concat,[...arr]             |
| 删除元素 pop,shift,splice  | filter,slice                |
| 替换元素 splice.arr[i]=... | map                         |
| 排序元素 reverse,sort      | 先复制，再使用 reverse,sort |
| 修改对象                   | 赋值，Object.assign         |

```tsx
import { FC, useState } from 'react'

const App: FC = () => {
  const arr = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Johns' },
    { id: 3, name: 'Johnr' },
  ]

  const [data, setData] = useState(arr)

  const handlePush = () => {
    setData([...data, { id: data.length + 1, name: 'John' }])
  }

  return (
    <div>
      <div>
        {data.map((item) => (
          <div>{item.name}</div>
        ))}
      </div>
      <button onClick={() => handlePush()}>push</button>
    </div>
  )
}

export default App
```

## useReducer

### 基本用法

```tsx
const [state, dispatch] = useReducer(reducer, initState, initAction?)
```

- 如果有 initAction，则先执行一遍 initAction，返回的值作为 state 的初始值，如果没有则直接使用 initState 作为初始值

- 刚进来页面不会执行 reducer，只有 dispatch 才会触发 reducer

- reducer 接收两个参数，第一个参数为上一次的 state，第二个参数为 dispatch 传入的 action

### 示例

```tsx
import { FC, useReducer } from 'react'

const App: FC = () => {
  const initState = {
    count: -1,
  }
  type State = typeof initState
  const initAction = (state: State) => {
    return { count: Math.abs(state.count) }
  }
  const reducer = (state: State, action: { type: 'add' | 'sub' }) => {
    switch (action.type) {
      case 'add':
        return { count: state.count + 1 }
      case 'sub':
        return { count: state.count - 1 }
    }
  }
  const [state, dispatch] = useReducer(reducer, initState, initAction)
  return (
    <div>
      <button onClick={() => dispatch({ type: 'add' })}>+1</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'sub' })}>-1</button>
    </div>
  )
}

export default App
```

immer use-immer 两个包使用 useReducer 更加方便

```tsx
//import { useImmerReducer } from 'use-immer'
//const [state, dispatch] = useImmerReducer(reducer, initState, initAction)
//用immer包裹之后，可以直接修改值(state.name='小草')，而不是要这样({...state,name:'小草'})，不用返回一个新的对象来覆盖他
```

## useSyncExternalStore

- 订阅外部 store 例如(redux,zustand)
- 订阅浏览器 API 例如(online,storage,location)等
- 抽离逻辑，编写自定义 hooks

### 基本用法

```tsx
const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- subscribe：用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。
- getSnapshot：获取当前数据源的快照（当前状态）。
- getServerSnapshot?：在服务器端渲染时用来获取数据源的快照。

## useTransition

### 基本用法

```tsx
const [isPending, startTransiton] = useTransition()
```

- useTransition 是性能优化的 hook,用的较少
- 如果希望更新数据的时候不阻塞 UI，可以将更新操作放在 startTransiton()中进行过渡，过渡中 isPending 为 true
- 函数里不可写异步，必须始终保持同步
- 不适合过渡输入框的值

### 示例

```tsx
import React, { useTransition, FC, useState } from 'react'
import { Input, List } from 'antd'

interface Item {
  id: number
  address: string
  name: string
}

export const TransitionExample: FC = () => {
  const [value, setValue] = useState('')
  const [list, setList] = useState<Item[]>([])
  const [isPending, startTransiton] = useTransition()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    fetch('/api/list?keyWord=' + value).then((res) => {
      res.json().then((data) => {
        startTransiton(() => {
          setList(data.list)
        })
      })
    })
  }
  return (
    <>
      <h1>Transition Example</h1>
      <Input
        value={value}
        onChange={(e) => {
          handleChange(e)
        }}></Input>
      {isPending && <div>加载中...</div>}
      <List
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}></List>
    </>
  )
}
```

## useDeferredValue

跟防抖节流的区别

useDeferredValue 更适合优化渲染，因为他与 React 集成的，并且能够适应用户的设备

useDeferredValue 不需要任何固定的延迟时间，如果用户设备快，他就快，用户设备慢他就慢

### 基本用法

```tsx
const deferredValue = useDeferredValue(value)
```

### 示例

```tsx
const [keyWord, setKeyWord] = useState('')
const deferredValue = useDeferredValue(keyWord)
//会有一个过渡时间，如果keyWord与deferredValue不相等，表示正在过渡，如果相等表示过渡完成
//过渡中可以添加一个不透明度，过渡完成的时候不透明度变为1
```

## useEffect

### 基本用法

```tsx
useEffect(setup, dependencies?)
```

- setup 为处理函数，dependencies 为依赖项
- setup 返回一个清理函数，在组件卸载的时候会执行清理函数
- useEffect 在组件渲染完毕之后执行，异步执行不阻塞
- useLayoutEffect 在组件将要被渲染的时候执行，同步执行会阻塞

### 示例

```tsx
import { FC, useEffect, useState } from 'react'
import { Button } from 'antd'

export const EffectComponent: FC = () => {
  const [state, setState] = useState(0)
  useEffect(() => {
    console.log(state)
  }, [])
  const updateValue = () => {
    const value = Math.random() * 10
    setState(value)
  }
  return (
    <>
      <h1>effect组件</h1>
      <span>state的值：{state}</span>
      <Button onClick={() => updateValue()}>修改值</Button>
    </>
  )
}
```

## useLayoutEffect

### 基本用法

```tsx
useLayoutEffect(setup, dependencies?)
```

- setup 可以 return 一个清理函数
- useEffect 在组件渲染完毕之后执行，异步执行不阻塞
- useLayoutEffect 在组件将要被渲染的时候执行，同步执行会阻塞

## useRef

- 获取 DOM 元素
- 数据存储

### 基本用法

```tsx
const refValue = useRef(initialValue)
refValue.current
```

- 组件在重新渲染的时候，useRef 的值不会被重新初始化。
- 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
- useRef 的值不能作为 useEffect 等其他 hooks 的依赖项，因为它并不是一个响应式状态。
- useRef 不能直接获取子组件的实例，需要使用 forwardRef。

### 示例

获取 DOM 元素

```tsx
import React, { FC, useRef } from 'react'
import { Button } from 'antd'

const App: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const handleClick = () => {
    ref.current!.style.backgroundColor = 'red'
  }
  return (
    <>
      <div ref={ref}>我是div标签</div>
      <Button onClick={() => handleClick()}>获取ref</Button>
    </>
  )
}

export default App
```

数据存储

```tsx
import React, { FC, useRef, useState } from 'react'
import { Button } from 'antd'

const App: FC = () => {
  const [count, setCount] = useState(0)
  let num = useRef(0)
  const handleClick = () => {
    setCount(count + 1)
    num.current = count
  }
  return (
    <>
      <div>旧值：{num.current}</div>
      <div>新值：{count}</div>
      <Button onClick={() => handleClick()}>+1</Button>
    </>
  )
}

export default App
```

## useImperativeHandle

- 编写子组件的时候，通过 useImperativeHandle 暴露给父组件实例

:::tip
18 版本与 19 版本有些不同
18版本需要用forwardRef包裹子组件

19版本，子组件直接进行解构接收ref const Children = ({ref}:{ref:React.Ref})=>{}
:::

### 基本用法

```tsx
useImperativeHandle(ref, () => {
  return {
    // 暴露给父组件的方法或属性
  }
}, dependencies?)
```

### 示例

```tsx
import React, { FC, useRef, useState, useImperativeHandle } from 'react'
import { Button, Input, Divider } from 'antd'

const App: FC = () => {
  const childrenRef = useRef(null)
  const handleQuery = () => {
    console.log(childrenRef.current)
  }
  return (
    <div>
      <p>父组件</p>
      <Button onClick={() => handleQuery()}>获取子组件</Button>
      <Divider />
      <p>子组件</p>
      <Children ref={childrenRef} />
    </div>
  )
}

const Children = React.forwardRef((props, ref) => {
  const [value, setValue] = useState('')
  useImperativeHandle(ref, () => value)
  return <Input value={value} onChange={(e) => setValue(e.target.value)}></Input>
})

export default App
```

## useContext

## memo

防止组件重新渲染

### 基本用法

```tsx
import React, { memo } from 'react'

const MemoComponent = memo(() => {})
```

### 示例

```tsx
import React, { memo, useState } from 'react'
import { Button } from 'antd'

const App = () => {
  console.log('app')
  const [count, setCount] = useState(0)

  return (
    <>
      <Button onClick={() => setCount((prev) => prev + 1)}>+1</Button>
      <Children />
    </>
  )
}

const Children = memo(() => {
  console.log('children')

  return <div>children</div>
})

export default App
```

## useMemo

- 计算属性，缓存计算结果，避免重复计算

React.memo

- 子组件接收 props 参数，不管 props 哪个参数变化，都会重新渲染子组件
- 子组件用 React.memo 包裹起来，可以优化渲染，只有当接收的 props 变化时才重新渲染子组件

### 基本用法

```tsx
const memoizedValue = useMemo(callback, dependencies?)
```

### 示例

```tsx
import React, { FC, useState, useEffect, useMemo } from 'react'
import { Button } from 'antd'

export const Father: FC = () => {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  const tips = useMemo(() => {
    console.log('重新计算了tips')
    return flag ? <p>哪里贵了，不要睁着研究说瞎话好不好</p> : <p>这些年没有努力工作，工资涨没涨</p>
  }, [flag])

  return (
    <>
      <h1>Count值：{count}</h1>
      <h1>Flag值：{flag.toString()}</h1>
      {tips}
      <Button onClick={() => setCount((prev) => prev + 1)}>+1</Button>
      <Button onClick={() => setFlag((prev) => !prev)}>Toggle</Button>
      <Child num={count} />
    </>
  )
}

//子组件用React.memo包裹起来
const Child: FC<{ num: number }> = React.memo(({ num }) => {
  useEffect(() => {
    console.log('重新渲染了子组件')
  })
  return (
    <>
      <p>----------------------------------</p>
      <span>子组件接收的参数：{num}</span>
    </>
  )
})
```

## useCallback

## useDebugValue

## useId

## 自定义 Hooks
