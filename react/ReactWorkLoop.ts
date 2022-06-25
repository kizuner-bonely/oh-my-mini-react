import { VnodeType } from '@type/VnodeType'
import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from './ReactReconciler'
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'

let wip: null | VnodeType = null //! work in progress

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
