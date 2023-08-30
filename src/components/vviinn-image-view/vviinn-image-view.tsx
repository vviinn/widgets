import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import {
  imageSearchState,
  makeRectangularSearchRequest,
} from "../../store/imageSearch.store";
import { ValueObject } from "../../network/ion/ValueObject";
import { DetectedObject } from "../../searchSession/searchSession";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { sequenceToOption } from "../../utils/option/option";
import { fromImage, move } from "../../geometry/Rectangle";
import { dimensionsFromImage, scaleByLargestSide } from "../../Image/sizing";
import styles from "./vviinn-image-view.css";
import { BasicEventData } from "../../recommendation/events";
import Cropper from "cropperjs";

const cropperOptions: Cropper.Options = {
  autoCropArea: 0.92,
  movable: false,
  zoomable: false,
  rotatable: false,
  scalable: false,
  zoomOnTouch: false,
  zoomOnWheel: false,
  toggleDragModeOnDblclick: false,
};

const getImageSizes = (i: HTMLImageElement): [number, number] => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(288);
  const newDimensions = resize(dimensions);

  const sizes = newDimensions.map((d) => d.size);

  return [sizes[0], sizes[1]];
};

@Component({
  tag: "vviinn-image-view",
  shadow: true,
  styles,
})
export class VviinnImageView {
  @Element() el: HTMLElement;

  @Prop() basicEventData: BasicEventData;
  @State() cropper: Cropper = null;

  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;

  private loadImage() {
    const imageElement = this.el.shadowRoot.querySelector("img");
    if (imageElement) {
      if (this.cropper) {
        this.cropper.destroy();
      }

      this.cropper = new Cropper(imageElement, {
        ...cropperOptions,
        cropend: this.cropEnd,
      });

      const imageBounds = fromImage(imageElement);
      const padding = 12;
      const { x, y } = move(imageBounds, { x: padding, y: padding });

      const searchArea = {
        x,
        y,
        width: imageBounds.width - padding * 2,
        height: imageBounds.height - padding * 2,
      };

      imageSearchState.imageBounds = O.some(imageBounds);
      imageSearchState.searchArea = O.some(searchArea);
    }
  }

  private cropEnd = () => {
    const { aspectRatio } = this.cropper.getImageData();
    const data = this.cropper.getData(true);
    data.width = Math.round(data.width * aspectRatio);
    data.height = Math.round(data.height * aspectRatio);

    imageSearchState.searchArea = O.some(data);
    makeRectangularSearchRequest();
    this.vviinnImageCrop.emit(this.basicEventData);
  };

  private renderDetectedObject(
    object: ValueObject<DetectedObject>
  ): HTMLElement {
    return (
      <vviinn-detected-object
        detectedObject={object}
        basicEventData={this.basicEventData}
      />
    );
  }

  private renderImage(): HTMLImageElement | null {
    return pipe(
      sequenceToOption(imageSearchState.imageUrl, imageSearchState.image),
      O.map(([url, refImage]) => {
        const [width, height] = getImageSizes(refImage);

        return (
          <img
            decoding="async"
            width={width}
            height={height}
            src={url}
            draggable={false}
            onLoad={() => this.loadImage()}
          />
        );
      }),
      O.getOrElse(() => null)
    );
  }

  render() {
    return (
      <Host>
        {imageSearchState.loading ||
        imageSearchState.objectDetectionInProgress ? (
          <div class="image-preloader">
            <vviinn-preloader />
          </div>
        ) : null}
        {<div>{this.renderImage()}</div>}
        {imageSearchState.detectedObjects.map((o) =>
          this.renderDetectedObject(o)
        )}
      </Host>
    );
  }
}
