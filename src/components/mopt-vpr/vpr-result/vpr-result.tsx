import { Component, ComponentInterface, h, Prop, Element } from '@stencil/core';
import { Interfaces } from '../../../interfaces/recommendation';

@Component({
  tag: 'vpr-result',
  styleUrl: 'vpr-result.css',
  shadow: true,
})
export class VprResult implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() item: Interfaces['VisualProductSearch'];
  @Prop() imageWidth: number = 100;
  @Prop() imageRatio: number = 1.5;

  async componentWillLoad() {
    this.el.style.setProperty('--image-height', `${this.imageWidth * this.imageRatio}px`);
  }

  render() {
    return this.item === undefined
         ? null
         : [
           <img src={this.item.image.original}
                width={this.imageWidth}
                height={this.imageWidth * this.imageRatio}
                alt={this.item.title}>
           </img>,
           <span>{this.item.title}</span>
         ];
  }
}

