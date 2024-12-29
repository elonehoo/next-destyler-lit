import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createMachine } from '../src'

interface Context {
  values: string[]
  readonly length: number
}

interface State {
  value: 'idle'
}

const watchers = {
  length: vi.fn(),
  values: vi.fn(),
}

const service = createMachine<Context, State>({
  context: {
    values: [],
  },
  computed: {
    length: ctx => ctx.values.length,
  },
  watch: {
    values: watchers.values,
    length: watchers.length,
  },
  on: {
    ADD: {
      actions: ctx => ctx.values.push('foo'),
    },
  },
})

beforeEach(() => {
  service.start()
  service.send('ADD')
})

afterEach(() => {
  service.stop()
  watchers.length.mockReset()
  watchers.values.mockReset()
})

it('[computed] should compute context values', () => {
  expect(service.state.context.length).toBe(1)
})

it('[watch] should watch mutable context value', () => {
  expect(watchers.length).toHaveBeenCalledTimes(1)
})
