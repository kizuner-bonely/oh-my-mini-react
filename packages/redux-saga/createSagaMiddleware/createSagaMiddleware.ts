// @ts-nocheck
import { SagaMiddleware, ActionType, NextType } from '../saga.type'
import { runSaga } from './runSaga'

export function cerateSagaMiddleware() {
  let boundRunSaga: typeof runSaga
  function sagaMiddleware({ getState, dispatch }: SagaMiddleware) {
    boundRunSaga = runSaga.bind(null, { getState, dispatch })
    return (next: NextType) => (action: ActionType) => {
      const result = next(action)
      return result
    }
  }

  sagaMiddleware.run = (...args: any[]) => {
    boundRunSaga(...args)
  }

  return sagaMiddleware
}
