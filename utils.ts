import type { EffectType } from '@react/types/hooks'
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

export function isUndefined(item: unknown): item is undefined {
  return item === undefined
}

//* 将 fiber 节点的属性渲染到对应的 DOM 上
export function updateNode(
  node: HTMLElement | Text,
  prevVal: any = {},
  nextVal: any = {},
) {
  Object.keys(prevVal).forEach(k => {
    if (k === 'children') {
      // 有可能是文本
      if (isStringOrNumber(prevVal[k])) {
        node.textContent = ''
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase()
      node.removeEventListener(eventName, prevVal[k])
    } else {
      if (!(k in nextVal)) {
        // @ts-ignore
        node[k] = ''
      }
    }
  })

  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      // 有可能是文本
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + ''
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase()
      node.addEventListener(eventName, nextVal[k])
    } else {
      // @ts-ignore
      node[k] = nextVal[k]
    }
  })
}

export function areHooksDepsEquals(
  nextDeps: EffectType['deps'],
  prevDeps: EffectType['deps'],
) {
  if (prevDeps === null || nextDeps === null) return false

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) continue
    return false
  }

  return true
}
