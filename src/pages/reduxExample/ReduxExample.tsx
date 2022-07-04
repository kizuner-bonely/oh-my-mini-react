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
