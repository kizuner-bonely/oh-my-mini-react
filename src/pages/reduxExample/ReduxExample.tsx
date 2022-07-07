import type { StoreType } from '@redux/redux'
import { useCallback } from 'react'
import { Provider, connect } from '@redux/react-redux'
import { bindActionCreators } from '@redux'
import store from './store'

export default function ReduxExample() {
  return (
    <Provider store={store}>
      <ReduxExampleContent />
    </Provider>
  )
}

const mapStateToProps = (state: Record<string, any>) => {
  const { counter } = state
  return { counter }
}

//* 函数形式的 mapDispatchToProps
const mapDispatchToProps = (dispatch: StoreType['dispatch']) => {
  let creators = {
    add: () => ({ type: 'ADD' }),
    minus: () => ({ type: 'MINUS' }),
  }

  creators = bindActionCreators(creators, dispatch) as any
  return { dispatch, ...creators }
}

//* 对象形式的 mapDispatchToProps
// const mapDispatchToProps = {
//   add: () => ({ type: 'ADD' }),
//   minus: () => ({ type: 'MINUS' }),
// }

const ReduxExampleContent = connect(
  mapStateToProps,
  mapDispatchToProps,
)((props: any) => {
  const { counter, dispatch, add, minus } = props

  console.log(props)

  const manuallyAdd = useCallback(() => {
    dispatch({ type: 'ADD' })
  }, [])

  return (
    <div>
      <h3>ReactReduxPage</h3>
      <p>count: {counter}</p>
      <button onClick={add}>add</button>
      <button onClick={manuallyAdd}>manuallyAdd</button>
      <button onClick={minus}>minus</button>
    </div>
  )
})

// function SimpleReduxExampleContent() {
//   const [, forceUpdate] = useReducer(x => x + 1, 0)

//   useEffect(() => {
//     const unsubscribe = store.subscribe(forceUpdate)
//     return () => {
//       unsubscribe()
//     }
//   }, [])

//   const handleAdd = useCallback(() => {
//     store.dispatch({ type: 'ADD' })
//   }, [])

//   const asyncMinus = useCallback(() => {
//     store.dispatch(dispatch => {
//       setTimeout(() => {
//         dispatch(dispatch => {
//           setTimeout(() => {
//             dispatch({ type: 'MINUS' })
//           }, 1000)
//         })
//       }, 0)
//     })
//   }, [])

//   return (
//     <div>
//       <h3>redux page</h3>
//       <p>{store.getState().counter}</p>
//       <button onClick={handleAdd}>add</button>
//       <button onClick={asyncMinus}>async minus</button>
//     </div>
//   )
// }
