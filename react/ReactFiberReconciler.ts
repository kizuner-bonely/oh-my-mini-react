import { isArray, isStringOrNumber, updateNode } from '@utils'
import { createFiber } from './ReactFiber'
import { VnodeType } from './types/VnodeType'

//* 更新原生标签节点类型的 Fiber
export function updateHostComponent(wip: VnodeType) {
  // 更新自己
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
  }
  // 将本 Fiber 的属性渲染到对应的 DOM 上
  updateNode(wip.stateNode!, wip.props)

  // 更新子节点
  reconcileChildren(wip, wip.props.children)
}

export function updateFunctionComponent(wip: VnodeType) {
  console.log('update function component')
}

export function updateClassComponent(wip: VnodeType) {
  console.log('update class component')
}

export function updateFragmentComponent(wip: VnodeType) {
  console.log('update fragment component')
}

export function updateHostTextComponent(wip: VnodeType) {
  console.log('update host text component')
}

//* 协调一个 fiber 的 子fiber
function reconcileChildren(
  wip: VnodeType, // 被协调的 fiber
  children: VnodeType['props']['children'], // 被协调 fiber 的 子fiber
) {
  // 子节点是单一子节点的话直接当成属性，不另外生成 Fiber
  if (isStringOrNumber(children)) return

  const newChildren = isArray(children) ? children : [children]
  let previousNewFiber: VnodeType | null = null

  newChildren.forEach(child => {
    const newFiber = createFiber(child, wip)

    // React 不对 null 生成 Fiber 节点
    if (newFiber === null) return

    // 构建 子fiber 的关系
    if (previousNewFiber === null) {
      // 第一个子节点
      wip.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  })
}
