import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@destyler/primitive'

@customElement('dialog-trigger')
export class DialogTrigger extends LitElement {
  private _onClick() {
    const event = new CustomEvent('destyler-dialog-open', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  override render() {
    const events = {
      click: this._onClick,
    }
    return html`
      <destyler-slot .events="${events}">
        <slot></slot>
      </destyler-slot>
    `
  }
}
