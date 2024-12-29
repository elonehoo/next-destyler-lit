import { expect, it, vi } from 'vitest'
import { createMachine } from '../src'

it('[final state] exit actions should be called when invoked machine reaches its final state', () => {
  const exit_root = vi.fn()
  const exit_state = vi.fn()

  const machine = createMachine({
    exit: exit_root,
    initial: 'a',
    states: {
      a: {
        type: 'final',
        exit: exit_state,
      },
    },
  })

  machine
    .onDone(() => {
    })
    .start()

  expect(exit_root).toHaveBeenCalled()
  expect(exit_state).toHaveBeenCalled()
})

it('exit actions should be called when stopping a machine', () => {
  const exit_root = vi.fn()
  const exit_state = vi.fn()

  const machine = createMachine({
    exit: exit_root,
    initial: 'a',
    states: {
      a: {
        exit: exit_state,
      },
    },
  })

  machine.start().stop()

  expect(exit_root).toBeTruthy()
  expect(exit_state).toBeTruthy()
})
