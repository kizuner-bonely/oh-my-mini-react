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
  const { flags, stateNode } = wip

  // 添加自己
  if (flags & Placement && stateNode) {
    parentNode!.appendChild(stateNode)
  }

  // 更新自己
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate!.props, wip.props)
  }

  // 2.提交子节点
  commitWorker(wip.child)
  // 3.提交兄弟节点
  commitWorker(wip.sibling)
}

function getParentNode(wip: FiberType) {
  let tmp = wip
  while (tmp) {
    if (tmp.stateNode) return tmp.stateNode
    tmp = tmp.return!
  }
}

// requestIdleCallback(workLoop)
