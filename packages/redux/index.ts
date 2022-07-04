import { ActionType, ListenerType, ReducerType } from './redux.d'

export default function createStore(reducer: ReducerType) {
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

export { createStore }
