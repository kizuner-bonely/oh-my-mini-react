import type { EffectType } from '@type/hooks'
import type { HookType } from './hooks'

export interface FiberType {
  tag: number
  type: string | typeof Function | Class
  key: string | null
  props: {
    children: FiberType | FiberType[] | string | number
    [K in string]: any
  }

  // 对于类组件来说是实例
  // 对于原生标签是 DOM 节点
  stateNode: HTMLElement | Text | null

  child: FiberType | null
  sibling: FiberType | null
  return: FiberType | null
  flags: number
  index: number | null

  // 记录对应的老节点 ( 双缓存 )
  alternate: FiberType | null

  // 对于函数组件来说存储的是 hook0
  // 对于类组件来说存储的是自己的状态值
  memorizedState: null | HookType | Record<string, any>

  // 要删除的子 Fiber
  deletions: FiberType[] | null

  // 副作用
  updateQueueOfEffect?: Array<EffectType>
  updateQueueOfLayout?: Array<EffectType>
}
