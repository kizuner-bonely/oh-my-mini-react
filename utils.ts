import { FiberType } from '@type/VnodeType'
import { Component } from '@react/react'

export function isStr(s: unknown): s is string {
  return typeof s === 'string'
}

export function isStringOrNumber(s: unknown): s is string | number {
  return typeof s === 'string' || typeof s === 'number'
}

export function isFn(fn: unknown): fn is typeof Function | typeof Component {
  return typeof fn === 'function'
}

export function isArray(arr: unknown): arr is unknown[] {
  return Array.isArray(arr)
}

//* 将 fiber 节点的属性渲染到对应的 DOM 上
export function updateNode(
  node: HTMLElement,
  nextVal: { children: FiberType['props']['children'] } & Record<string, any>,
) {
  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = `${nextVal[k]}`
      }
      return
    }

    Object.assign(node, { [k]: nextVal[k] })
  })
}
