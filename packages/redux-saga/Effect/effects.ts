import type { EffectType, Fn } from '../saga.type'
import effectType from './effectType'
import { IO } from './symbol'

type EffectPayload = {
  pattern?: string
  action?: string
  fn?: Fn
  args?: any[]
}

function makeEffect(type: EffectType, payload: EffectPayload) {
  return { [IO]: IO, type, payload }
}

export function take(pattern: string) {
  return makeEffect(effectType.TAKE, { pattern })
}

export function put(action: string) {
  return makeEffect(effectType.PUT, { action })
}

export function call(fn: Fn, ...args: any[]) {
  return makeEffect(effectType.CALL, { fn, args })
}

export function fork(fn: Fn, ...args: any[]) {
  return makeEffect(effectType.FORK, { fn, args })
}
