export declare class ImageCropper {
  el: HTMLElement;
  disabled: boolean;
  handleMove: boolean;
  private handlerMoveDirection;
  private mouseStartPoint;
  private pointerMoveListener;
  private pointerReleaseListener;
  private bounds;
  componentDidLoad(): void;
  private handleHandlerMove;
  private handleCropperMove;
  private handlePointerDown;
  private handleSearchAreaRelease;
  private getStyleMap;
  render(): any;
}
