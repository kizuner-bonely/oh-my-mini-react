## 1. redux 的最简实现

首先观察一下使用范式：

* index.tsx
* store.ts

**index.tsx**

```tsx
import { useCallback, useEffect, useReducer } from 'react'
import store from './store'

export default function ReduxExample() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const unsubscribe = store.subscribe(forceUpdate)
    return () => {
      unsubscribe()
    }
  }, [])

  const handleAdd = useCallback(() => {
    store.dispatch({ type: 'ADD' })
  }, [])

  return (
    <div>
      <h3>redux page</h3>
      <p>{store.getState()}</p>
      <button onClick={handleAdd}>add</button>
    </div>
  )
}
```

**store.ts**

```ts
import { createStore } from '@redux'

type ActionType = { type: 'ADD' | 'MINUS' }

function countReducer(state = 0, action: ActionType) {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}

const store = createStore(countReducer)
export default store
```

通过观察范式我们可以得出以下结论：

1. redux 暴露一个对象，里面有一个方法名为 `createStore`
2. `createStore` 接收一个 reducer 作为参数，并返回一个 `store` 对象
3. `store` 对象包含三个方法
   1. subscribe() 用于通知组件更新
   2. dispatch() 用于更新仓库状态值
   3. getState() 用于获取仓库值



**实现**

* redux.d.ts
* index.ts

**redux.d.ts**

```ts
export type ActionType = { type: any }

export type ReducerType = (state: any, action: type) => any

export type ListenerType = () => void
```

**index.ts**

```ts
import type { ReducerType, ListenerType, ActionType } from './redux.d'

export function createStore(reducer: ReducerType) {
  let state: any
  const listeners: Set<ListenerType> = new Set()
  
  function subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  
  function dispatch(action: ActionType) {
    // 1.更新仓库值
    state = reducer(state, action)
    // 2.通知组件更新
    listeners.forEach(listener => listener())
  }
  
  function getState() {
    return state
  }
  
  return { subscribe, dispatch, getState }
}
```

至此，基本 redux 就差不多实现完了。

为什么说是差不多？大家可以拿此时的代码运行一下可以发现，一开始 `store.getState()` 是 `undefined`，这个很明显，我们初始定义 `state` 是直接 let 声明。

那要怎么拿到初始值呢？

这时我们先观察一下 reducer 的实现:

```ts
function countReducer(state = 0, action: ActionType) {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}
```

可以看到在 `default` 这个 case 中是直接返回了初始值，因此我们只要随便 dispatch 一下就可以获取初始值了，为了不和用户命名的 `type` 重合，我们可以 dispatch 一个基本不可能重合的值，比如说和时间相关的。

**index.ts**

```ts
import type { ReducerType, ListenerType, ActionType } from './redux.d'

export function createStore(reducer: ReducerType) {
  let state: any
  const listeners: Set<ListenerType> = new Set()

  function subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function dispatch(action: ActionType) {
    // 1.更新仓库值
    state = reducer(state, action)
    // 2.通知组件更新
    listeners.forEach(listener => listener())
  }

  function getState() {
    return state
  }

  // ++++++++++++++++++++++++++++++++++++
  // 获取初始值
  dispatch({ type: `${performance.now()}` })
  // ++++++++++++++++++++++++++++++++++++

  return { subscribe, dispatch, getState }
}
```

至此，一个最简 redux 就终于实现了。接下来，我们会继续探讨 redux 怎么融入中间件以及中间件要怎么编写。



## 2. 中间件

### 2.1 聚合中间件 —— 增强 dispatch

上面的例子在同步 dispatch 的情况下是正常工作的，但是如果是异步呢，比如说：

```ts
const asyncMinus = () => {
  store.dispatch((dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'MINUS' })
    }, 0)
  })
}
```

这个时候就出问题了。

之前我们定义了 dispatch 的入参是一个对象，但传入函数的话显然走不通先前的路了。这个时候我们需要增强 dispatch，以适应更多功能。

用来创建 `store` 实例的方法 `createStore` 其实还有第二个参数，入参是 `applyMiddleware()`。

