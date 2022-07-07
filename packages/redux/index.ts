import type {
  ActionType,
  ListenerType,
  MiddlewareType,
  ReducerType,
  StoreType,
} from './redux.d'
import { logger, thunk } from './middlewares'
import { combineReducers } from './combineReducers'
import { compose } from './utils'

function createStore(
  reducer: ReducerType,
  enhancer?: ReturnType<typeof applyMiddleware>,
): StoreType {
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState: any
  const listeners: Set<ListenerType> = new Set()

  function getState() {
    return currentState
  }

  function dispatch(action: ActionType) {
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
  }

  function subscribe(listener: ListenerType) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  dispatch({ type: `${performance.now()}` })

  return { getState, dispatch, subscribe }
}

function applyMiddleware(...middlewares: MiddlewareType[]) {
  return (_createStore: typeof createStore) => (reducer: ReducerType) => {
    const store = _createStore(reducer)
    let dispatch = store.dispatch

    const midAPI = {
      getState: store.getState,
      dispatch: (action: ActionType, ...args: any[]) =>
        dispatch(action, ...args),
    }

    const middlewareChain = middlewares.map(m => m(midAPI))

    //* 加强版的 dispatch: 执行所有中间件之后执行原版 dispatch
    dispatch = compose(...middlewareChain)(store.dispatch)

    return { ...store, dispatch }
  }
}

function bindActionCreators(
  creators: Record<string, () => Record<string, any>>,
  dispatch: StoreType['dispatch'],
) {
  const obj: Record<string, ReturnType<typeof bindActionCreator>> = {}

  Object.keys(creators).forEach(key => {
    const creator = creators[key]
    obj[key] = bindActionCreator(creator, dispatch)
  })

  return obj
}

function bindActionCreator(
  creator: (...args: any[]) => Record<string, any>,
  dispatch: StoreType['dispatch'],
) {
  return (...args: any[]) => dispatch(creator(...args) as any)
}

export {
  createStore,
  applyMiddleware,
  logger,
  thunk,
  combineReducers,
  bindActionCreators,
}
