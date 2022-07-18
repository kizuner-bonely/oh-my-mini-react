import { describe, test, expect } from 'vitest'
import { IO } from './Effect/symbol'
import effectType from './Effect/effectType'
import { take, put, call, fork } from './Effect/effects'

describe('redux-saga', () => {
  describe('make effect', () => {
    test('take effect', () => {
      expect(take('abc')).toMatchObject({
        [IO]: IO,
        type: effectType.TAKE,
        payload: {
          pattern: 'abc',
        },
      })
    })

    test('put effect', () => {
      expect(put('abc')).toMatchObject({
        [IO]: IO,
        type: effectType.PUT,
        payload: {
          action: 'abc',
        },
      })
    })

    test('call effect', () => {
      const fn = () => {}
      expect(call(fn, 'a', 'b')).toMatchObject({
        [IO]: IO,
        type: effectType.CALL,
        payload: {
          fn,
          args: ['a', 'b'],
        },
      })
    })

    test('fork effect', () => {
      const fn = () => {}
      expect(fork(fn, 'a', 'b')).toMatchObject({
        [IO]: IO,
        type: effectType.FORK,
        payload: {
          fn,
          args: ['a', 'b'],
        },
      })
    })
  })
})