**applyMiddleware**

```ts
type MidAPI = {
  getState(): any
  dispatch: StoreType['dispatch']
}

type MiddlewareType = (midAPI: MidAPI) => (...args: any[]) => any

type StoreType = {
  getState(): any
  dispatch(action: ActionType, ...args: any[]): void
  subscribe(listener: ListenerType): () => void
}

type applyMiddleware = (...middlewares: MiddlewareType[]) => 
	(createStore: typeof createStore) => (reducer: ReducerType) => StoreType
```

在继续深入之前先理解一下这个参数的含义，首先我们的目标是加强 store.dispatch，所谓加强就是在执行原生 store.dispatch 之前先执行其他函数，再执行原生 store.dispatch。

为此，我们得先获取原生 store，再把 dispatch 提取出来，然后加强，最后再把加强后的 dispatch 替换原来的。还不懂的同学可以结合这句话和 `applyMiddleware` 的定义再捋捋。

**index.ts**

```ts
import type { ReducerType, ListenerType, ActionType } from './redux.d'
import { compose } from './utils'

export function createStore(reducer: ReducerType) {
  let state: any
  const listeners: Set<ListenerType> = new Set()

  function subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function dispatch(action: ActionType) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  function getState() {
    return state
  }

  dispatch({ type: `${performance.now()}` })

  return { subscribe, dispatch, getState }
}

export function applyMiddleware(...middlewares: MiddlewareType[]) {
  return (_createStore: typeof createStore) => (reducer: ReducerType) => {
    const store = _createStore(reducer)
    let dispatch = store.dispatch

    const midAPI = {
      getState: store.getState,
      dispatch: (action: ActionType, ...args: any[]) => dispatch(action, ...args)
    }

    const middlewareChain = middlewares.map(m => m(midAPI))

    dispatch = compose(...middlewareChian)(dispatch)

    return { ...store, diaptch }
  }
}
```

**utils.ts**

```ts
export function compose(...fns: Array<(...args: any[]) => any>) {
  if (!fns.length) return (args: any) => args
  if (fns.length === 1) return fns
  
  return fns.reducer((prevFn, curFn) => (...args: any[]) => prevFn(curFn(...args)))
}
```

加强 dispatch 的中间件，首先得有最基本的 dispatch 功能，因此需要一个 `midAPI` 用于分发给各个 dispatch。

每个中间件都拿到这个能力之后就需要用 compose 把各个中间件串联在一起 ( 自动串联调用 )。

对于 compose 函数，结合 index.ts 的上下文，第一个中间件接收的参数就是 store.dispatch。然后该中间件的执行结果返回给下一个中间件，以此类推。

**思考题1：index.ts 中的 midApi 中的 dispatch，可不可以换成 { dispatch: store.dispatch }**



### 2.2 实现中间件

这里演示两种中间件的演示方式：`redux-logger` 和 `redux-thunk`

* redux.d.ts
* logger.ts
* thunk.ts

**redux.d.ts**

```ts
export type StoreType = {
  getState(): any
  dispatch(action: ActionType, ...args: any[]): void
  subscribe(listener: ListenerType): () => void
}

type MidAPI = {
  getState(): any
  dispatch: StoreType['dispatch']
}

type NextType = (action: ActionType) => any

export type MiddlewareType = (midAPI: MidAPI) => (...args: any[]) => any
```

**logger.ts**

```ts
import type { ActionType, MidAPI, NextType } from '../redux.d'

export function logger(midAPI: MidAPI) {
  const { getState } = midAPI
  
  return (next: NextType) => (action: ActionType) => {
    console.log(
      `action ${
        (action as { type: string }).type
      } @ ${new Date().toLocaleTimeString()}`,
    )
    console.log('%c action', 'color: blue', action)
    const returnedVal = next(action)
    const nextState = getState()
    console.log('%c nextState', 'color: green', nextState)
    console.log('-----------------')
    
    return returnedVal
  }
}
```

**thunk**

