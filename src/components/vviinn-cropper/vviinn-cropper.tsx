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
import { state } from "../../store/store";
import { ValueObject } from "../../network/ion/ValueObject";
import { fromImage } from "../../geometry/Rectangle";
import {
  BasicEventData,
  SearchIdEvent,
  SelectObjectEventData,
} from "../../recommendation/events";
import { LoadImageEventData } from "./types";
import { ValidateCropBoxData } from "./helpers";
import {
  INITIAL_CROP_AREA_OFFSET,
  SUPPORTED_ASPECT_RATIO,
  MIN_IMAGE_SIDE_FOR_CROPPER,
  cropperOptions,
} from "./constants";
import {
  makeRectangularSearchRequest,
  searchState,
  componentsState,
  SearchStore,
  SearchStoreName,
} from "../../store/search.store";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { sequenceToOption } from "../../utils/option/option";
import { getImageSizes } from "../../Image/sizing";
import { Rectangle } from "../../interfaces/search";

const DEFAULT_IMAGE_SIZE = 288;

@Component({
  tag: "vviinn-cropper",
  shadow: true,
  styles,
})
export class VviinnCropper {
  @Element() el: HTMLElement;

  @Prop() apiPath?: string = "https://api.vviinn.com";
  @Prop() saveImageMode?: "once" | "always" | "never" = "never";

  @Prop({ mutable: true }) detectedObjectsString?: string;
  @Prop({ mutable: true }) url: string;
  @Prop({ mutable: true }) width: number;

  /** @internal */
  @Prop({ mutable: true }) height?: number;
  /** @internal */
  @Prop({ mutable: true }) basicEventData: BasicEventData;
  /** @internal */
  @Prop() showAspectRatioError: boolean;
  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() detectedObjects: ValueObject<Rectangle>[] = [];
  @State() cropper: Cropper = null;
  @State() selectedDetectedObject: ValueObject<Rectangle>;
  @State() imageBounds: Rectangle | null;
  @State() searchArea: Rectangle | null;
  @State() imageElement?: HTMLImageElement;

  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;
  @Event() vviinnCropperLoadImage: EventEmitter<LoadImageEventData>;
  @Event() vviinnCropperCropEnd: EventEmitter<Rectangle>;

  /** @internal */
  @Event() vviinnCropperAspectRatioError: EventEmitter<boolean>;

  private state?: SearchStore;
  private storeName?: SearchStoreName;

  connectedCallback() {
    document.addEventListener(
      "vviinnImageUploadStarted",
      this.imageUploadStartedHandler,
    );
    document.addEventListener(
      "vviinnImageUploadFinished",
      this.imageUploadFinishedHandler,
    );

    this.stringParser(true);
    state.apiPath = this.apiPath;
    this.state = this.showInWidget ? searchState : componentsState;
    this.storeName = this.showInWidget ? "widget" : "components";
    this.initPreloadedImage();
  }

  componentWillRender() {
    this.renderImage();
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnImageUploadStarted",
      this.imageUploadStartedHandler,
    );
    document.removeEventListener(
      "vviinnImageUploadFinished",
      this.imageUploadFinishedHandler,
    );

