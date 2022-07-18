import effectType from './Effect/effectType'

export type EffectType = keyof typeof effectType

export type Fn = (...args: any[]) => any

export type ListenerType = () => void

export type SagaMiddleware = {
  getState(): any
  dispatch(action: ActionType, ...args: any[]): void
}

export type ActionType =
  | { type: any }
  | ((dispatch: StoreType['dispatch'], getState: StoreType['getState']) => any)

export type StoreType = {
  getState(): any
  dispatch(action: ActionType, ...args: any[]): void
  subscribe(listener: ListenerType): () => void
}

export type NextType = (action: ActionType) => any
