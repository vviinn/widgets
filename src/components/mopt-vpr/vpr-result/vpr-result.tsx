import { Component, ComponentInterface, Host, h, Prop, Element } from '@stencil/core';
import { Interfaces } from '../../../interfaces/recommendation';

@Component({
  tag: 'vpr-result',
  styleUrl: 'vpr-result.css',
  shadow: true,
})
export class VprResult implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() item: Interfaces['VisualProductSearch'];
  @Prop() imageWidth: number;
  @Prop() imageRatio: number;

  async componentWillLoad() {
    this.el.style.setProperty('--image-height', `${this.imageWidth * this.imageRatio}px`);
  }

  render() {
    return (
      <Host>
          <img src={this.item.image.original}
               width={this.imageWidth}
               height={this.imageWidth * this.imageRatio}
               alt={this.item.title}>
          </img>
          <span>{this.item.title}</span>
      </Host>
    );
  }
}
