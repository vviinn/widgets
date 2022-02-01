import * as O from "fp-ts/lib/Option";
export declare class VviinnSlider {
  el: HTMLElement;
  elementsCount: number;
  internalPosition: number;
  swipeStartPosition: O.Option<number>;
  showBullets: boolean;
  position: number;
  showArrows: boolean;
  positionWatchHandler(newValue: number): void;
  connectedCallback(): void;
  private handleDomContentChanges;
  private setActiveCssClassToSlide;
  private goToSlide;
  private renderBullets;
  private nextSlide;
  private prevSlide;
  private renderSlidePosition;
  private handleKeyDown;
  private handleTouchStart;
  private handleTouchEnd;
  render(): any;
}
