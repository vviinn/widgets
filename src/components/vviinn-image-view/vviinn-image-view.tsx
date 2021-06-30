import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
//import { scaleWithSized, center } from "../../geometry/Rectangle";
import { ValueObject } from "../../network/ion/ValueObject";
import { DetectedObject } from "../../searchSession/searchSession";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { sequenceToOption } from "../../utils/option/option";
import { fromImage, move } from "../../geometry/Rectangle";
import * as N from "fp-ts/number";

enum ImageOrientation {
  "portrait" = -1,
  "rectangle" = 0,
  "landscape" = 1,
}

@Component({
  tag: "vviinn-image-view",
  styleUrl: "vviinn-image-view.css",
  shadow: true,
})
export class VviinnImageView {
  handleInitialImageLoad(ev: Event) {
    const target = ev.target as HTMLImageElement;
    const imageBounds = fromImage(target);

    const padding = 16;
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
    return <vviinn-detected-object detectedObject={object} />;
  }

  private renderImage(): HTMLImageElement | null {
    return pipe(
      sequenceToOption(imageSearchState.imageUrl, imageSearchState.image),
      O.map(([url, refImage]) => {
        const sizeOrd = N.Ord.compare(
          refImage.naturalWidth,
          refImage.naturalHeight
        );

        const orientation = ImageOrientation[sizeOrd];

        const image = (
          <img
            class={orientation}
            src={url}
            onLoad={(el) => this.handleInitialImageLoad(el)}
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
      O.map(() => <image-cropper />),
      O.getOrElse(() => null)
    );
  }

  render() {
    return (
      <Host>
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

/**
        <highlight-box />
        {imageSearchState.detectedObjects.map((o) =>
          this.renderDetectedObject(o)
        )}
        {this.imageLoaded ? <image-cropper /> : null}
**/
