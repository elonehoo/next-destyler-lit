export function runIfFn<T>(v: T | undefined, ...a: T extends (...a: any[]) => void ? Parameters<T> : never): T extends (...a: any[]) => void ? NonNullable<ReturnType<T>> : NonNullable<T> {
  const res = typeof v === 'function' ? v(...a) : v
  return res ?? undefined
}

export const cast = <T>(v: unknown): T => v as T

export function noop() {}

export function pipe<T>(...fns: Array<(a: T) => T>) {
  return (v: T) =>
    fns.reduce((a, b) => b(a), v)
}

export function callAll<T extends (...a: any[]) => void>(...fns: (T | undefined)[]) {
  return (...a: Parameters<T>) => {
    fns.forEach((fn) => {
      fn?.(...a)
    })
  }
}

export const uuid = (() => {
  let id = 0
  return () => {
    id++
    return id.toString(36)
  }
})()

export function merge<T, U>(origin: T, patch: U): T & U {
  if (!(typeof patch === 'object') || patch === null)
    return patch as any
  const result: Record<string, unknown> = !(typeof origin === 'object') ? {} : Object.assign({}, origin)
  for (const key of Object.keys(patch as object)) {
    const value = (patch as Record<string, unknown>)[key]
    const src = result[key]
    if (value === null)
      delete result[key]
    else if (Array.isArray(value) || Array.isArray(src))
      result[key] = [...(Array.isArray(src) ? src : []), ...(Array.isArray(value) ? value : [])]
    else result[key] = merge(src, value)
  }
  return result as any
}
