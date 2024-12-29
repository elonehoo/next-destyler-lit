import * as checkbox from '@destyler/checkbox'
import { mergeProps, normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Checkbox() {
  const [state, send] = useMachine(
    checkbox.machine({
      id: useId(),
    }),
  )

  const api = checkbox.connect(state, send, normalizeProps)

  const inputProps = mergeProps(api.inputProps, {
    onChange() {
      if (api.isIndeterminate && !api.isReadOnly) {
        api.setIndeterminate(false)
        api.setChecked(true)
      }
    },
  })

  return (
    <>
      <main className="checkbox">
        <form>
          <fieldset>
            <label {...api.rootProps}>
              <span {...api.labelProps}>
                Input
                {' '}
                {api.isChecked ? 'Checked' : 'Unchecked'}
              </span>
              <input {...inputProps} />
              <div style={{ border: '1px solid', width: '10px', height: '10px' }} {...api.controlProps} />
            </label>

            <button type="button" disabled={api.isChecked} onClick={() => api.setChecked(true)}>
              Check
            </button>
            <button type="button" disabled={!api.isChecked} onClick={() => api.setChecked(false)}>
              UnCheck
            </button>
            <button type="reset">Reset Form</button>
          </fieldset>
        </form>
      </main>
    </>
  )
}
