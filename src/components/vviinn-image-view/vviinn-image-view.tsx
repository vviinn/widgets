import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
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

const widthMap = new Map<string, number | null>([
  ["portrait", null],
  ["rectangle", 288],
  ["landscape", 288],
]);

const heightMap = new Map<string, number | null>([
  ["portrait", 356],
  ["rectangle", 288],
  ["landscape", null],
]);

const ratioCalculator = new Map<string, (i: HTMLImageElement) => number>([
  ["portrait", (i) => i.naturalWidth / i.naturalHeight],
  ["rectangle", (_) => 1],
  ["landscape", (i) => i.naturalHeight / i.naturalWidth],
]);

const getImageSizes = (i: HTMLImageElement, o: string): [number, number] => {
  switch (o) {
    case "rectangle": {
      return [widthMap.get("rectangle"), heightMap.get("rectangle")];
    }
    case "landscape": {
      const width = widthMap.get("landscape");
      const ratioCalc = ratioCalculator.get("landscape");
      const ratio = ratioCalc(i);
      const height = width * ratio;

      return [width, height];
    }
    case "portrait": {
      const height = heightMap.get("portrait");
      const ratioCalc = ratioCalculator.get("portrait");
      const ratio = ratioCalc(i);
      const width = height * ratio;

      return [width, height];
    }
  }
};

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
        const [width, height] = getImageSizes(refImage, orientation);

        const image = (
          <img
            decoding="async"
            class={orientation}
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
