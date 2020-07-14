import { Component, ComponentInterface, h, Element } from '@stencil/core';

@Component({
  tag: 'slider-mouse',
  styleUrl: 'slider-mouse.css',
  shadow: true,
})
export class SliderMouse implements ComponentInterface {
  @Element() el: HTMLElement;

  private wrapperNode: HTMLDivElement;
  private contentNode: HTMLDivElement;

  isContentInRightBounds(): boolean {
    const contentSlot = this.contentNode.lastChild as HTMLSlotElement;
    const slotContent = contentSlot.assignedNodes({flatten: true})[0].lastChild as HTMLElement;
    const wrapperBounds = this.wrapperNode.getBoundingClientRect();
    
    return Math.floor(wrapperBounds.right) <= Math.floor(slotContent.getBoundingClientRect().right);
  }

  isContentInLeftBounds(): boolean {
    const contentSlot = this.contentNode.lastChild as HTMLSlotElement;
    const slotContent = contentSlot.assignedNodes({flatten: true})[0].firstChild as HTMLElement;
    const wrapperBounds = this.wrapperNode.getBoundingClientRect();
    
    return Math.floor(wrapperBounds.left) > Math.floor(slotContent.getBoundingClientRect().left);
  }

  next(): void {
    if(this.isContentInRightBounds()) {
      const translation = '--translation';
      const currentTranslation = getComputedStyle(this.contentNode).getPropertyValue(translation);
      const { width } = this.wrapperNode.getBoundingClientRect();

      this.contentNode.style.setProperty(translation, `${parseInt(currentTranslation) - width}px`)
    }
  }

  prev(): void {
    if(this.isContentInLeftBounds()) {
      const translation = '--translation';
      const currentTranslation = getComputedStyle(this.contentNode).getPropertyValue(translation);
      const { width } = this.wrapperNode.getBoundingClientRect();

      this.contentNode.style.setProperty(translation, `${parseInt(currentTranslation) + width}px`)
    }
  }

  render() {
    return (
      <div class="slider-body">
          <div class="prev"
               onClick={() => this.prev() }>
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="30"
                   height="30"
                   viewBox="0 0 512 512">
                  <title>previous</title>
                  <polyline points="328 112 184 256 328 400"/>
              </svg>
          </div>
          <div class="content-wrapper"
               ref={(el) => this.wrapperNode = el}>
              <div class="content"
                   ref={(el) => this.contentNode = el}>
                  <slot></slot>
              </div>
          </div>
          <div class="next"
               onClick={() => this.next() }>
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 512 512"
                   width="30"
                   height="30">
                  <title>next</title>
                  <polyline points="184 112 328 256 184 400"/>
              </svg>
          </div>
      </div>
    );
  }
}
