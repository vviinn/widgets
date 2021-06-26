import { Component, Host, h, State, Event, EventEmitter } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
//import { scaleWithSized, center } from "../../geometry/Rectangle";
import { ValueObject } from "../../network/ion/ValueObject"
import { DetectedObject } from "../../searchSession/searchSession"

@Component({
  tag: "vviinn-image-view",
  styleUrl: "vviinn-image-view.css",
  shadow: true,
})
export class VviinnImageView {
  private image: HTMLImageElement | undefined;

  @Event() imageContainerResized: EventEmitter<void>;
  @State() imageLoaded: boolean = false;

  componentDidLoad() {
    const resizeObserver = new ResizeObserver(() => this.handleImageResize());
    resizeObserver.observe(this.image);
  }

  private handleImageLoad() {
    this.imageLoaded = true;
  }

  private handleImageResize() {
    imageSearchState.imageBounds = this.image.getBoundingClientRect()
  }

  private renderDetectedObject(
    object: ValueObject<DetectedObject>
  ): HTMLElement {
    return (
      <vviinn-detected-object
        detectedObject={object}
      />
    );
  }

  /* private renderLoader(): HTMLElement {
   *   const scale = scaleWithSized(imageSearchState.imageBounds);
   *   const { x, y } = center(scale(imageSearchState.searchArea));

   *   return (
   *     <div class="loader" style={{ top: `${y}px`, left: `${x}px` }}>
   *       <svg
   *         aria-hidden="true"
   *         focusable="false"
   *         role="img"
   *         xmlns="http://www.w3.org/2000/svg"
   *         viewBox="0 0 512 512"
   *       >
   *         <path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" />
   *       </svg>
   *     </div>
   *   );
   * }
   */
  render() {
    return (
      <Host>
        <highlight-box />
        <img
          ref={(el) => (this.image = el)}
          src={imageSearchState.resizedImageUrl}
          onLoad={() => this.handleImageLoad()}
        />
        {this.imageLoaded ? <image-cropper /> : null}
        {imageSearchState.detectedObjects.map((o) => this.renderDetectedObject(o))}
      </Host>
    );
  }
}
