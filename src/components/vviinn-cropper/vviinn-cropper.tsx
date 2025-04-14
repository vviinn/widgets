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
import { updateGlobalState } from "../../store/store";
import { fromImage } from "../../geometry/Rectangle";
import {
  BasicEventData,
  SearchIdEvent,
  SelectObjectEventData,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { LoadImageEventData } from "./types";
import { ValidateCropBoxData } from "./helpers/validateCropBoxData";
import {
  cropperOptions,
  SUPPORTED_ASPECT_RATIO,
  MIN_IMAGE_SIDE_FOR_CROPPER,
  DEFAULT_IMAGE_SIZE,
} from "./constants";
import {
  makeVisualSearchRequest,
  componentsState,
  SearchStore,
  SearchStoreName,
  useSearchStore,
} from "../../store/search.store";
import { getImageSizes } from "../../Image/sizing";
import { Rectangle } from "../../interfaces/search";
import { isCropBoxDataSimilar } from "./helpers/isCropBoxDataSimilar";

@Component({
  tag: "vviinn-cropper",
  shadow: true,
  styles,
})
export class VviinnCropper {
  @Element() el: HTMLElement;

  /** Save to Local Storage mode for uploaded image */
  @Prop() saveImageMode?: "once" | "always" | "never" = "once";
  @Prop({ mutable: true }) detectedObjectsString?: string;
  @Prop({ mutable: true }) url: string;
  @Prop({ mutable: true }) width: number = 288;

  /** @internal */
  @Prop() apiPath?: string;
  /** @internal */
  @Prop({ mutable: true }) height?: number;
  /** @internal */
  @Prop({ mutable: true }) basicEventData: BasicEventData;
  /** @internal */
  @Prop() showAspectRatioError: boolean;
  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() detectedObjects: Rectangle[] = [];
  @State() cropper: Cropper = null;
  @State() selectedDetectedObject?: Rectangle | null = null;
  @State() imageElement?: HTMLImageElement;

  @Event() vviinnImageCrop: EventEmitter<TriggerSourceEventData>;
  @Event() vviinnCropperLoadImage: EventEmitter<LoadImageEventData>;
  @Event() vviinnCropperCropEnd: EventEmitter<Rectangle>;

  /** @internal */
  @Event() vviinnCropperAspectRatioError: EventEmitter<boolean>;
  /** @internal */
  @Event() vviinnResetCropperState: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnResetCropArea: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  private state?: SearchStore;
  private storeName?: SearchStoreName;
  private disposeStoreListener?: () => void;
  private startEndCropBoxData?: Rectangle;

  connectedCallback() {
    updateGlobalState(this);
    this.stringParser(true);

    const { state, storeName, onChange } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;
    this.disposeStoreListener = onChange("image", (newImage) =>
      this.renderImage(newImage),
    );

    this.initPreloadedImage();

    document.addEventListener(
      "vviinnImageUploadStarted",
      this.imageUploadStartedHandler,
    );
    document.addEventListener(
      "vviinnImageUploadFinished",
      this.imageUploadFinishedHandler,
    );
    document.addEventListener(
      "vviinnResetCropperState",
      this.resetStateHandler,
    );
    document.addEventListener("vviinnResetCropArea", this.resetCropAreaHandler);
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
    document.removeEventListener(
      "vviinnResetCropperState",
      this.resetStateHandler,
    );
    document.removeEventListener(
      "vviinnResetCropArea",
      this.resetCropAreaHandler,
    );

    this.disposeStoreListener?.();
    this.cropper?.destroy?.();
    componentsState.image = null;
  }

  @Watch("detectedObjectsString")
  detectedObjectsStringWatcher() {
    this.stringParser(true);
  }

  private initPreloadedImage = () => {
    if (this.showInWidget) {
      const [width, height] = getImageSizes(
        this.state.image,
        DEFAULT_IMAGE_SIZE,
      );
      this.width = width;
      this.height = height;
      this.renderImage(this.state.image);
    }

    if (this.saveImageMode === "never") return;
    this.state.image = null;

    const cropperImageSrc = localStorage.getItem("cropperImageSrc");
    if (!cropperImageSrc) return;

    const image = document.createElement("img");
    image.src = cropperImageSrc;
    this.state.image = image;

    this.saveImageMode === "once" && localStorage.removeItem("cropperImageSrc");
  };

  private resetStateHandler = ({
    detail,
  }: CustomEvent<TriggerSourceEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    this.detectedObjects = [];
    this.selectedDetectedObject = null;
    localStorage.removeItem("cropperImageSrc");
    this.imageElement?.setAttribute("src", "");
    this.imageElement = null;
    this.cropper?.destroy();
  };

  private resetCropAreaHandler = ({
    detail,
  }: CustomEvent<TriggerSourceEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.cropper?.reset();
    this.state.searchArea = null;
    this.state.croppedImageUrl = null;
    this.selectedDetectedObject = null;
    this.vviinnImageCrop.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    makeVisualSearchRequest(this.storeName, null);
  };

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private imageUploadFinishedHandler = () => {
    if (this.state.image && this.saveImageMode !== "never") {
      localStorage.setItem("cropperImageSrc", this.state.image.src);
    }
  };

  stringParser(TriggerDetectedObjects?: boolean) {
    if (this.detectedObjectsString && TriggerDetectedObjects) {
      this.detectedObjects = JSON.parse(this.detectedObjectsString);
    }
  }

  @Listen("vviinnSelectObject")
  selectDetectedObject({ detail }: CustomEvent<SelectObjectEventData>) {
    this.selectedDetectedObject = detail.detectedObject;
    this.state.searchArea = detail.searchArea;
    const { top, left, width, height } = detail.detectedObject;

    if (this.cropper) {
      const { width: cropBoxWidth, height: cropBoxHeight } =
        this.cropper.getImageData();
      const cropBoxData = {
        left: left * cropBoxWidth,
        top: top * cropBoxHeight,
        width: width * cropBoxWidth,
        height: height * cropBoxHeight,
      };

      this.cropper.setCropBoxData(ValidateCropBoxData(cropBoxData));
      this.vviinnImageCrop.emit({
        isTriggeredByVpsWidget: this.showInWidget,
      });
    }

    makeVisualSearchRequest(this.storeName, null);
  }

  @Listen("vviinnImageCrop")
  imageCropHandler({ detail }: CustomEvent<TriggerSourceEventData>) {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    if (this.cropper)
      this.state.croppedImageUrl = this.cropper
        .getCroppedCanvas?.()
        .toDataURL?.();

    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
  }

  private getDetectedObjects = () =>
    this.detectedObjects.length
      ? this.detectedObjects
      : this.state.detectedObjects;

  private imageUploadStartedHandler = ({ detail }: SearchIdEvent) => {
    if (
      this.cropper &&
      this.imageElement?.src &&
      !this.skipStateChanges(detail.isTriggeredByVpsWidget)
    ) {
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

  private loadImage = () => {
    this.imageElement = this.el.shadowRoot.querySelector("img");
    if (this.imageElement) {
      let data = {};
      if (this.cropper) {
        data = this.cropper.getData(true);
        this.cropper.destroy();
      }
      const imageBounds = fromImage(this.imageElement);
      const { width, height } = imageBounds;

      this.vviinnCropperLoadImage.emit({
        imageBounds,
      });
      this.state.imageBounds = imageBounds;

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
        cropstart: this.cropStart,
        cropend: this.cropEnd,
        ready: () => this.cropper.reset(),
        data,
      });
    }
  };

  private renderImage(newImage?: HTMLImageElement) {
    if (newImage) {
      this.url = newImage.src;
    }
  }

  private cropStart = () => {
    this.startEndCropBoxData = this.getCropboxData();
  };

  private cropEnd = () => {
    const cropboxData = this.getCropboxData();
    if (isCropBoxDataSimilar(this.startEndCropBoxData, cropboxData)) return;

    this.vviinnCropperCropEnd.emit(cropboxData);
    this.state.searchArea = cropboxData;
    this.selectedDetectedObject = null;

    this.vviinnImageCrop.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    makeVisualSearchRequest(this.storeName, null);
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
              onLoad={this.loadImage}
            />

            {this.getDetectedObjects().map((object) => (
              <vviinn-detected-object
                detectedObject={object}
                selectedDetectedObject={this.selectedDetectedObject}
                basicEventData={this.basicEventData}
                imageBounds={this.state.imageBounds}
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
