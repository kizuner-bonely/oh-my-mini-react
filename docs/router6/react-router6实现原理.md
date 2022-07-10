## 1. 最简实现

首先来看一下最简使用范式

```tsx
import { BrowserRouter as Router, Routes, Route } from '@router'

export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="product" element={<Product />} />
      </Routes>
    </Router>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

function Product() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  )
}

```

从以上使用范式我们可以得到以下结论：

* 路由组件最外层要有 `<BrowserRouter>` 包裹；
* 被渲染的路由组件要由 `<Routes>` 包裹，用于确认渲染哪个路由组件
* 具体渲染的路由组件 `<Route>` 接收两个参数
  * `path` 表示渲染组件的路由
  * `element` 表示路由到此处时要渲染的组件

根据以上结论，可以确认以下目录结构

* BrowserRouter.tsx
* Routes.tsx
* Route.tsx

**BrowserRouter.tsx**

对于 `BrowserRouter`，在最简实现中先不管它的具体功能，直接把它的子节点渲染出来就好

```tsx
type BrowserRouterProps = {
  children: JSX.Element | JSX.Element[]
}

export function BrowserRouter(props: BrowserRouterProps) {
  const { children } = props
  return <>{children}</>
}
```

这个组件的最简实现很简单，但是值得注意的是对于它的 children 我们定义为 `JSX.Element | JSX.Element[]`，如果我们直接返回 children，会报 TS 错误，JSX.Element[] 不属于 React 组件渲染类型。

为了解决这个问题我们使用 Fragment 对它进行包裹即可。

**Routes.tsx**

这个组件的目的是将它的子组件 `Route` 进行筛选 ( 匹配路由 ) 和渲染。

为了更方便地实现这个目的，我们需要创建一种数据结构来管理，就像 vdom <-> DOM。

这里的实现是 RouteType <-> vdom。

```tsx
// router.d.ts
import type { ReactNode } from 'react'

export type RouteType = {
  path: string
  element: ReactNode
}

// useRoutes.ts
import type { RouteType } from './router.d'

export function useRoutes(routes: RouteType[]) {
  // todo: 暂时这么取当前路由地址
  const pathname = window.location.pathname
  
  return routes
  	.filter(r => pathname === r.path || pathname === `/${r.path}`)
  	.map(route => route.element)
}

// Routes.tsx
import { Children } from 'react'
import type { ReactNode } from 'react'
import type { RouteType } from './router.d'

type RoutesProps = {
  children: JSX.Element | JSX.Element[]
}

export function Routes(props: RoutesProps) {
  const { children } = props
  const routes = createRoutesFromChildren(children)

  const routesElements = useRoutes(routes)
  return <>{routesElements}</>
}

function createRoutesFromChildren(children: JSX.Element | JSX.Element[]) {
  const routes: RouteType[] = []
  
  Children.forEach(children, child => {
    const { element, path } = child.props
    const route: RouteType = { element, path }
    routes.push(route)
  })
  
  return routes
}
```

总结一下，Routes 的作用是对 Route 这个 ReactElement 进行抽象，过程如下所示：

1. `<Routes>` 通过对 `<Route>` 进行抽象管理成 `RouteType`，具体实现是通过 `createRoutesFromFiber()`生成 RouteType
2. 进过上步生成 RouteType 之后使用 `useRoutes()` 进行筛选要渲染的 element
3. 最后渲染筛选后的 routesElement  `return <>{routesElement}</>`

这里的 routesElement 是 JSX.Element[]，因此需要用这种空标签包裹方式达成渲染目的。

React.Children 是 react 提供给用于用来遍历子组件的 api，使用这个 api 会更加方便，不用我们手动判断子组件只有一个还是有多个，而且还帮忙解决了类型问题，当然手动处理也是可以的。

**Route.tsx**

具体的路由组件，对于这个组件我们不关心里面的内容，毕竟 `<Routes>` 最终是取传入这个组件的 `element` 进行渲染，这个组件的返回值稍微意思意思就行了。

```tsx
import type { RouteType } from './router.d'

export function Route(props: RouteType) {
  return <div />
}
```

至此，我们已经初步实现 react-router 了。





