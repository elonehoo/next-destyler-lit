import { callAll } from '@destyler/utils'

interface Props {
  [key: string]: any
}

function clsx (...args: (string | undefined)[]) {
  return args
    .map((str) => str?.trim())
    .filter(Boolean)
    .join(" ")
}

type TupleTypes<T extends any[]> = T[number]

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export function mergeProps<T extends Props>(...args: T[]): UnionToIntersection<TupleTypes<T[]>> {
  const result: Props = {}

  for (const props of args) {
    for (const key in result) {
      if (/^on[A-Z]/.test(key) && typeof result[key] === 'function' && typeof props[key] === 'function') {
        result[key] = callAll(result[key], props[key])
        continue
      }

      if (key === 'className' || key === 'class') {
        result[key] = clsx(result[key], props[key])
        continue
      }

      if (key === 'style') {
        result[key] = Object.assign({}, result[key] ?? {}, props[key] ?? {})
        continue
      }

      result[key] = props[key] !== undefined ? props[key] : result[key]
    }

    // Add props from b that are not in a
    for (const key in props) {
      if (result[key] === undefined) {
        result[key] = props[key]
      }
    }
  }

  return result as any
}
