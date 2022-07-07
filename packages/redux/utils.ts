import { useReducer } from 'react'

export function compose(
  ...fns: Array<(...args: any[]) => any>
): (...args: any) => any {
  if (!fns.length) return (arg: any) => arg
  if (fns.length === 1) return fns[0]

  return fns.reduce(
    (prev, cur) =>
      (...args: any[]) =>
        prev(cur(...args)),
  )
}

export function useForceUpdate() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  return forceUpdate
}
