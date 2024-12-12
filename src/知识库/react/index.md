# react

## 创建项目

```bash
npm create vite
```

## 快捷键

- `rfc`

```tsx
import React from 'react'

export default function Demo() {
  return <div></div>
}
```

- `rfce`

```tsx
import React from 'react'

function Demo() {
  return <div></div>
}

export default Demo
```

- `rafc`

```tsx
import React from 'react'

export const Demo = () => {
  return <div>Demo</div>
}
```

## 样式复用

```tsx
import React, { CSSProperties, useState } from 'react'

const App = () => {
  const [mystyle, setMystyle] = useState<CSSProperties>({
    color: 'blue',
    fontSize: '16px',
  })

  const tyleObj: CSSProperties = {
    color: 'red',
    fontSize: '20px',
  }

  const changeStyle = () => {
    setMystyle({ ...mystyle, color: 'green' })
  }

  return (
    <>
      <div style={tyleObj}>Hello World</div>
      <div style={mystyle} onMouseEnter={changeStyle}>
        Hello World
      </div>
    </>
  )
}

export default App
```

## Fragment

防止出现多余的包裹元素
