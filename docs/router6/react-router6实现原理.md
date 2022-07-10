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



## 2. 实现路由切换

在实现这个功能之前，先完善一下 demo。

```tsx
import { BrowserRouter as Router, Routes, Route, Link } from '@router'
import styles from './router.module.less'

export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="product" element={<Product />} />
        </Route>
      </Routes>
    </Router>
  )
}

function Layout() {
  return (
    <div className={styles.layout}>
      <Link to="/">首页</Link>
      <Link to="/product">商品</Link>

      {/* <Outlet /> */}
    </div>
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

为了渲染子路由，需要用到 `<Outlet>`，但实现路由切换暂时不需要这个功能，这里只专心于路由切换。

目前为止，最简 router 的实现结构如下所示：

![image-20220710215929433](img/router最简实现结构.png)

实现路由跳转最终肯定是由 a 标签实现，在 router 中的表现即为 `<Link />`。

在 `<Link />` 中为了实现路由跳转，我们需要借助 history 库。又由于在一个项目中，我们需要一个统一的路由管理，就像 redux 一样，在全局只需要实例化一个仓库，因此我们也需要在根组件实现 history 实例，然后通过 context 传给它的子组件。

因此我们有了如下新的结构：

![image-20220710220820071](img/router架构2.png)



这里新增了一个 `<Router>`，是为了方便管理 `router-context`，因为 `BrowserRouter` 和 `HashRouter` 使用的 history 实例方法是不一样的。

在目前的实现中，我们先只关心 BrowserRouter。

* routerContext.ts
* BrowserRouter.tsx
* Router.tsx
* Routes.tsx
  * useRoutes.ts
* Route.tsx
* Link.tsx
  * useNavigate.ts

**router.d.ts**

```ts
import type { ReactNode } from 'react'

export type RouteType = {
  path: string
  element: ReactNode
  children?: RouteType[]
}
```

**routerContext.ts**

```ts
import type { BrowserHistory } from 'history'
import { createContext } from 'react'

type RouterService = {
  navigator: BrowserHistory
}

export const RouterContext = createContext<RouterService>({} as RouterService)
```

这里定义了 router-context 的内容，整体就是创建了一个 context。

需要注意的是这里给了一个默认值只是为了不让 ts 报错，具体的赋值得在 `<Router>` 中实现。

**BrowserRouter.tsx**

```tsx
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { createBrowserHistory } from 'history'
import { Router } from './Router'

type BrowserRouterProps = {
  children: ReactNode
}

export function BrowserRouter(props: BrowserRouterProps) {
  const { children } = props
  
  const navigator = useRef(createBrowserHistory()).current
  
  return <Router navigator={navigator}>{children}</Router>
}
```

如果是 `<HashRouter>`，就得用哈希路由的方法。

`ReactNode` 是 React 定义的一个类型，它表示 React 的所有子节点类型，包括一般的组件、字符串、数字、undefined、null 等等。一般 children 直接用这个类型非常方便，但是如果是用组件的表现形式，比如 `<children />`，就得写成 `JSX.Element`，因为字符串、数字等类型都不能作为 React 组件解析。

**Router.tsx**

```tsx
import type { BrowserHistory } from 'history'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { RouterContext } from './routerContext'

type RouterProps = {
  navigator: BrowserHistory
  children: ReactNode
}

export function Router(props: RouterProps) {
  const { navigator, children } = props
  const routerService = useRef({ navigator }).current
  
  return (
  	<RouterContext.Provider value={routerService}>
    	{children}
    </RouterContext.Provider>
  )
}
```

**Routes.tsx**

在编写组件之前先回顾最新的 demo，可以发现 `<Routes>` 是可以嵌套使用的，因此我们在这里需要处理嵌套路由的情况。

```tsx
export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="product" element={<Product />} />
        </Route>
      </Routes>
    </Router>
  )
}
```

```tsx
import { Children } from 'react'
import { useRoutes } from './useRoutes'
import type { RouteType } from './router.d'

type RoutesProps = {
  children: JSX.Element | JSX.Element[]
}

export function Routes(props: RoutesProps) {
  const { children } = props
  const routes = createRoutesFromChildren(children)
  
  const routesElement = useRoutes(routes)
  return <>{routesElement}</>
}

function createRoutesFromChildren(children: JSX.Element | JSX.Element[]) {
  const routes: RouteType[] = []
  
  Children.forEach(children, child => {
    const { children, element, path } = child.props as RouteType & {
      children?: JSX.Element | JSX.Element[]
    }
  	const route: RouteType = { element, path }
    
    // ++++++++++++++++++++++++++++++++++++++++++++++++++
    if (children) {
      route.children = createRoutesFromChildren(children)
    }
    // ++++++++++++++++++++++++++++++++++++++++++++++++++
    
    routes.push(route)
  })
  
  return routes
}
```

**useRoutes.ts**

```ts
import type { RouteType } from './router.d'

export function useRoutes(routes: RouteType[]) {
  const pathname = window.location.pathname
  
  return routes
  	// 渲染子路由的时候必渲染父路由，如果只用全等来判断只能匹配路由名完全相等的
  	.filter(r => pathname.startsWith(r.path))
  	.map(route => route.element)
}
```

**Route.tsx**

```tsx
import type { RouteType } from './router.d'

export function Route(props: RouteType) {
  return <div />
}
```

这个组件依然没发生变化，因为我们不关心其返回值。

**Link.tsx**

```tsx
import type { MouseEvent } from 'react'
import { useCallback } from 'react'
import { useNavigate } from './useNavigate'

type LinkProps = {
  to: string
  children: string
}

export function Link(props: LinkProps) {
  const { children, to } = props
	const navigate = useNavigate()
  
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      navigate(to)
  	},
    [to]
  )

  return (
  	<a href={to} onClick={handleClick}>
    	{children}
    </a>
  )
}
```

路由跳转组件本质还是 a 标签，但是我们得做些改变。

首先要防止默认行为，点击 a 标签默认会刷新，这样会造成不必要的资源请求。

其次是利用 history 实例实现路由的跳转。

**useNavigate.ts**

```ts
import { useContext } from 'react'
import { RouterContext } from './routerContext'

export function useNavigate() {
  const { navigator } = useContext(RouterContext)
  return navigator.push
}
```



至此我们已经能实现基本的路由跳转了，但是路由组件还没渲染出来，这个后面接着实现。







