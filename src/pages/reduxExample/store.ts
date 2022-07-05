import { createStore, applyMiddleware } from '@redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

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

const store = createStore(
  countReducer,
  applyMiddleware(thunk as any, logger as any),
)
export default store
