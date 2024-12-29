type Root = Document | Element | null | undefined

export function queryAll<T extends HTMLElement = HTMLElement>(root: Root, selector: string) {
  return Array.from(root?.querySelectorAll<T>(selector) ?? [])
}

export function query<T extends HTMLElement = HTMLElement>(root: Root, selector: string) {
  return root?.querySelector<T>(selector)
}

export function itemById<T extends HTMLElement>(v: T[], id: string) {
  return v.find(node => node.id === id)
}

export function indexOfId<T extends HTMLElement>(v: T[], id: string) {
  const item = itemById(v, id)
  return item ? v.indexOf(item) : -1
}

export function nextById<T extends HTMLElement>(v: T[], id: string, loop = true) {
  let idx = indexOfId(v, id)
  idx = loop ? (idx + 1) % v.length : Math.min(idx + 1, v.length - 1)
  return v[idx]
}

export function prevById<T extends HTMLElement>(v: T[], id: string, loop = true) {
  let idx = indexOfId(v, id)
  if (idx === -1) 
return loop ? v[v.length - 1] : null
  idx = loop ? (idx - 1 + v.length) % v.length : Math.max(0, idx - 1)
  return v[idx]
}

const getValueText = <T extends HTMLElement>(item: T) => item.dataset.valuetext ?? item.textContent ?? ''

const match = (valueText: string, query: string) => valueText.toLowerCase().startsWith(query.toLowerCase())

function wrap <T>(v: T[], idx: number) {
  return v.map((_, index) => v[(Math.max(idx, 0) + index) % v.length])
}

export function findByText<T extends HTMLElement>(v: T[], text: string, currentId?: string | null) {
  const index = currentId ? indexOfId(v, currentId) : -1
  let items = currentId ? wrap(v, index) : v

  const isSingleKey = text.length === 1

  if (isSingleKey) {
    items = items.filter(item => item.id !== currentId)
  }

  return items.find(item => match(getValueText(item), text))
}

export function sortByTreeOrder<T extends HTMLElement>(v: T[]) {
  return v.sort((a, b) => (a.compareDocumentPosition(b) & 2 ? 1 : -1))
}
