import { isArray, isStringOrNumber, updateNode } from '@utils'
import { Update } from './Flags'
import { renderWithHooks } from './hooks'
import { createFiber } from './ReactFiber'
import { FiberType } from './types/VnodeType'

//* 更新原生标签节点类型的 Fiber
export function updateHostComponent(wip: FiberType) {
  // 更新自己
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
  }
  // 将本 Fiber 的属性渲染到对应的 DOM 上
  updateNode(wip.stateNode!, {}, wip.props)

  // 更新子节点
  reconcileChildren(wip, wip.props.children)
}

export function updateFunctionComponent(wip: FiberType) {
  renderWithHooks(wip)

  const { type, props } = wip
  const children = type(props)
  reconcileChildren(wip, children)
}

export function updateClassComponent(wip: FiberType) {
  const { type, props } = wip
  const instance = new type(props)
  const children = instance.render()
  reconcileChildren(wip, children)
}

export function updateFragmentComponent(wip: FiberType) {
  reconcileChildren(wip, wip.props.children)
}

export function updateHostTextComponent(wip: FiberType) {
  wip.stateNode = document.createTextNode(wip.props.children as string)
}

//* 协调一个 fiber 的 子fiber
function reconcileChildren(
  wip: FiberType, // 被协调的 fiber
  children: FiberType['props']['children'], // 被协调 fiber 的 子fiber
) {
  // 子节点是单一子节点的话直接当成属性，不另外生成 Fiber
  if (isStringOrNumber(children)) return

  let previousNewFiber: FiberType | null = null
  let oldFiber = wip.alternate?.child ?? null // wip 的第一子节点

  // 此处的 children 就是 ReactElement ( jsx()的结果 )
  const newChildren = isArray(children) ? children : [children]

  newChildren.forEach(child => {
    // React 不对 null 生成 Fiber 节点
    if (child === null) return

    const newFiber = createFiber(child, wip)

    const isSame = sameNode(newFiber, oldFiber)

    if (isSame) {
      Object.assign(newFiber, {
        stateNode: oldFiber!.stateNode,
        alternate: oldFiber,
        flags: Update,
      })
    }

    if (!isSame && oldFiber) {
      deleteChild(wip, oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

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

//* 判断是否能复用节点
// 1.同一层级下; 2.类型相同; 3.key 相同
function sameNode(a: FiberType, b: FiberType | null): b is FiberType {
  return a && b && a.type === b?.type && a.key === b?.key ? true : false
}

function deleteChild(returnFiber: FiberType, childToDelete: FiberType) {
  if (returnFiber.deletions) {
    returnFiber.deletions.push(childToDelete)
  } else {
    returnFiber.deletions = [childToDelete]
  }
}
