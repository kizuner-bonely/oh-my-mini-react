import type { FiberType } from '@type/VnodeType'
import { createFiber } from '@react/ReactFiber'
import { isArray, isStringOrNumber } from '@utils'
import { Update } from './Flags'

//* 协调一个 fiber 的 子fiber
export function reconcileChildren(
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
