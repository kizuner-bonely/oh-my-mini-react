import { ActionType, ReducerType } from './redux.d'

export function combineReducers(reducers: Record<string, ReducerType>) {
  return function combination(
    state: Record<string, ReducerType> = {},
    action: ActionType,
  ) {
    const nextState: Record<string, any> = {}
    let hasChanged = false

    //* 1.更新状态
    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key]
      nextState[key] = reducer(state[key], action)
      // 如果以前遍历的 reducer 为 true，则肯定是要更新了
      hasChanged = hasChanged || nextState[key] !== state[key]
    })

    //* 按需更新
    // eg. { a: 1 } => { a: 1 }
    // eg. { a: 1, b: 2 } => { a: 1 }
    hasChanged =
      hasChanged || Object.keys(nextState).length !== Object.keys(state).length

    //* 如果状态值有改变就用新的，否则用旧的
    return hasChanged ? nextState : state
  }
}
