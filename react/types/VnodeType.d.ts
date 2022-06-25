export interface VnodeType {
  tag: number
  type: string | typeof Function | Class
  key: string
  props: Record<string, any>
  stateNode: HTMLElement | null
  child: VnodeType | null
  sibling: VnodeType | null
  return: VnodeType | null
  flags: number
  index: number | null
}