    if (this.cropper) this.cropper.destroy();
    componentsState.image = O.none;
  }

  @Watch("detectedObjectsString")
  detectedObjectsStringWatcher() {
    this.stringParser(true);
  }

  private initPreloadedImage = () => {
    if (this.saveImageMode === "never") return;
    this.state.image = O.none;

    const cropperImageSrc = localStorage.getItem("cropperImageSrc");
    if (!cropperImageSrc) return;

    const image = document.createElement("img");
    image.src = cropperImageSrc;
    this.state.image = O.some(image);

    this.saveImageMode === "once" && localStorage.removeItem("cropperImageSrc");
  };

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  private imageUploadFinishedHandler = () => {
    if (this.saveImageMode === "never") return;

    const image: HTMLImageElement = O.getOrElse(() => null)(this.state.image);
    if (image) localStorage.setItem("cropperImageSrc", image.src);
  };

  stringParser(TriggerDetectedObjects?: boolean) {
    if (this.detectedObjectsString && TriggerDetectedObjects) {
      this.detectedObjects = JSON.parse(
        this.detectedObjectsString,
      ) as ValueObject<Rectangle>[];
    }
  }

  @Listen("vviinnSelectObject")
  selectDetectedObject({ detail }: CustomEvent<SelectObjectEventData>) {
    this.selectedDetectedObject = detail.detectedObject;
    this.searchArea = detail.searchArea;
    const { top, left, width, height } = detail.detectedObject.value;
    const data = this.cropper.getImageData();

    const cropBoxData = {
      left: left * data.width,
      top: top * data.height,
      width: width * data.width,
      height: height * data.height,
    };
    this.cropper.setCropBoxData(ValidateCropBoxData(cropBoxData));
    makeRectangularSearchRequest(
      this.storeName,
      this.searchArea,
      this.imageBounds,
    );
  }

  private getDetectedObjects = () =>
    this.detectedObjects.length
      ? this.detectedObjects
      : this.state.detectedObjects;

  private imageUploadStartedHandler = ({ detail }: SearchIdEvent) => {
    if (this.cropper && !this.skipStateChanges(detail.isTriggeredByVpsWidget)) {
      this.cropper.replace(this.imageElement.src);
    }
  };

  private getCropboxData(): Rectangle {
    const { left, top, width, height } = this.cropper.getCropBoxData();
    return {
      left,
      top,
      width,
      height,
    };
  }

  private loadImage() {
    this.imageElement = this.el.shadowRoot.querySelector("img");
    if (this.imageElement) {
      let data = {};
      if (this.cropper) {
        data = this.cropper.getData(true);
        this.cropper.destroy();
      }
      const imageBounds = fromImage(this.imageElement);
      const { left, top, width, height } = imageBounds;

      const searchArea = {
        left,
        top,
        width: width - width * INITIAL_CROP_AREA_OFFSET,
        height: height - height * INITIAL_CROP_AREA_OFFSET,
      };

      this.vviinnCropperLoadImage.emit({ imageBounds, searchArea });
      this.imageBounds = imageBounds;
      this.searchArea = searchArea;

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
        return;
      }
      this.cropper = new Cropper(this.imageElement, {
        ...cropperOptions,
        cropend: this.cropEnd,
        ready: () => this.cropper.reset(),
        data,
      });
    }
  }

  private renderImage() {
    pipe(
      sequenceToOption(this.state.image),
      O.map(([refImage]) => {
        if (!refImage) return null;
        const [width, height] = getImageSizes(refImage, DEFAULT_IMAGE_SIZE);
        this.width = width;
        this.height = height;
        this.url = refImage.src;
      }),
      O.getOrElse(() => null),
    );
  }

  private cropEnd = () => {
    const cropboxData = this.getCropboxData();

    this.vviinnCropperCropEnd.emit(cropboxData);
    this.searchArea = cropboxData;
    makeRectangularSearchRequest(
      this.storeName,
      this.searchArea,
      this.imageBounds,
    );
    this.selectedDetectedObject = undefined;
    this.vviinnImageCrop.emit(this.basicEventData);
  };

  private showPreloader = () =>
    this.state.loading &&
    this.state.searchType === "image" &&
    !this.showAspectRatioError;

  render() {
    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
          active: !!this.imageElement,
        }}
      >
        <div class="container">
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

            {this.getDetectedObjects().map((object) => (
              <vviinn-detected-object
                detectedObject={object}
                selectedDetectedObject={this.selectedDetectedObject}
                basicEventData={this.basicEventData}
                imageBounds={this.imageBounds}
                showInWidget={this.showInWidget}
              />
            ))}
          </div>

          {this.showPreloader() && (
            <div class="image-preloader">
              <vviinn-preloader />
            </div>
          )}
        </div>
      </Host>
    );
  }
}