```ts
import type { ActionType, MidAPI, NextType } from '../redux.d'

export function thunk(midAPI: MidAPI) {
  const { getState, dispatch } = midAPI
  
  return (next: NextType) => (action: ActionType) => {
    if (typeof action === 'function') return action(dispatch, getState)
    return next(action)
  }
}
```

实现完这两个中间件之后我们再回头来看下 `applyMiddleware` 的实现。

```ts
const middlewareChain = middlewares.map(m => m(midAPI))

这里 middlewareChain 的类型是一个数组，每个元素的数据格式如以下函数所示：
(next: NextType) => (action: ActionType) => any
```

```ts
dispatch = compose(...middlewareChian)(dispatch)

这里可以发现 next 指的就是 midAPI 中传入的 dispatch，整个中间件的返回值是最终要改变的状态 next(action) <-> dispatch(action)

而中间件的加强，就是在返回值以前所作的处理，如 logger 中的所有 console
```



## 3. combineReducers

在上面的示例中，我们只传入一个 reducer，但是在项目中通常会需要有多个状态管理，也就是多个 reducer，因此我们需要一个增强方法。

首先看一下使用范式，`combineReducers` 是在定义 store 的时候使用的

```ts
const store = createStore(combineReducers({ xx: xxReducer }), applyMiddleware(a, b))
```

在先前对于 `createStore` 的定义中，可以知道第一个参数的类型是 ReducerType，因此 combineReducer 的执行结果一定是 ReducerType。

**注意：redux 是一个轻量型框架，对于它的任何功能任何拓展最终形态都得是该功能的初始定义形态**。

**combineReducers.ts**

```ts
import type { ActionType, ReducerType } from './redux.d'

export function combineReducers(reducers: Record<string, ReducerType>) {
  // 经过上文的分析，可以知道这个 combination() 就是一个 reducer
  return combination(state: Record<string, any> = {}, action: ActionType) {
    // 下一状态
    const nextState: Record<string, any> = {}
    // 按需更新标志，如果为 false 表示状态没更新，返回当前状态避免组件更新
    let hasChanged = false
    
    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key]
      nextState[key] = reducer(state[key], action)
      hasChanged = hasChanged || state[key] !== nextState[key]
    })
    
    hasChanged = hasChanged || Object.keys(nextState).length !== Object.keys(state).length
    
    return hasChanged ? nextState : state
  }
}
```

`combineReducers` 道理非常简单，从原来的直接 `store.getState()` 变成  `store.getState().xxx`，说明现在的 state 是一个对象，这点在上面的类型定义也体现得非常清楚。

其次我们需要控制组件的更新，非必要不更新。更新判断标准如下：

* 其中有 reducer 的状态发生变化
* 前后状态数量不一致

如果不需更新，直接返回当前状态，这样浅比较对象的时候会判断相等，自然不会更新。



## 4. react-redux

经过上面的实现，我们已经基本实现了一个状态管理仓库。但组件应用的时候还不是很自然，比如说每个组件都要手动订阅，这个时候我们自然希望使用 redux 的组件能够更加自然，比如说仓库的状态值和 dispatch 可以通过组件的参数获取。

首先来看下使用范式：

```tsx
import type { StoreType } from '@redux/redux'
import { useCallback } from 'react'
import { Provider, connect } from '@redux/react-redux'
import { bindActionCreators } from '@redux'
import store from './store'

export default function ReduxExample() {
  return (
    <Provider store={store}>
      <ReduxExampleContent />
    </Provider>
  )
}

const mapStateToProps = (state: Record<string, any>) => {
  const { counter } = state
  return { counter }
}

//* 函数形式的 mapDispatchToProps
const mapDispatchToProps = (dispatch: StoreType['dispatch']) => {
  let creators = {
    add: () => ({ type: 'ADD' }),
    minus: () => ({ type: 'MINUS' }),
  }

  creators = bindActionCreators(creators, dispatch) as any
  return { dispatch, ...creators }
}

//* 对象形式的 mapDispatchToProps
// const mapDispatchToProps = {
//   add: () => ({ type: 'ADD' }),
//   minus: () => ({ type: 'MINUS' }),
// }

const ReduxExampleContent = connect(
  mapStateToProps,
  mapDispatchToProps,
)((props: any) => {
  const { counter, dispatch, add, minus } = props

  console.log(props)

  const manuallyAdd = useCallback(() => {
    dispatch({ type: 'ADD' })
  }, [])

  return (
    <div>
      <h3>ReactReduxPage</h3>
      <p>count: {counter}</p>
      <button onClick={add}>add</button>
      <button onClick={manuallyAdd}>manuallyAdd</button>
      <button onClick={minus}>minus</button>
    </div>
  )
})
```

