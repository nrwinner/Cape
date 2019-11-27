import { Component, Host, Prop, Event, Element, h, State, EventEmitter, Watch } from '@stencil/core';
import { setAccentColor } from '../../utils/color';

@Component({
  tag: 'cape-switch',
  styleUrl: 'switch.scss',
  shadow: true
})
export class Switch {

  @Prop() label: string
  @Prop() disabled: boolean;
  @Prop() accentColor: string;
  @Prop({ mutable: true }) activated: boolean;

  @State() classes: any = {
    switch: true,
  }

  @Element() element: HTMLElement;

  @Event() ontoggle: EventEmitter;

  componentWillLoad() {
    this.classes = { ...this.classes, 'switch--activated': this.activated, 'switch--disabled': this.disabled } 
    this.element.setAttribute('cape', '');

    if (this.accentColor) {
      setAccentColor(this.element, this.accentColor)
    }
  }

  componentWillUpdate() {
   this.classes = { ...this.classes, 'switch--activated': this.activated,
   'switch--disabled': this.disabled }
  }
  
  @Watch('activated')
  emitToggle(activated: boolean) {
    this.ontoggle.emit(activated);
  }

  render() {
    return (
      <Host>
        <button onClick={() => this.activated = !this.activated} class={this.classes}>
          { this.label && <div class="switch__label">{ this.label }</div> }
          <div class="switch__button">
            <div class="switch__fob"></div>
          </div>
        </button>
      </Host>
    );
  }

}
