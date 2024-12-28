import { describe, expect, it } from 'vitest'
import { guards } from '../src'

const { or, not, and } = guards

const context = {
  values: [],
  focusable: true,
  disabled: true,
}

const event = {
  type: 'testing',
}

type Context = typeof context

const guardMap = {
  isEmpty: (ctx: Context) => ctx.values.length === 0,
  isDisabled: (ctx: Context) => !ctx.focusable && ctx.disabled,
}

describe('guard helpers - strings', () => {
  it('or', () => {
    const getResult = or('isEmpty', 'isDisabled').predicate(guardMap)
    expect(getResult(context, event)).toBeTruthy()
  })

  it('not', () => {
    const getResult = not('isEmpty').predicate(guardMap)
    expect(getResult(context, event)).toBeFalsy()
  })

  it('and', () => {
    const getResult = and('isEmpty', 'isDisabled').predicate(guardMap)
    expect(getResult(context, event)).toBeFalsy()
  })

  it('combinations', () => {
    const getResult = and('isEmpty', not('isDisabled')).predicate(guardMap)
    expect(getResult(context, event)).toBeTruthy()

    const getResult2 = not(and('isEmpty', 'isDisabled')).predicate(guardMap)
    expect(getResult2(context, event)).toBeTruthy()
  })
})

describe('guard helpers - inline functions', () => {
  it('or', () => {
    const getResult = or(guardMap.isEmpty, guardMap.isDisabled).predicate(guardMap)
    expect(getResult(context, event)).toBeTruthy()
  })
})
