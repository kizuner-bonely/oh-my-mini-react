import type { FiberType } from '@type/VnodeType'
import { createFiber } from '@react/ReactFiber'
import { isArray, isStringOrNumber } from '@utils'

function placeChild(
  newFiber: FiberType,
  lastPlacedIndex: number,
  newIndex: number,
  shouldTrackSideEffect: boolean,
) {
  //! 对于初次渲染，只是记录下标
  //! 更新时要检查节点是否移动 // todo
  // 保存新节点的下标，用于后续判断是否移动位置
  newFiber.index = newIndex
  if (!shouldTrackSideEffect) {
    // 初次渲染
    return lastPlacedIndex
  }

  // todo: to ignore ts warning for the time being
  return 0
}

//! 初次渲染和更新都会执行 reconcileChildren
//* 协调一个 fiber 的 子fiber
export function reconcileChildren(
  returnFiber: FiberType, // 被协调的 fiber
  children: FiberType['props']['children'], // 被协调 fiber 的 子fiber
) {
  // 子节点是单一子节点的话直接当成属性，不另外生成 Fiber
  if (isStringOrNumber(children)) return

  let previousNewFiber: FiberType | null = null
  // eslint-disable-next-line prefer-const
  let oldFiber = returnFiber.alternate?.child ?? null // 初始为 wip 的第一子节点, 后续是其他节点

  // 此处的 children 就是 ReactElement ( jsx()的结果 )
  const newChildren = isArray(children) ? children : [children]

  // 上一次 dom 节点插入的位置
  // old: 0 1 2 3 4
  // new: 2 1 3 4
  // 遍历新节点 "2"在老节点中位置为2, lastPlacedIndex 设置为 2
  // 继续遍历新节点 "1"在老节点中位置为1, 发现该位置比 lastPlacedIndex 小，说明该节点被插队了
  let lastPlacedIndex = 0

  // 用于判断父节点是初次渲染还是初次更新
  // 如果父节点是初次渲染，那它的后代节点肯定都是初次渲染
  const shouldTrackSideEffect = !!returnFiber.alternate
  //* 遍历新节点
  let newIndex = 0
  //! 1.初次渲染
  //! 2.老节点都没了，只剩下新节点
  if (!oldFiber) {
    for (; newIndex < newChildren.length; newIndex++) {
      const newChild = newChildren[newIndex]

      // React 不对 null 生成 Fiber 节点
      if (newChild === null) continue

      const newFiber = createFiber(newChild, returnFiber)

      lastPlacedIndex = placeChild(
        newFiber,
        lastPlacedIndex,
        newIndex,
        shouldTrackSideEffect,
      )

      // 构建 子fiber 的关系
      if (previousNewFiber === null) {
        // 第一个子节点
        returnFiber.child = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
    }
  }

  //* 如果新节点遍历完还剩余老节点，则删除剩余全部
  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber!)
  }
}

//* 判断是否能复用节点
// 1.同一层级下; 2.类型相同; 3.key 相同
// function sameNode(a: FiberType, b: FiberType | null): b is FiberType {
//   return a && b && a.type === b?.type && a.key === b?.key ? true : false
// }

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
