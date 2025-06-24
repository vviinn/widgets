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
import i18next from "i18next";
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
  SearchStore,
  SearchStoreName,
  useSearchStore,
} from "../../store/search.store";
import { getImageSizes } from "../../Image/sizing";
import { Rectangle } from "../../interfaces/search";
import { isCropBoxDataSimilar } from "./helpers/isCropBoxDataSimilar";
import { cleanLocalStorage, getLocalStorageItems } from "../../localStorage";
import { addEventListenersWithSignal } from "../../dom";

@Component({
  tag: "vviinn-cropper",
  shadow: true,
  styles,
})
export class VviinnCropper {
  @Element() el: HTMLElement;

  /** Save to Local Storage mode for uploaded image */
  @Prop() saveImageMode?: "once" | "always" | "never" = "once";
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

  @State() cropper: Cropper = null;
  @State() selectedDetectedObject?: Rectangle | null = null;

  @Event() vviinnImageCrop: EventEmitter<TriggerSourceEventData>;
  @Event() vviinnCropperLoadImage: EventEmitter<LoadImageEventData>;
  @Event() vviinnCropperCropEnd: EventEmitter<Rectangle>;

  /** @internal */
  @Event() vviinnCropperAspectRatioError: EventEmitter<boolean>;
  /** @internal */
  @Event() vviinnCropperResetState: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnResetCropArea: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  private state?: SearchStore;
  private storeName?: SearchStoreName;
  private startEndCropBoxData?: Rectangle;
  private eventAbortController?: AbortController;

  connectedCallback() {
    updateGlobalState(this);

    const { state, storeName } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;

    this.initPreloadedImage();

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnImageUploadFinished", this.imageUploadFinishedHandler],
        ["vviinnCropperResetState", this.resetStateHandler],
        ["vviinnResetCropArea", this.resetCropAreaHandler],
      ],
      signal,
    );
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
    this.cropper?.destroy?.();
    this.state.image = null;
  }

  private initPreloadedImage = () => {
    if (this.showInWidget) {
      const [width, height] = getImageSizes(
        this.state.image,
        DEFAULT_IMAGE_SIZE,
      );
      this.width = width;
      this.height = height;
    }

    if (this.saveImageMode === "never") return;
    this.state.image = null;

    const {
      imageSrc: localStorageImageSrc,
      detectedObjects: localStorageDetectedObjects,
    } = getLocalStorageItems();

    if (!localStorageImageSrc) return;

    const image = document.createElement("img");
    image.src = localStorageImageSrc;
    this.state.image = image;

    if (this.state.detectedObjects?.length === 0) {
      this.state.detectedObjects = localStorageDetectedObjects;
    }
    if (this.saveImageMode === "once") cleanLocalStorage();
  };

  private resetStateHandler = ({
    detail,
  }: CustomEvent<TriggerSourceEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    this.selectedDetectedObject = null;
    this.state.image?.setAttribute("src", "");
    this.state.detectedObjects = [];
    this.state.image = null;
    this.cropper?.destroy();
    cleanLocalStorage();
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

  private imageUploadFinishedHandler = ({ detail }: SearchIdEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    if (this.saveImageMode === "never") cleanLocalStorage();

    if (this.cropper && this.state.image?.src)
      this.cropper.replace(this.state.image.src);
  };

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
    const renderedImageElement = this.el.shadowRoot.querySelector("img");
    if (this.state.image) {
      let data = {};
      if (this.cropper) {
        data = this.cropper.getData(true);
        this.cropper.destroy();
      }
      const imageBounds = fromImage(renderedImageElement);
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
      this.cropper = new Cropper(renderedImageElement, {
        ...cropperOptions,
        cropstart: this.cropStart,
        cropend: this.cropEnd,
        ready: () => this.cropper.reset(),
        data,
      });
    }
  };

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
    this.state.searchStatus === "loading" &&
    this.state.searchType === "image" &&
    !!this.state.image &&
    !this.showAspectRatioError;

  render() {
    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
          active: !!this.state.image,
        }}
      >
        <div class="container">
          {this.state.image && (
            <div
              class="image-container"
              style={{
                width: `${this.width.toString()}px`,
                overflow: "hidden",
              }}
            >
              <img
                decoding="async"
                width={this.width}
                height={this.height}
                src={this.state.image.src}
                draggable={false}
                onLoad={this.loadImage}
                alt={i18next.t("a11y.cropperImage")}
              />

              {this.state.detectedObjects?.map((object) => (
                <vviinn-detected-object
                  detectedObject={object}
                  selectedDetectedObject={this.selectedDetectedObject}
                  basicEventData={this.basicEventData}
                  imageBounds={this.state.imageBounds}
                  showInWidget={this.showInWidget}
                />
              ))}
            </div>
          )}

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
