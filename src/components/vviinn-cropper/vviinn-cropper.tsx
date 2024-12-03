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
  Watch,
} from "@stencil/core";
import Cropper from "cropperjs";
import styles from "./vviinn-cropper.css";
import { ValueObject } from "../../network/ion/ValueObject";
import { fromImage } from "../../geometry/Rectangle";
import { DetectedObject } from "../../searchSession/searchSession";
import {
  BasicEventData,
  SelectObjectEventData,
} from "../../recommendation/events";
import { SearchArea, LoadImageEventData } from "./types";
import { ValidateCropBoxData } from "./helpers";
import {
  INITIAL_CROP_AREA_OFFSET,
  SUPPORTED_ASPECT_RATIO,
  MIN_IMAGE_SIDE_FOR_CROPPER,
  cropperOptions,
} from "./constants";
import { searchState } from "../../store/search.store";
import * as O from "fp-ts/lib/Option";

@Component({
  tag: "vviinn-cropper",
  shadow: true,
  styles,
})
export class VviinnCropper {
  @Element() el: HTMLElement;

  @Prop() basicEventDataString: string;
  @Prop() detectedObjectsString: string;
  @Prop() url: string;
  @Prop() width: number;
  @Prop() height: number;

  @State() detectedObjects: ValueObject<DetectedObject>[];
  @State() basicEventData: BasicEventData;
  @State() cropper: Cropper = null;

  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;
  @Event() vviinnCropperLoadImage: EventEmitter<LoadImageEventData>;
  @Event() vviinnCropperCropEnd: EventEmitter<SearchArea>;
  @Event() vviinnCropperAspectRatioError: EventEmitter<boolean>;
  @Event() vviinnCropperHidePreloader: EventEmitter<boolean>;

  disconnectedCallback() {
    if (this.cropper) this.cropper.destroy();
  }

  connectedCallback() {
    this.stringParser(true, true);
  }

  @Watch("basicEventDataString")
  basicEventDataStringWatcher() {
    this.stringParser(true);
  }

  @Watch("detectedObjectsString")
  detectedObjectsStringWatcher() {
    this.stringParser(false, true);
  }

  stringParser(
    TriggerBasicEventData?: boolean,
    TriggerDetectedObjects?: boolean
  ) {
    if (this.basicEventDataString && TriggerBasicEventData) {
      this.basicEventData = JSON.parse(
        this.basicEventDataString
      ) as BasicEventData;
    }
    if (this.detectedObjectsString && TriggerDetectedObjects) {
      this.detectedObjects = JSON.parse(
        this.detectedObjectsString
      ) as ValueObject<DetectedObject>[];
      console.log("top", this.detectedObjects);
    }
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

  private getCropboxData(): SearchArea {
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

      this.vviinnCropperLoadImage.emit({ imageBounds, searchArea });
      searchState.imageBounds = O.some(imageBounds);
      searchState.searchArea = O.some(searchArea);

      if (
        width / height < SUPPORTED_ASPECT_RATIO ||
        height / width < SUPPORTED_ASPECT_RATIO
      ) {
        this.vviinnCropperAspectRatioError.emit(true);
        return;
      }

      if (
        width < MIN_IMAGE_SIDE_FOR_CROPPER ||
        height < MIN_IMAGE_SIDE_FOR_CROPPER
      ) {
        this.vviinnCropperHidePreloader.emit(true);
        return;
      }

      this.cropper = new Cropper(imageElement, {
        ...cropperOptions,
        cropend: this.cropEnd,
        data,
      });
    }
  }

  private cropEnd = () => {
    const cropboxData = this.getCropboxData();
    this.vviinnCropperCropEnd.emit(cropboxData);
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

  render() {
    return (
      <Host>
        <div
          class="image-container"
          style={{ width: `${this.width.toString()}px`, overflow: "hidden" }}
        >
          <img
            decoding="async"
            width={this.width}
            height={this.height}
            src={this.url}
            draggable={false}
            onLoad={() => this.loadImage()}
          />

          {this.detectedObjects &&
            this.detectedObjects.map((o) => this.renderDetectedObject(o))}
        </div>
      </Host>
    );
  }
}
