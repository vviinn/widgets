import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'vpr-result',
  styleUrl: 'vpr-result.css',
  shadow: true,
})
export class VprResult implements ComponentInterface {
  @Prop() item: any;
  
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
