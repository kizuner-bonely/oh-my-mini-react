import { createStore, applyMiddleware, logger, thunk } from '@redux'
// import thunk from 'redux-thunk'
// import logger from 'redux-logger'

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

const store = createStore(countReducer, applyMiddleware(thunk, logger))
export default store
