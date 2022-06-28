import type { FiberType } from '@type/VnodeType'
import { createFiber } from '@react/ReactFiber'
import { isArray, isStringOrNumber } from '@utils'
import { Update } from './Flags'

//* 协调一个 fiber 的 子fiber
export function reconcileChildren(
  returnFiber: FiberType, // 被协调的 fiber
  children: FiberType['props']['children'], // 被协调 fiber 的 子fiber
) {
  // 子节点是单一子节点的话直接当成属性，不另外生成 Fiber
  if (isStringOrNumber(children)) return

  let previousNewFiber: FiberType | null = null
  let oldFiber = returnFiber.alternate?.child ?? null // 初始为 wip 的第一子节点, 后续是其他节点

  // 此处的 children 就是 ReactElement ( jsx()的结果 )
  const newChildren = isArray(children) ? children : [children]

  let ind = 0
  //* 遍历新节点
  newChildren.forEach(child => {
    ind++

    // React 不对 null 生成 Fiber 节点
    if (child === null) return

    const newFiber = createFiber(child, returnFiber)

    const isSame = sameNode(newFiber, oldFiber)

    if (isSame) {
      Object.assign(newFiber, {
        stateNode: oldFiber!.stateNode,
        alternate: oldFiber,
        flags: Update,
      })
    }

    if (!isSame && oldFiber) {
      deleteChild(returnFiber, oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    // 构建 子fiber 的关系
    if (previousNewFiber === null) {
      // 第一个子节点
      returnFiber.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  })

  //* 如果新节点遍历完还剩余老节点，则删除剩余全部
  if (ind === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber!)
  }
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

function deleteRemainingChildren(
  returnFiber: FiberType,
  currentChild: FiberType,
) {
  let childToDelete = currentChild

  while (childToDelete) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling!
  }
}
