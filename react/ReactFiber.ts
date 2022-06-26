import type { FiberType } from '@type/VnodeType'
import { isFn, isStr, isUndefined } from '@utils'
import { Placement } from './Flags'
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'

export function createFiber(vnode: FiberType, returnFiber: FiberType) {
  const fiber: FiberType = {
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

  if (isStr(type)) {
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    fiber.props = { children: vnode }
  } else {
    fiber.tag = Fragment
  }

  return fiber
}
