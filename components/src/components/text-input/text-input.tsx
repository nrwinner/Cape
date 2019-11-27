import { Component, Host, Element, Prop, h, State, Watch, Event, EventEmitter } from '@stencil/core';
import { setAccentColor } from '../../utils/color';

@Component({
  tag: 'cape-text-input',
  styleUrl: 'text-input.scss',
  shadow: true
})
export class TextInput {
  @Element() element: HTMLElement;

  @Prop() placeholder: string;
  @Prop() type: string;
  @Prop() inputColor: string;
  @Prop({ mutable: true }) readonly: boolean;
  @Prop({ mutable: true }) value: string;

  @State() focused = false
  @State() filled = false;

  @Event() oninput: EventEmitter;
  @Event() onfocus: EventEmitter;
  @Event() onblur: EventEmitter;

  classes: { [key: string]: boolean } = { 'text-input': true };

  componentWillLoad() {
    if (this.inputColor) {
      setAccentColor(this.element, this.inputColor);
    }

    this.filled = this.value && this.value !== '';

    this.classes['text-input--focused'] = this.focused
    this.classes['text-input--filled'] = this.filled;

    this.element.setAttribute('cape', '');
  }

  componentWillUpdate() {
    this.classes['text-input--focused'] = this.focused
    this.classes['text-input--filled'] = this.filled;
  }

  @Watch('value')
  updateValue(newValue: string) {
    this.filled = newValue !== '';
    this.oninput.emit(newValue);
  }

  @Watch('focused')
  updateFocus(focused: boolean) {
    if (focused) {
      this.onfocus.emit();
    } else {
      this.onblur.emit();
    }
  }

  render() {
    return (
      <Host>
        <div class={this.classes}>
          <div class="text-input__input">
            <span class="text-input__placeholder">{ this.placeholder } { this.readonly ? '(Read-only)' : '' }</span>
            <input readonly={this.readonly} onInput={(event: any) => this.value = event.target.value} onFocus={() => this.focused = !this.readonly} onBlur={() => this.focused = false} type={this.type || 'text'} value={this.value} />
          </div>
        </div>
      </Host>
    );
  }

}
