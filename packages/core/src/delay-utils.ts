import type { Dict, StateMachine as S } from './types'
import { invariant, isFunction, isNumber, isString } from '@destyler/utils'

export function determineDelayFn<TContext extends Dict, TEvent extends S.EventObject>(
  delay: S.Delay<TContext, TEvent> | undefined,
  delaysMap: S.DelayMap<TContext, TEvent> | undefined,
) {
  return (context: TContext, event: TEvent) => {
    if (isNumber(delay))
      return delay

    if (isFunction(delay)) {
      return delay(context, event)
    }

    if (isString(delay)) {
      const value = Number.parseFloat(delay)

      if (!Number.isNaN(value)) {
        return value
      }

      if (delaysMap) {
        const valueOrFn = delaysMap?.[delay]

        invariant(
          valueOrFn == null,
          `[@destyler/core > determine-delay] Cannot determine delay for \`${delay}\`. It doesn't exist in \`options.delays\``,
        )

        return isFunction(valueOrFn) ? valueOrFn(context, event) : valueOrFn
      }
    }
  }
}
