# router

中文文档 https://baimingxuan.github.io/react-router6-doc/

## 安装

```bash
npm install react-router-dom
```

## 配置

router/index.tsx

```tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import Home from '../pages/Home'
import Error from '../pages/Error'
import UserDetail from '../pages/UserDetail'
import Layout from '../pages/Layout'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true, //默认子路由
        element: <Home />,
      },
      {
        path: '/user/:id', //动态路由
        // element: <UserDetail />,
        lazy: async () => {
          //懒加载
          const userDetail = (await import('../pages/UserDetail')).default
          return {
            Component: userDetail,
          }
        },
      },
    ],
  },

  { path: '*', element: <Error /> }, //没有匹配到的路由到错误页
]

const router = createBrowserRouter(routes)

export default router
```

App.tsx

```tsx
<RouterProvider router={router}></RouterProvider>
```

Layout.tsx

```tsx
<Outlet /> //路由出口
```

## 路由跳转

### Link

```tsx
import { Link } from 'react-router-dom'
;<Link to={'/user/1'}>到userDetail页</Link>
```

### useNavigate

```tsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/user/1')
```

## Hook

### useParams /

获取路由`/`后面的参数

```tsx
import { useParams } from 'react-router-dom'
const { id } = useParams()
```

### useSearchParams ?

获取路由`?`后面的参数

```tsx
import { useSearchParams } from 'react-router-dom'
const [searchParams] = useSearchParams()
const id = searchParams.get('id')
```

```tsx
//如果路由是这种参数
/user?ids=1&ids=2&ids=3
//那么可以这样写
const ids = searchParams.getAll('ids')
//得到的ids是[1,2,3]
```

### useNavigate

路由跳转

```tsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/user/1')
```

### useLocation

获取当前路由信息

```tsx
import { useLocation } from 'react-router-dom'
const location = useLocation()
console.log(location) //当前路由的详细信息
```

### useMatch

不怎么用
