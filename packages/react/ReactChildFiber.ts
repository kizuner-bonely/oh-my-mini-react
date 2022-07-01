import type { FiberType } from '@type/VnodeType'
import { createFiber } from '@react/ReactFiber'
import { isArray, isStringOrNumber } from '@utils'
import { Placement, Update } from './Flags'

function placeChild(
  newFiber: FiberType,
  lastPlacedIndex: number,
  newIndex: number,
  shouldTrackSideEffect: boolean,
) {
  //! 对于初次渲染，只是记录下标
  //! 更新时要检查节点是否移动
  // 保存新节点的下标，用于后续判断是否移动位置
  newFiber.index = newIndex
  if (!shouldTrackSideEffect) {
    // 初次渲染
    return lastPlacedIndex
  }

  //* 判断节点位置是否发生变化
  // 父节点更新
  // ? 子节点初次渲染 or 更新
  const current = newFiber.alternate
  if (current) {
    // 子节点更新
    // 由于继承了老节点的 alternate, 因此如果是更新 current 肯定有值
    /**
     * eg.
     *  old: 0 1 2 3 4
     *  new: 2 1 3 4
     */
    const oldIndex = current.index!
    if (oldIndex < lastPlacedIndex) {
      /**
       * 第二次进来，发现"1"在老节点位置是1，但此时 lastPlacedIndex 是2, 1 < 2
       * 此时需要移动"1"
       */
      newFiber.flags |= Placement
      return lastPlacedIndex
    } else {
      /**
       *  遍历新节点，第一个位置就不同，"2"在老节点的位置是2, "2"不用移动位置, 可以直接插入
       *  此时 lastPlacedIndex 是2
       */
      return oldIndex
    }
  } else {
    // 子节点初次渲染
    // 由于不影响上一次 DOM 节点的插入位置，因此可以跟在上一次插入位置的后面
    newFiber.flags |= Placement
    return lastPlacedIndex
  }
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
  let oldFiber = returnFiber.alternate?.child ?? null // 初始为 wip 的第一子节点, 后续是其他节点
  let nextOldFiber: FiberType | null = null // 指向下一个 oldFiber, 可能为从左往右遍历时第一个匹配不上的 oldFiber

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

  // 遍历新节点的指针
  let newIndex = 0

  //* 1.从左往右遍历新节点，查看是否有可复用的节点，直到遍历到不可复用节点或遍历完新节点
  for (; oldFiber && newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex]
    if (newChild === null) continue

    // 当发现当前遍历位置的新老节点位置对不上时，记录当前 oldFiber
    /**
     * eg.
     *  old: 0 1 3 4
     *  new: 0 1 2 3 4
     *
     *  记录"3"
     */
    if (oldFiber.index! > newIndex) {
      nextOldFiber = oldFiber
      oldFiber = null
    } else {
      nextOldFiber = oldFiber.sibling
    }

    // 当发现当前遍历位置的老节点不可复用时，退出该循环
    /**
     * eg.
     *  old: 0 1 3 4
     *  new: 0 1 2 3 4
     *
     * 当对"3"和"2"比较时，发现不能复用，保存 oldFiber "3" 并退出该循环
     */
    const isSame = sameNode(newChild, oldFiber)
    if (!isSame) {
      if (oldFiber === null) oldFiber = nextOldFiber
      break
    }

    const newFiber = createFiber(newChild, returnFiber)

    // 可以复用
    Object.assign(newFiber, {
      stateNode: oldFiber!.stateNode,
      alternate: oldFiber,
      flags: Update,
    })

    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffect,
    )

    if (previousNewFiber === null) {
      // 第一个子 fiber
      returnFiber.child = newFiber
    } else {
      // 其他子 fiber
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
    oldFiber = nextOldFiber
  }

  //! 步骤2的各个情况互相互斥
  //* 2.1 新节点遍历完，但老节点还有剩余
  // 直接删除剩余老节点
  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber!)
    return
  }

  //* 2.2初次渲染 | 老节点没了, 但新节点还有
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

  //* 2.3 结束从左往右的遍历时, 新老节点都还有
  /**
   * old: 0 1 [2 3 4]
   * new: 0 1 [3 4]
   */
  // 2.3.1 构建剩余老节点的哈希表
  const existingChildren = mapRemainingChildren(oldFiber!)
  // 2.3.2 遍历新节点, 查询哈希表中是否有可复用的老节点. 如果有则复用并删除该节点
  for (; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex]
    if (newChild === null) continue

    const newFiber = createFiber(newChild, returnFiber)

    const matchedOldFiber = existingChildren.get(
      (newFiber.key ?? newFiber.index)!,
    )
    if (matchedOldFiber) {
      // 复用并删除老节点, 此处删除是指单纯从旧哈希表中删除而不是从 DOM 中删除，因为可以复用
      Object.assign(newFiber, {
        stateNode: matchedOldFiber.stateNode,
        alternate: matchedOldFiber.alternate,
        flags: Update,
      })
      existingChildren.delete((newFiber.key ?? newFiber.index)!)
    }
    // 如果不能复用就用上面声明的 newFiber

    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffect,
    )

    /**
     * old: 0 1 2 3
     * new: 4 1 2 3
     *
     * 当第一个节点就无法复用是, 此时 previousNewFiber 还是初始值 —— null
     */
    if (previousNewFiber === null) {
      returnFiber.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
  // 2.3.3 遍历删除哈希表中剩余的老节点，此处的删除是指从 DOM 中摘除, 因为无法复用
  if (shouldTrackSideEffect) {
    existingChildren.forEach(child => deleteChild(returnFiber, child))
  }
}

//* 根据传入单链表生成哈希表
function mapRemainingChildren(currentFirstChild: FiberType) {
  const existingChildren = new Map<string | number, FiberType>()
  let childIndex: FiberType | null = currentFirstChild
  while (childIndex) {
    existingChildren.set((childIndex.key ?? childIndex.index)!, childIndex)
    childIndex = childIndex.sibling
  }
  return existingChildren
}

//* 判断是否能复用节点
// 1.同一层级下; 2.类型相同; 3.key 相同
function sameNode(a: FiberType, b: FiberType | null) {
  return a && b && a.type === b?.type && a.key === b?.key
}

//* 删除单个子节点
function deleteChild(returnFiber: FiberType, childToDelete: FiberType) {
  if (returnFiber.deletions) {
    returnFiber.deletions.push(childToDelete)
  } else {
    returnFiber.deletions = [childToDelete]
  }
}

//* 删除多个子节点
function deleteRemainingChildren(
  returnFiber: FiberType,
  currentChild: FiberType,
) {
  let childToDelete: FiberType | null = currentChild

  while (childToDelete) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
}
