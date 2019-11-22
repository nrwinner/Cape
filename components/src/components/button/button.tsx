import { Component, Host, Element, Event, Prop, h, State, EventEmitter } from '@stencil/core';
import { getHSL } from '../../utils/color';

export type ButtonStyle = 'default' | 'default--inverted';

@Component({
  tag: 'cape-button',
  styleUrl: 'button.scss',
  shadow: true
})
export class Button {
  @Element() element: HTMLElement;

  @Prop() buttonStyle: ButtonStyle = 'default';
  @Prop() buttonColor: string;
  @Prop() buttonDisabled: boolean;

  @State() classes: { [key: string]: boolean } = {};

  @Event() onclick: EventEmitter;

  connectedCallback() {
    if (this.buttonColor) {
      const [hue, saturation, lightness] = getHSL(this.buttonColor).match(/[0-9.%]+/g);

      this.element.style.setProperty('--button-color-h', hue);
      this.element.style.setProperty('--button-color-s', saturation);
      this.element.style.setProperty('--button-color-l', lightness);
    }

    this.classes[`button--style--${this.buttonStyle}`] = true;
    this.classes[`button--state--disabled`] = this.buttonDisabled;
  }

  triggerClick() {
    if (!this.buttonDisabled) {
      this.onclick.emit();
    }
  }

  render() {
    return (
      <Host>
        <button onClick={() => this.triggerClick()} class={this.classes}>
          <slot></slot>
        </button>
      </Host>
    );
  }

}
