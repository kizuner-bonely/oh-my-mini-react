export type ReducerType = (x: any) => any

export type HookType = {
  memorizedState: any | null
  next: HookType | null
}
