import { Component, Host, h, Element, Prop, State, Event, Listen, EventEmitter } from '@stencil/core';

@Component({
  tag: 'cape-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: true
})
export class Dropdown {
  @Element() element: HTMLElement;

  @Prop({ mutable: true }) currentlySelected: string;

  @State() list: HTMLElement;
  @State() open = false;
  @State() enteredList: boolean;
  

  currentlySelectedIndex: number;
  loaded = false;
  clickedInside = false;
  options: HTMLElement[];

  @Event() selected: EventEmitter;

  componentWillLoad() {
    this.element.setAttribute('cape', '');
  }

  componentDidRender() {
    if (!this.loaded) {
      this.processListElement();
      this.loaded = true;
    }
  }

  processListElement() {
    this.list = this.element.shadowRoot.querySelector('slot').assignedElements()[0] as HTMLElement
    this.options = Array.from(this.list.children) as HTMLElement[];

    if (!this.currentlySelected) {
      this.currentlySelected = this.options[0].getAttribute('key');
      this.currentlySelectedIndex = 0;
    } else {
      this.currentlySelectedIndex = this.options.map(x => x.getAttribute('key')).indexOf(this.currentlySelected);
    }

    this.list.classList.add('cape-dropdown__list');
  }

  select(key: string, index) {
    this.currentlySelected = key;
    this.currentlySelectedIndex = index;
    this.selected.emit(key);
  }

  toggle() {
    this.open = !this.open
    
    if (!this.open) {
      (this.element.shadowRoot.querySelector('.dropdown__handle') as HTMLElement).focus()
      this.enteredList = false;
    }
  }

  focus(index: number) {
    console.log('focus called');
    (this.element.shadowRoot.querySelector('ul [data-key="' + index + '"]') as HTMLElement).focus();
  }

  @Listen('window:click')
  @Listen('window:keyup')
  handleOutsideClick(event: MouseEvent | KeyboardEvent) {
    if (this.open) {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') {
          this.toggle();
        }
      } else if (event instanceof MouseEvent) {
        this.toggle();
      }
    }
  }

  render() {
    return (
      <Host>
        { /* This doesn't get rendered, only exists to retrieve markup from slot */ }
        <div style={{display: 'none'}}><slot></slot></div>

        <div class={{dropdown: true, 'dropdown--active': this.open}}>
          <button onClick={(event) => { event.stopPropagation(); this.toggle() }} class="dropdown__handle">
            { this.options && this.options[this.currentlySelectedIndex].textContent }
            <div class="handle__icon"></div>
          </button>
          <input onFocus={() => { this.focus(this.options.length - 1) }} tabIndex={this.enteredList ? 0 : -1} style={ { opacity: '0', position: 'fixed', width: '0', height: '0', left: '-99999px' } } />
          <ul>
            { this.list && this.open && this.options.map((o, i) => {
              const key = o.getAttribute('key');
              return (
                <button
                  onFocus={() => this.enteredList = true}
                  tabIndex={0}
                  data-key={i}
                  onClick={() => { this.select(key, i); this.toggle() }}
                  class={{ 'dropdown-list__item--selected': key === this.currentlySelected }}
                  innerHTML={o.outerHTML}
                ></button>
              );
            }) }
          </ul>
          <input onFocus={() => { this.focus(0) }} tabIndex={this.open ? 0 : -1} style={ { opacity: '0', position: 'fixed', width: '0', height: '0', left: '-99999px' } } />
        </div>
      </Host>
    );
  }

}
