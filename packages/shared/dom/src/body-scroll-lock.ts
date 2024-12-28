import { isDom, isIos, noop, pipe } from '@destyler/utils'
import scrollIntoView from 'scroll-into-view-if-needed'
import { addDomEvent } from './listener'
import { getScrollParent } from './scrollable'

interface PreventScrollOptions {
  disabled?: boolean
  allowPinchZoom?: boolean
  document?: Document
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset'])

export function preventBodyScroll(opts?: PreventScrollOptions) {
  const { document: docProp, disabled = false, allowPinchZoom } = opts ?? {}

  const doc = docProp ?? document
  const win = doc?.defaultView ?? window

  const viewport = isDom() ? win.visualViewport : null
  const docEl = doc.documentElement

  function preventScrollStandard() {
    if (docEl.hasAttribute('scroll-lock'))
      return

    const fn = pipe(
      setStyle(docEl, 'paddingRight', `${win.innerWidth - docEl.clientWidth}px`),
      setStyle(docEl, 'overflow', 'hidden'),
      () => docEl.setAttribute('scroll-lock', 'true'),
    )

    return pipe(fn, () => docEl.removeAttribute('scroll-lock'))
  }

  function preventScrollMobileSafari() {
    if (docEl.hasAttribute('scroll-lock'))
      return

    let scrollable: HTMLElement | undefined
    let lastY = 0

    const onTouchStart = (e: TouchEvent) => {
      scrollable = getScrollParent(e.target as HTMLElement)

      if (scrollable === docEl && scrollable === doc.body) {
        return
      }
      lastY = e.changedTouches[0].pageY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && allowPinchZoom)
        return

      if (!scrollable || scrollable === docEl || scrollable === doc.body) {
        e.preventDefault()
        return
      }

      const y = e.changedTouches[0].pageY
      const scrollTop = scrollable.scrollTop
      const bottom = scrollable.scrollHeight - scrollable.clientHeight

      if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
        e.preventDefault()
      }

      lastY = y
    }

    const onTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target instanceof win.HTMLInputElement && !nonTextInputTypes.has(target.type)) {
        e.preventDefault()
        target.style.transform = 'translateY(-2000px)'
        target.focus()
        win.requestAnimationFrame(() => {
          target.style.transform = ''
        })
      }
    }

    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target instanceof win.HTMLInputElement && !nonTextInputTypes.has(target.type)) {
        target.style.transform = 'translateY(-2000px)'
        win.requestAnimationFrame(() => {
          target.style.transform = ''
          if (!viewport)
            return

          if (viewport.height < win.innerHeight) {
            win.requestAnimationFrame(() => {
              scrollIntoView(target, { scrollMode: 'if-needed' })
            })
          }
          else {
            const onResize = () => {
              scrollIntoView(target, { scrollMode: 'if-needed' })
            }
            addDomEvent(viewport, 'resize', onResize, { once: true })
          }
        })
      }
    }

    const onWindowScroll = () => {
      win.scrollTo(0, 0)
    }

    const scrollX = win.scrollX
    const scrollY = win.scrollY
    const restoreStyles = pipe(
      setStyle(docEl, 'paddingRight', `${win.innerWidth - docEl.clientWidth}px`),
      setStyle(docEl, 'overflow', 'hidden'),
      setStyle(doc.body, 'marginTop', `-${scrollY}px`),
    )

    win.scrollTo(0, 0)

    const removeEvents = pipe(
      addDomEvent(doc, 'touchstart', onTouchStart, { passive: false, capture: true }),
      addDomEvent(doc, 'touchmove', onTouchMove, { passive: false, capture: true }),
      addDomEvent(doc, 'touchend', onTouchEnd, { passive: false, capture: true }),
      addDomEvent(doc, 'focus', onFocus, true),
      addDomEvent(win, 'scroll', onWindowScroll),
      () => docEl.setAttribute('scroll-lock', 'true'),
    )

    return () => {
      restoreStyles()
      removeEvents()
      win.scrollTo(scrollX, scrollY)
      docEl.removeAttribute('scroll-lock')
    }
  }

  if (disabled)
    return noop
  return isIos() ? preventScrollMobileSafari() : preventScrollStandard()
}

function setStyle(el: HTMLElement, key: string, value: string) {
  const cur = el.style[key as any]
  el.style[key as any] = value
  return () => {
    el.style[key as any] = cur
  }
}
