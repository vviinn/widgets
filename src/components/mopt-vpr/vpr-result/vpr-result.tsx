import { Component, ComponentInterface, Prop, Element } from '@stencil/core';
import { Interfaces } from '../../../interfaces/recommendation';
import { Image, Title, Price } from './render-helpers';

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
           Image(this.item, this.imageWidth, this.imageWidth * this.imageRatio),
           Title(this.item),
           Price(this.item)
         ];
  }
}

