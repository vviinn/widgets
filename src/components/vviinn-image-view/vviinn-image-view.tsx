import { Component, Host, h, State, Event, EventEmitter } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";

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
    this.imageContainerResized.emit();
  }

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
      </Host>
    );
  }
}
