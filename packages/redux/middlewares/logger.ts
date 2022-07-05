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
