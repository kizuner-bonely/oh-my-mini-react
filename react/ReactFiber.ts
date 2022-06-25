import type { VnodeType } from '@type/VnodeType'
import { isFn, isStr } from '@utils'
import { Placement } from './Flags'
import { FunctionComponent, HostComponent } from './ReactWorkTags'

export function createFiber(vnode: VnodeType, returnFiber: VnodeType) {
  const fiber: VnodeType = {
    tag: 0,
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null, // 原生标签: DOM 节点; 类组件: 实例
    child: null,
    sibling: null,
    return: returnFiber,
    flags: Placement,
    index: null, // 由于 Fiber树 是链表结构, 在 diff 子节点时为了判断是否移动位置，使用 index 标记
  }

  const { type } = vnode

  switch (type) {
    case isStr(type):
      fiber.tag = HostComponent
      break
    case isFn(type):
      // todo: 区分函数组件和类组件
      fiber.tag = FunctionComponent
      break
  }

  return fiber
}
