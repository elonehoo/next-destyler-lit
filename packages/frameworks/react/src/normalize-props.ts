import type { HTMLAttributes } from "react"
import { createNormalizer } from "@destyler/types"

type PropTypes = JSX.IntrinsicElements & {
  element: HTMLAttributes<HTMLElement>
}

export const normalizeProps = createNormalizer<PropTypes>(v => v)
