import effectType from './Effect/effectType'

export type EffectType = keyof typeof effectType

export type Fn = (...args: any[]) => any
