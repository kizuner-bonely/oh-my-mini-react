export function isStr(s: unknown) {
  return typeof s === 'string'
}

export function isStringOrNumber(s: unknown) {
  return typeof s === 'string' || typeof s === 'number'
}

export function isFn(fn: unknown) {
  return typeof fn === 'function'
}

export function isArray(arr: unknown) {
  return Array.isArray(arr)
}
