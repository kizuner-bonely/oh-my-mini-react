import type { StoreType } from './redux.d'
import { useForceUpdate } from './utils'
import { createContext, useContext, useLayoutEffect } from 'react'
import { bindActionCreators } from '@redux'

type ProviderProps = { store: StoreType; children: JSX.Element | JSX.Element[] }

type MapStateToPropsType = (state: Record<string, any>) => Record<string, any>

type MapDispatchToPropsType =
  | Record<string, any>
  | ((
      dispatch: StoreType['dispatch'],
      ownProps?: Record<string, any>,
    ) => Record<string, any>)

const StoreContext = createContext<StoreType>({} as StoreType)

export function Provider(props: ProviderProps) {
  const { store, children } = props
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function connect(
  mapStateToProps: MapStateToPropsType,
  mapDispatchToProps: MapDispatchToPropsType,
) {
  return (WrappedComponent: any) => (props: Record<string, any>) => {
    const { getState, dispatch, subscribe } = useContext(StoreContext)

    const forceUpdate = useForceUpdate()

    const stateMap = mapStateToProps(getState())

    let dispatchMap: Record<string, any> = { dispatch }
    if (typeof mapDispatchToProps === 'function') {
      dispatchMap = mapDispatchToProps(dispatch)
    } else if (typeof mapDispatchToProps === 'object') {
      dispatchMap = bindActionCreators(mapDispatchToProps, dispatch)
    }

    useLayoutEffect(() => {
      const unsubscribe = subscribe(forceUpdate)

      return () => {
        unsubscribe()
      }
    }, [])

    return <WrappedComponent {...props} {...stateMap} {...dispatchMap} />
  }
}
