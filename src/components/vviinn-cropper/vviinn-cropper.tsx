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
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { version } from "../../../package.json";
import styles from "./vviinn-cropper.css";
import { fromImage, divideOnSized } from "../../geometry/Rectangle";
import {
  BasicEventData,
  SearchIdEvent,
  SelectObjectEventData,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { LoadImageEventData, CropEndEventData } from "./types";
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
import { Rectangle } from "../../interfaces";
import { isCropBoxChangeMinimal } from "./helpers/isCropBoxDataSimilar";
import { getCropBoxData } from "./helpers/cropperUtils";
import { CropperOcrGate } from "./helpers/cropperOcrGate";
import { cleanLocalStorage, getLocalStorageItems } from "../../localStorage";
import { addEventListenersWithSignal } from "../../dom";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
import { campaignTypeNames } from "../../campaign/Campaign";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";

@Component({
  tag: "vviinn-cropper",
  shadow: true,
  styles,
})
export class VviinnCropper {
  @Element() el: HTMLElement;

  /** Vviinn customer's token */
  @Prop() token: string;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
  /** Save to Local Storage mode for uploaded image */
  @Prop() saveImageMode?: "once" | "always" | "never" = "once";
  /** Automatically trigger visual search after crop. Set to false to handle search manually via vviinnCropperCropEnd event */
  @Prop() autoSearch?: boolean = true;
  @Prop({ mutable: true }) width: number = 288;
  /** URL to external CSS file for custom styling */
  @Prop() cssUrl: string | null = null;

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
  /** Triggered when crop ends with enriched data including normalized coordinates for visual-search API */
  @Event() vviinnCropperCropEnd: EventEmitter<CropEndEventData>;
  /** Triggered when a visual search request fails */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

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
  private disposeStoreListener?: () => void;
  private imageElement: HTMLImageElement | null = null;
  private gate = new CropperOcrGate();

  connectedCallback() {
    const { state, storeName, onChange } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;

    this.disposeStoreListener = onChange(
      "dynamicFilters",
      this.reconcileCropper,
    );

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
    this.disposeStoreListener?.();
    this.destroyCropper();
    // "never" keeps no image across mounts, so clear it from the shared store.
    if (this.saveImageMode === "never") this.state.image = null;
  }

  private destroyCropper = () => {
    this.cropper?.destroy();
    this.cropper = null;
  };

  private clearCropSelection = () => {
    this.state.searchArea = null;
    this.state.croppedImageUrl = null;
    this.selectedDetectedObject = null;
  };

  /** Tear down the cropper and drop any applied crop. */
  private discardCrop = () => {
    this.destroyCropper();
    this.clearCropSelection();
  };

  private resetCropperState = () => {
    this.discardCrop();
    this.state.image = null;
  };

  /** Show or hide the cropper to match the current OCR gate decision. */
  private reconcileCropper = () => {
    // Trust the fresh filters even before the image DOM is ready.
    this.gate.onFreshFilters();

    if (!this.state.image || !this.imageElement || !this.state.imageBounds)
      return;

    if (this.gate.isGated(this.state.dynamicFilters)) {
      // Drop only the frame, keep the region/object so OCR searches within it.
      this.destroyCropper();
      return;
    }

    // Guard geometry here so initCropper doesn't re-emit the aspect-ratio error on every filter change.
    if (
      !this.cropper &&
      this.hasSupportedAspectRatio() &&
      this.hasSupportedSize()
    ) {
      this.initCropper(this.imageElement);
    }
  };

  private initPreloadedImage = () => {
    if (this.showInWidget && this.state.image) {
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

    this.state.image?.setAttribute("src", "");
    this.state.detectedObjects = [];
    this.resetCropperState();
    cleanLocalStorage();
  };

  private resetCropAreaHandler = ({
    detail,
  }: CustomEvent<TriggerSourceEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.cropper?.reset();
    this.clearCropSelection();
    this.vviinnImageCrop.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    this.triggerVisualSearch();
  };

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private getBasicEventData = (): BasicEventData => {
    if (this.showInWidget && this.basicEventData) {
      return this.basicEventData;
    }
    return {
      campaignTypeId: "VPS",
      campaignTypeName: campaignTypeNames["VPS"],
      widgetVersion: version,
      ...addIfNotEmpty("widgetId", this.el.id),
    };
  };

  private triggerVisualSearch = async () => {
    pipe(
      await makeVisualSearchRequest(
        this.storeName,
        null,
        this.token,
        this.apiPath,
      ),
      E.fold(
        () => {
          this.vviinnNoResult.emit(this.getBasicEventData());
        },
        () => {},
      ),
    );
  };

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

    this.triggerVisualSearch();
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

  private loadImage = () => {
    if (!this.state.image) return;

    const renderedImageElement =
      this.el.shadowRoot?.querySelector<HTMLImageElement>("img");
    if (!renderedImageElement) return;
    this.imageElement = renderedImageElement;
    this.gate.onImage(this.state.image);

    let data = {};
    if (this.cropper) {
      data = this.cropper.getData(true);
      this.destroyCropper();
    }
    const imageBounds = fromImage(renderedImageElement);

    this.vviinnCropperLoadImage.emit({
      imageBounds,
    });
    this.state.imageBounds = imageBounds;

    const isSearchLoading = this.state.searchStatus === "loading";

    if (this.gate.isGated(this.state.dynamicFilters, isSearchLoading)) {
      this.discardCrop();
      // Still surface aspect-ratio errors while hidden — geometry matters regardless.
      this.checkAspectRatio();
      return;
    }

    this.initCropper(renderedImageElement, data);
  };

  private hasSupportedAspectRatio = (): boolean => {
    if (!this.state.imageBounds) return false;
    const { width, height } = this.state.imageBounds;

    return (
      width / height >= SUPPORTED_ASPECT_RATIO &&
      height / width >= SUPPORTED_ASPECT_RATIO
    );
  };

  private hasSupportedSize = (): boolean => {
    if (!this.state.imageBounds) return false;
    const { width, height } = this.state.imageBounds;

    return (
      width >= MIN_IMAGE_SIDE_FOR_CROPPER &&
      height >= MIN_IMAGE_SIDE_FOR_CROPPER
    );
  };

  private checkAspectRatio = (): boolean => {
    if (this.hasSupportedAspectRatio()) return true;
    this.vviinnCropperAspectRatioError.emit(true);
    return false;
  };

  private initCropper = (imageElement: HTMLImageElement, data = {}) => {
    if (!imageElement) return;
    if (!this.checkAspectRatio() || !this.hasSupportedSize()) return;

    this.cropper = new Cropper(imageElement, {
      ...cropperOptions,
      cropstart: this.cropStart,
      cropend: this.cropEnd,
      ready: () => this.cropper?.reset(),
      data,
    });
  };

  private cropStart = () => {
    this.gate.onUserAdjust();
    this.startEndCropBoxData = getCropBoxData(this.cropper);
  };

  private cropEnd = () => {
    const cropboxData = getCropBoxData(this.cropper);
    if (isCropBoxChangeMinimal(this.startEndCropBoxData, cropboxData)) return;

    if (!this.state.imageBounds) return;

    const normalizedSearchArea = divideOnSized(this.state.imageBounds)(
      cropboxData,
    );

    this.vviinnCropperCropEnd.emit({
      searchArea: cropboxData,
      normalizedSearchArea,
      imageBounds: this.state.imageBounds,
      ...(this.state.visualSearchId && {
        requestId: this.state.visualSearchId,
      }),
    });

    this.state.searchArea = cropboxData;
    this.selectedDetectedObject = null;

    this.vviinnImageCrop.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });

    this.autoSearch && this.triggerVisualSearch();
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
        {renderExternalCSS(this.cssUrl)}

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
