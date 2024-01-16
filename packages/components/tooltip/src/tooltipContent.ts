import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { injectTooltipRootContext } from './tooltipRoot'
import { DestylerTooltipContentImpl, destylerTooltipContentImplEmits, destylerTooltipContentImplProps } from './tooltipContentImpl'
import { DestylerTooltipContentHoverable } from './tooltipContentHoverable'

export const destylerTooltipContentProps = {
  ...destylerTooltipContentImplProps,
}

export const destylerTooltipContentEmits = [...destylerTooltipContentImplEmits]

export const DestylerTooltipContent = defineComponent({
  name: 'DestylerTooltipContent',
  props: destylerTooltipContentProps,
  emits: destylerTooltipContentEmits,
  setup(props, { emit }) {
    const rootContext = injectTooltipRootContext()
    const forwarded = useForwardPropsEmits(props, emit)

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    const useVShow = this.rootContext.open.value
    return useVShow
      ? h(this.rootContext.disableHoverableContent.value ? DestylerTooltipContentImpl : DestylerTooltipContentHoverable, {
        ...this.forwarded,
      }, this.$slots.default?.())
      : null
  },
})