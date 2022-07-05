import type { ActionType, MidAPI, NextType } from '../redux.d'

export function thunk(midAPI: MidAPI) {
  const { getState, dispatch } = midAPI

  return (next: NextType) => (action: ActionType) => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
}
