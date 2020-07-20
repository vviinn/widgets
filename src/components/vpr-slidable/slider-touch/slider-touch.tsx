import { Component, ComponentInterface, h, Listen } from '@stencil/core';

@Component({
  tag: 'slider-touch',
  styleUrl: 'slider-touch.css',
  shadow: true,
})
export class SliderTouch implements ComponentInterface {
  private contentNode: HTMLDivElement;
  private touchMoveListener = this.handleTouchMove.bind(this);
  private touchEndListener = this.handleTouchEnd.bind(this);
  
  @Listen('touchstart')
  handleTouchStart() {    
    this.contentNode.addEventListener('touchmove', this.touchMoveListener);
    this.contentNode.addEventListener('touchend', this.touchEndListener);
  }

  handleTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  handleTouchEnd() {
    this.contentNode.removeEventListener('touchmove', this.touchMoveListener);
    this.contentNode.removeEventListener('touchend', this.touchEndListener);
  }
  
  render() {
    return (
      <div class="slider-body">
          <div class="content-wrapper">
              <div class="content"
                   ref={(el) => this.contentNode = el}>
                  <slot></slot>
              </div>
          </div>
      </div>
    );
  }

}