通过观察范式我们可以得到以下结论：

* 在使用 redux 的组件需要被 redux 提供的 `Provider` 组件包裹

* 使用 redux 的组件需要调用 `connect` 方法

  * connect 的第一个参数是 `mapStateToProps`，它是一个函数，返回一个对象，这个对象就是想要的状态值

  * connect 的第二个参数是 `mapDispatchToProps`，它可以是一个对象，也可以是一个函数

    * 当其为对象是，其数据格式如下
      ```ts
      type MapDispatchToProps = Record<string, () => { type: string }>
      ```

    * 当其为函数时，接收 store.dispatch 作为参数，返回一个对象，这个对象是仓库的各个 dispatch 方法

      这时需要使用 `bindActionCreators` 手动对定义的 `creators` 包装



**bindActionCreators**

首先了解一下这个函数的作用，它接收的 creators 类似如下结构

```ts
let creators = {
  add: () => ({ type: 'ADD' }),
  minus: () => ({ type: 'MINUS' }),
}
```

我们可以看到这里并没有 dispatch，而要更新仓库状态值就必须 `dispatch(action)`，因此要对 creators 包装一下。

这个方法定义在 redux 中。

**redux/index.ts**

```ts
type Creators = Record<string, () => ({ type: string })>

export function bindActionCreators(creators: Creators, dispatch: StoreType['dispatch']) {
  const obj: Record<string, (...args: any[]) => ReturnType<StoreType['dispatch']>> = {}

  Object.keys(creators).forEach(k => {
    const creator = cerators[k]
    obj[k] = (...args) => dispatch(creator(...args))
  })

  return obj
}
```



**react-redux.tsx**

```tsx
type ProviderProps = { store: StoreType; children: JSX.Element | JSX.Element[] }

type MapStateToProps = (state: Record<string, any>) => Record<string ,any>

type MapDispatchToProps =
	| Record<string, any>
	| (dispatch: StoreType['dispatch']) => Record<string, any>

const StoreContext = createContext<StoreType>({} as StoreType)

export function Provider(props: ProviderProps) {
  const { store, children } = props
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
}

export function connect(mapStateToProps: MapStateToProps, mapDispatchToProps: MapDispatchToProps) {
  return (WrappedComponent: any) => (props: Record<string, any>) => {
    const { getState, dispatch, subscribe } = useContext(StoreContext)
    const forceUpdate = useForceUpdate()
    
    const stateProps = mapStateToProps(getState())
    
    let dispatchProps: Record<string, any> = { dispatch }
    
    if (typeof mapDispatchToProps === 'function') {
      dispatchProps = mapDispatchToProps(dispatch)
    } else if (typeof mapDispatchToProps === 'object') {
      dispatchProps = bindActionCreators(mapDispatchtoProps)
    }
    
    useLayoutEffect(() => {
      const unsubscribe = subscribe(forceUpdate)
      return () => {
        unscuscribe()
      }
    }, [])
    
    return <WrappedComponent {...props} {...stateProps} />
  }
  
}

function useForceUpdate() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  return forceUpdate
}
```

至此，react-redux 就基本实现完毕了。

总结一下，react-redux 整体通过 context 使得项目的组件可以拿到全局的仓库，Provider 就是 context.Provider，而接收 context 方法在 connect 中实现，并把相关值通过 props 的形式传给被包装的组件。

有一点值得注意的是，如果 mapDispatchToProps 是函数，那得手动使用 `bindActionCreators` 对自定义 creators 进行包装；而如果是对象形式，不是不需要包装了，只是我们在 connect 里面帮忙处理了，因此在调用层用户感知不到。

