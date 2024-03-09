import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Listen,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import Cropper from "cropperjs";

import {
  imageSearchState,
  makeRectangularSearchRequest,
} from "../../store/imageSearch.store";
import { ValueObject } from "../../network/ion/ValueObject";
import { DetectedObject } from "../../searchSession/searchSession";
import { sequenceToOption } from "../../utils/option/option";
import { fromImage } from "../../geometry/Rectangle";
import { dimensionsFromImage, scaleByLargestSide } from "../../Image/sizing";
import styles from "./vviinn-image-view.css";
import {
  BasicEventData,
  SelectObjectEventData,
} from "../../recommendation/events";

const INITIAL_CROP_AREA = 0.91;
const INITIAL_CROP_AREA_OFFSET = 1 - INITIAL_CROP_AREA;
const MIN_SEARCH_AREA_SIZE = 82;
const MIN_IMAGE_SIDE_FOR_CROPPER = 90;
const SUPPORTED_ASPECT_RATIO = 0.1;
const DEFAULT_IMAGE_SIZE = 288;

type CropBoxData = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const cropperOptions: Cropper.Options = {
  autoCropArea: INITIAL_CROP_AREA,
  minCropBoxHeight: MIN_SEARCH_AREA_SIZE,
  minCropBoxWidth: MIN_SEARCH_AREA_SIZE,
  minContainerWidth: MIN_IMAGE_SIDE_FOR_CROPPER,
  minContainerHeight: MIN_IMAGE_SIDE_FOR_CROPPER,
  movable: false,
  zoomable: false,
  rotatable: false,
  scalable: false,
  zoomOnTouch: false,
  zoomOnWheel: false,
  toggleDragModeOnDblclick: false,
  viewMode: 1,
};

const getImageSizes = (i: HTMLImageElement): [number, number] => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(DEFAULT_IMAGE_SIZE);
  const newDimensions = resize(dimensions);

  const sizes = newDimensions.map((d) => d.size);
  return [sizes[0], sizes[1]];
};

const ValidateCropBoxData = (cropBoxData: CropBoxData) => {
  const { width, height, left, top } = cropBoxData;
  const minSize = MIN_SEARCH_AREA_SIZE;
  let result = {
    width,
    height,
    left,
    top,
  };

  if (width < minSize) {
    result.width = minSize;
    const deltaX = minSize - width;
    result.left = left - deltaX / 2;
  }
  if (height < minSize) {
    result.height = minSize;
    const deltaY = minSize - height;
    result.top = top - deltaY / 2;
  }

  return result;
};

@Component({
  tag: "vviinn-image-view",
  shadow: true,
  styles,
})
export class VviinnImageView {
  @Element() el: HTMLElement;

  @Prop() basicEventData: BasicEventData;
  @Prop() setShowAspectRatioError: (isError: boolean) => void;

  @State() cropper: Cropper = null;

  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;

  disconnectedCallback() {
    if (this.cropper) this.cropper.destroy();
  }

  @Listen("vviinnSelectObject")
  selectDetectedObject({ detail }: CustomEvent<SelectObjectEventData>) {
    const { top, left, width, height } = detail.detectedObject.value.rectangle;
    const data = this.cropper.getImageData();

    const cropBoxData = {
      left: left * data.width,
      top: top * data.height,
      width: width * data.width,
      height: height * data.height,
    };

    this.cropper.setCropBoxData(ValidateCropBoxData(cropBoxData));
  }

  private getCropboxData() {
    const { left, top, width, height } = this.cropper.getCropBoxData();
    return {
      x: left,
      y: top,
      width,
      height,
    };
  }

  private loadImage() {
    const imageElement = this.el.shadowRoot.querySelector("img");

    if (imageElement) {
      let data = {};
      if (this.cropper) {
        data = this.cropper.getData(true);
        this.cropper.destroy();
      }

      const imageBounds = fromImage(imageElement);
      const { x, y, width, height } = imageBounds;

      const searchArea = {
        x,
        y,
        width: width - width * INITIAL_CROP_AREA_OFFSET,
        height: height - height * INITIAL_CROP_AREA_OFFSET,
      };

      imageSearchState.imageBounds = O.some(imageBounds);
      imageSearchState.searchArea = O.some(searchArea);

      if (
        width / height < SUPPORTED_ASPECT_RATIO ||
        height / width < SUPPORTED_ASPECT_RATIO
      ) {
        this.setShowAspectRatioError(true);
        return;
      }

      if (
        width < MIN_IMAGE_SIDE_FOR_CROPPER ||
        height < MIN_IMAGE_SIDE_FOR_CROPPER
      )
        return;

      if (width > height) {
        const container = this.el.shadowRoot.querySelector(".container");
        container.classList.remove("squared");
      }

      this.cropper = new Cropper(imageElement, {
        ...cropperOptions,
        cropend: this.cropEnd,
        data,
      });
    }
  }

  private cropEnd = () => {
    imageSearchState.searchArea = O.some(this.getCropboxData());
    makeRectangularSearchRequest();
    imageSearchState.detectedObject = undefined;
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
        <div class="container squared">
          <div class="image-container">
            {this.renderImage()}
            {imageSearchState.detectedObjects.map((o) =>
              this.renderDetectedObject(o)
            )}
          </div>

          {imageSearchState.loading ||
          imageSearchState.objectDetectionInProgress ? (
            <div class="image-preloader">
              <vviinn-preloader />
            </div>
          ) : null}
        </div>
      </Host>
    );
  }
}
