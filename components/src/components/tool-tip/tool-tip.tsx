import { Component, Host, h, Prop, Element, State, Listen } from '@stencil/core';

export type ToolTipPosition = 'left' | 'right' | 'bottom' | 'top';

export type ToolTipTrigger = 'hover' | 'click';

@Component({
  tag: 'cape-tool-tip',
  styleUrl: 'tool-tip.scss',
  shadow: true
})
export class ToolTip {
  @Element() element: HTMLElement;

  // TODO implement this
  @Prop() position: ToolTipPosition = 'top';
  @Prop() triggerEvent: ToolTipTrigger = 'hover';
  @Prop() delay: number = 0;
  @Prop() persist: number = 0;

  @State() visible: boolean;

  componentWillLoad() {
    this.element.setAttribute('cape', '');
  }

  componentDidLoad() {
    this.setToolTipPosition();
  }

  componentWillUpdate() {
    this.setToolTipPosition();
  }

  setToolTipPosition() {
    let { left, top } = this.element.getBoundingClientRect();

    this.element.style.setProperty('--position-left', left + 'px');
    this.element.style.setProperty('--position-top', window.innerHeight - top + 10 + 'px');
  }

  toggle() {
    const visible = !this.visible;
    this.element.style.setProperty('--transition-delay', '0s');

    if (visible) {
      // we're showing the tip
      this.element.style.setProperty('--transition-delay', this.delay / 1000 + 's');
      this.visible = visible;
    } else {
      // we're hiding the tip
      this.element.style.setProperty('--transition-delay', this.persist / 1000 + 's');
      this.visible = visible;
    }
  }

  @Listen('window:click')
  @Listen('window:keyup')
  handleClickOutside(event: MouseEvent | KeyboardEvent) {
    if (event instanceof MouseEvent && this.visible) {
      this.toggle();
    } else if (event instanceof KeyboardEvent && this.visible && event.key === 'Escape') {
      this.toggle();
    }
  }

  @Prop() tip: string;

  render() {
    return (
      <Host>
        <span onClick={(event) => event.stopPropagation()} class="tooltip-wrapper">
          <div class={{tooltip: true, 'tooltip--visible': this.visible}}>
            <slot name="tooltip"></slot>
          </div>
          <span
            onMouseEnter={this.triggerEvent === 'hover' && (() => this.toggle())}
            onMouseLeave={this.triggerEvent === 'hover' && (() => this.toggle())}
            onClick={this.triggerEvent === 'click' && (() => this.toggle())}
            class="target"
          >
            <slot name="target"></slot>
          </span>
        </span>
      </Host>
    );
  }

}
