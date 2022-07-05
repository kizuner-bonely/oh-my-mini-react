## redux 的最简实现

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





