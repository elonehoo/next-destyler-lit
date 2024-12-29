import type { Placement, ReferenceElement } from '@floating-ui/dom'
import { addDomEvent, isHTMLElement, observeElementRect } from '@destyler/dom'
import { callAll, isBoolean } from '@destyler/utils'
import { getOverflowAncestors } from '@floating-ui/dom'

export type { Placement }

export interface AutoUpdateOptions {
  ancestorScroll?: boolean
  ancestorResize?: boolean
  referenceResize?: boolean
}

type Ancestors = ReturnType<typeof getOverflowAncestors>

function resolveOptions(option: boolean | AutoUpdateOptions) {
  const bool = isBoolean(option)
  return {
    ancestorResize: bool ? option : option.ancestorResize ?? true,
    ancestorScroll: bool ? option : option.ancestorScroll ?? true,
    referenceResize: bool ? option : option.referenceResize ?? true,
  }
}

export function autoUpdate(
  reference: ReferenceElement,
  floating: HTMLElement,
  update: () => void,
  options: boolean | AutoUpdateOptions = false,
) {
  const { ancestorScroll, ancestorResize, referenceResize } = resolveOptions(options)

  const useAncestors = ancestorScroll || ancestorResize
  const ancestors: Ancestors = []

  if (useAncestors && isHTMLElement(reference)) {
    ancestors.push(...getOverflowAncestors(reference))
  }

  function addResizeListeners() {
    const cleanups: VoidFunction[] = [observeElementRect(floating, update)]
    if (referenceResize && isHTMLElement(reference)) {
      cleanups.push(observeElementRect(reference, update))
    }
    cleanups.push(callAll(...ancestors.map((el: any) => addDomEvent(el, 'resize', update))))
    return () => cleanups.forEach(fn => fn())
  }

  function addScrollListeners() {
    return callAll(...ancestors.map((el: any) => addDomEvent(el, 'scroll', update, { passive: true })))
  }

  return callAll(addResizeListeners(), addScrollListeners())
}
