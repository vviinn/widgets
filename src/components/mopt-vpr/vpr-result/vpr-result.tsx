import { Component, ComponentInterface, Prop, Element, Host, h } from '@stencil/core';
import { Interfaces } from '../../../interfaces/recommendation';
import { Image, Title, Price, Brand, ProductType } from './render-helpers';
import state from '../../../store/store';

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
    return <Host exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type">
        <style>{state.fallbackStyles}</style>
        {this.item === undefined
        ? null
        : [
          Image(this.item, this.imageWidth, this.imageWidth * this.imageRatio),
          Title(this.item),
          Brand(this.item),
          ProductType(this.item),
          Price(this.item, state.pricePrefix, state.currencySign)
        ]}
    </Host>
  }
}

