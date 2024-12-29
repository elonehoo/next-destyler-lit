import * as accordion from '@destyler/accordion'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

function Accordion() {
  const [state, send] = useMachine(
    accordion.machine({
      id: useId(),
    }),
  )

  const api = accordion.connect(state, send, normalizeProps)

  const accordionData = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]
  return (
    <>
      <div {...api.rootProps}>
        {accordionData.map(item => (
          <div key={item.id} {...api.getItemProps({ value: item.id })}>
            <button {...api.getTriggerProps({ value: item.id })}>
              {item.label}
            </button>
            <div {...api.getContentProps({ value: item.id })}>
              this is
              {' '}
              { item.id }
              {' '}
              { item.label }
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Accordion
