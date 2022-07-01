import { updateNode } from '@utils'
import { renderWithHooks } from './hooks'
import { reconcileChildren } from './ReactChildFiber'
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
