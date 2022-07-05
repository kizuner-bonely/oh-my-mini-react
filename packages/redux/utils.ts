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
