import { Component, Host, h, Prop } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
import { ValueObject } from "../../network/ion/ValueObject";
import { DetectedObject } from "../../searchSession/searchSession";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { sequenceToOption } from "../../utils/option/option";
import { fromImage, move } from "../../geometry/Rectangle";
import { dimensionsFromImage, scaleByLargestSide } from "../../Image/sizing";
import styles from "./vviinn-image-view.css";
import { BasicEventData } from "../../recommendation/events";

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
  @Prop() basicEventData: BasicEventData;

  handleInitialImageLoad(ev: Event) {
    const target = ev.target as HTMLImageElement;
    const imageBounds = fromImage(target);
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

        const image = (
          <img
            decoding="async"
            width={width}
            height={height}
            src={url}
            onLoad={(el) => this.handleInitialImageLoad(el)}
            draggable={false}
          />
        );

        return image;
      }),
      O.getOrElse(() => null)
    );
  }

  private renderCropper(): HTMLImageCropperElement | null {
    return pipe(
      imageSearchState.imageUrl,
      O.map(() => <image-cropper basicEventData={this.basicEventData} />),
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
        <highlight-box />
        {this.renderImage()}
        {this.renderCropper()}
        {imageSearchState.detectedObjects.map((o) =>
          this.renderDetectedObject(o)
        )}
      </Host>
    );
  }
}
