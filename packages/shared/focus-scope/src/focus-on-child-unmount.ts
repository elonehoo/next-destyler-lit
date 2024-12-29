import type { FocusContext } from "./focus-context"
import { getActiveElement } from "@destyler/dom"

export function focusOnChildUnmountEffect(ctx: FocusContext) {
  const { node, win, doc } = ctx

  const observer = new win.MutationObserver(([mutation]) => {
    if (!mutation || mutation.target !== node) 
return
    const activeElement = getActiveElement(node)
    if (activeElement !== doc.body) 
return
    node.focus({ preventScroll: true })
  })

  observer.observe(node, { childList: true, subtree: true })
  return () => observer.disconnect()
}
