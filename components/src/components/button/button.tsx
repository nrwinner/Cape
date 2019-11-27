import { Component, Host, Element, Event, Prop, h, State, EventEmitter } from '@stencil/core';
import { setAccentColor } from '../../utils/color';

export type ButtonStyle = 'default' | 'default--inverted';
@Component({
  tag: 'cape-button',
  styleUrl: 'button.scss',
  shadow: true
})
export class Button {
  @Element() element: HTMLElement;

  @Prop() buttonStyle: ButtonStyle = 'default';
  @Prop() accentColor: string;
  @Prop() buttonDisabled: boolean;

  @State() classes: { [key: string]: boolean } = {};

  @Event() onclick: EventEmitter;

  componentWillLoad() {
    if (this.accentColor) {
      setAccentColor(this.element, this.accentColor);
    }

    this.classes[`button--style--${this.buttonStyle}`] = true;
    this.classes[`button--state--disabled`] = this.buttonDisabled;

    this.element.setAttribute('cape', '');
  }

  triggerClick() {
    if (!this.buttonDisabled) {
      this.onclick.emit();
    }
  }

  render() {
    return (
      <Host>
        <button tabIndex={this.buttonDisabled ? -1 : 0} onClick={() => this.triggerClick()} class={this.classes}>
          <slot></slot>
        </button>
      </Host>
    );
  }

}
