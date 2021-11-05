import { Component, h } from '@stencil/core';

@Component({
  tag: 'vviinn-skeleton',
  shadow: false,
})
export class VviinnSkeleton {

  render() {
    return [<slot name="kek"></slot>];
  }

}
