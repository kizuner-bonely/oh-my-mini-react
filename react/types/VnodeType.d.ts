export interface FiberType {
  tag: number
  type: string | typeof Function | Class
  key: string | null
  props: {
    children: FiberType | FiberType[] | string | number
    [K in string]: any
  }
  stateNode: HTMLElement | Text | null
  child: FiberType | null
  sibling: FiberType | null
  return: FiberType | null
  flags: number
  index: number | null
}
