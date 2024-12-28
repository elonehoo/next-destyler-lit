import type { StateMachine as S } from './types'
import { isArray, isObject, isString } from '@destyler/utils'

export function toEvent<T extends S.EventObject>(event: S.Event<T>): T {
  const obj = isString(event) ? { type: event } : event
  return obj as T
}

export function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value)
    return []
  return isArray(value) ? value : [value]
}

export function isGuardHelper(value: any): value is { predicate: () => void } {
  return isObject(value) && value.predicate != null
}
