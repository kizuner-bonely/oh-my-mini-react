import { FiberType } from '@type/VnodeType'
import { updateNode } from '@utils'
import { Placement, Update } from './Flags'
import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from './ReactFiberReconciler'
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'
import { scheduleCallback } from './scheduler'
import { EffectType } from './types/hooks'

let wip: null | FiberType = null //! work in progress
let wipRoot: null | FiberType = null

//* 更新 Fiber 节点
export function performUnitOfWork() {
  //* 1.更新当前 Fiber 节点
  const { tag } = wip ?? {}

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip!)
      break
    case FunctionComponent:
      updateFunctionComponent(wip!)
      break
    case ClassComponent:
      updateClassComponent(wip!)
      break
    case Fragment:
      updateFragmentComponent(wip!)
      break
    case HostText:
      updateHostTextComponent(wip!)
      break
  }

  //* 2.更新下一个节点 (深度优先遍历)
  if (wip?.child) {
    wip = wip.child
    return
  }

  let next = wip

  while (next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
  }

  wip = null
}

//* 将 Fiber 渲染到 DOM 上 ( 初次渲染和更新都执行该函数 )
export function scheduleUpdateOnFiber(fiber: FiberType) {
  wip = fiber
  wipRoot = fiber

  scheduleCallback(workLoop)
}

//* 实际开始调度的入口
function workLoop() {
  while (wip) {
    performUnitOfWork()
  }

  // fiber 更新完毕，接下来是提交更新好的 fiber 节点
  // 提交是从根节点开始提交
  if (!wip && wipRoot) {
    commitRoot()
  }
}

function commitRoot() {
  commitWorker(wipRoot)
  wipRoot = null
}

function commitWorker(wip: FiberType | null) {
  if (!wip) return

  // 1.提交自己
  const parentNode = getParentNode(wip.return!)
  const { flags, stateNode, deletions } = wip

  // 添加自己
  if (flags & Placement && stateNode) {
    // ! 注意这里要辨别要移动的节点
    const before = getHostSibling(wip.sibling)
    insertOrAppendPlacementNode(stateNode, before, parentNode!)
  }

  // 更新自己
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate?.props, wip.props)
  }

  // 删除子元素
  if (deletions) {
    commitDeletions(deletions, (stateNode || parentNode) as HTMLElement)
  }

  if (wip.tag === FunctionComponent) {
    invokeHooks(wip)
  }

  // 2.提交子节点
  commitWorker(wip.child)
  // 3.提交兄弟节点
  commitWorker(wip.sibling)
}

function getHostSibling(sibling: FiberType | null) {
  while (sibling) {
    if (sibling.stateNode && !(sibling.flags & Placement)) {
      return sibling.stateNode
    }
    sibling = sibling.sibling
  }
  return null
}

function insertOrAppendPlacementNode(
  stateNode: FiberType['stateNode'],
  before: FiberType['stateNode'] | null,
  parentNode: HTMLElement | Text,
) {
  if (before) {
    parentNode.insertBefore(stateNode!, before)
    return
  }
  parentNode.appendChild(stateNode!)
}

function getParentNode(wip: FiberType) {
  let tmp = wip
  while (tmp) {
    if (tmp.stateNode) return tmp.stateNode
    tmp = tmp.return!
  }
}

// requestIdleCallback(workLoop)

function commitDeletions(deletions: FiberType[], parentNode: HTMLElement) {
  deletions.forEach(d => {
    parentNode.removeChild(getStateNode(d))
  })
}

// 由于不是每个 fiber 都有 DOM 节点，因此需要该方法来获取实际 DOM
function getStateNode(fiber: FiberType) {
  let tmp = fiber

  while (!tmp.stateNode) {
    tmp = tmp.child!
  }

  return tmp.stateNode
}

function invokeHooks(wip: FiberType) {
  wip.updateQueueOfLayout!.forEach(e => {
    e.create()
  })

  wip.updateQueueOfEffect!.forEach(e => {
    scheduleCallback(e.create)
  })
}
