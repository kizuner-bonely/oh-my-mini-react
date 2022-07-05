export type ActionType = { type: any }

export type ReducerType = (state: any, action: type) => any

export type ListenerType = () => void

type MidAPI = {
  getState(): any
  dispatch: StoreType['dispatch']
}

export type MiddlewareType = (midAPI: MidAPI) => (...args: any[]) => any

export type StoreType = {
  getState(): any
  dispatch(action: ActionType, ...args: any[]): void
  subscribe(listener: ListenerType): () => void
}
