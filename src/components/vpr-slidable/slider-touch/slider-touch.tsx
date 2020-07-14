import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'slider-touch',
  styleUrl: 'slider-touch.css',
  shadow: true,
})
export class SliderTouch implements ComponentInterface {

  render() {
    return (
      <div><h1>HELLO TOUCH!</h1><slot></slot></div>
    );
  }

}
