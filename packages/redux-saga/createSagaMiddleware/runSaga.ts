// @ts-nocheck
import type { SagaMiddleware } from '../saga.type'

export function runSaga(
  { getState, dispatch }: SagaMiddleware,
  saga,
  ...args: any[]
) {
  const iterator = saga(...args)
  proc({ getState, dispatch }, iterator)
}

function proc(env: SagaMiddleware, iterator: Generator<any>) {
  next()

  function next(arg: any, hasErr: boolean) {
    let result: IteratorResult<any>
    if (hasErr) {
      result = iterator.throw(arg)
    } else {
      result = iterator.next(arg)
    }

    if (!result.done) {
      digestEffect(result.value, next)
    }
  }

  function digestEffect(effect: any, cb: (...args: any[]) => any) {
    let effectSettled: boolean
    function currentCB(res: IteratorResult<any>, hasError: boolean) {
      if (effectSettled) return
      effectSettled = true
      cb(res, hasError)
    }
  }
}