**思考题2：connect() 的实现中，能否将 useEffect 替换成 useLayoutEffect**



## 5. react-redux 的 hooks

经过上面的时候，我们可以使用 `connect` 这个高阶函数自动订阅，从而让组件能够在参数中拿到状态值和 dispatch。而在函数组件盛行的今天，我们需要 hooks 来更好地帮助我们在函数组件中完成订阅。

这里介绍两个 api 用于 `获取` 和 `改变` 仓库值。

* **useSelector()**   用于获取状态
* **useDispatch()**  用于获取 dispatch

首先观察一下使用范式

```tsx
function ReduxHookExampleContent() {
  const counter = useSelector(({ counter }) => counter)
  const dispatch = useDispatch()

  const add = useCallback(() => {
    dispatch({ type: 'ADD' })
  }, [])

  return (
    <div>
      <h3>ReduxHookExampleContent</h3>
      <p>count: {counter}</p>
      <button onClick={add}>add</button>
    </div>
  )
}
```

通过示例我们可以得到以下结论：

* useSelector() 接收一个函数，它接收一个参数 —— 仓库状态值，它的返回值用于展示在 UI 层
* useDispatch() 直接返回 store.dispatch

**react-redux.tsx**

```tsx
// ... 上文 react-redux.ts 的内容

type Selector = (state: ReturnType<StoreType['getState']>) => any

export function useSelector(selector: Selector) {
  const { getState, subscribe } = useContext(StoreContext)
  
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    const unsubscribe = subscribe(forceUpdate)
    return () => {
      unsubscribe()
    }
  }, [])
  
  return selector(getState())
}

export function useDispatch() {
  const { dispatch } = useContext(StoreContext)
  return dispatch
}
```

至此，我们就可以用 hooks 来实现对 redux 的订阅和更新了。

需要注意的是在获取状态之后记得使组件更新。

**React 18 版本的订阅更新**

在 React 18 有一个 hook api 可以帮助我们更好地完成外部状态的订阅更新，它就是 [`useSyncExternalStore`](https://www.npmjs.com/package/use-sync-external-store)。

以下是它的类型声明。

```ts
/**
  * @param subscribe
  * @param getSnapshot
  *
  * @see https://github.com/reactwg/react-18/discussions/86
*/
// keep in sync with `useSyncExternalStore` from `use-sync-external-store`
export function useSyncExternalStore<Snapshot>(
subscribe: (onStoreChange: () => void) => () => void,
 getSnapshot: () => Snapshot,
 getServerSnapshot?: () => Snapshot,
): Snapshot;
```

根据它的类型声明，我们可以将 useSelector 改写成以下形式

```ts
type Selector = (state: ReturnType<StoreType['getState']>) => any

export function useSelector(selector: Selector) {
  const { getState, subscribe } = useContext(StoreContext)
  
  const forceUpdate = useForceUpdate()
  const state = useSyncExternalStore(() => subscribe(forceUpdate), getState)
  
  return selector(state)
}
```











## 思考题参考答案

**思考题1：index.ts 中的 midApi 中的 dispatch，可不可以换成 { dispatch: store.dispatch }**

```
不可以。

思考 JS 中函数的存储位置，如果改成

const midAPI = { getState: store.getState, dispatch: store.dispatch }

那每个中间件接收到的 dispatch 都指向同一个，而写成

(action: ActionType, ...args: any[]) => dispatch(action, ...args)

那每个中间件拿到的 dispatch 都不一样，这样就能继承之前中间件的加强效果了。

```

**思考题2：connect() 的实现中，能否将 useEffect 替换成 useLayoutEffect**

```
不可以。

对于订阅方法，必须使用 DOM 提交之后马上执行的 useLayoutEffect，否则有可能会出现初始值没渲染出来的情况。

复习一下 react 在 commit 阶段的步骤
	1. 在 DOM 提交前执行 useEffect，这个方法是异步的
	2. 提交 DOM
	3. 执行 useLayoutEffect，这个方法是同步的
	
我们必须在 DOM 挂载之后马上进行订阅，以确保不漏过初始值。
```

