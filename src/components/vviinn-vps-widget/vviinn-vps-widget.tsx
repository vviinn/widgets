import {
  Component,
  Host,
  h,
  State,
  Prop,
  Element,
  Watch,
  Listen,
  Event,
  EventEmitter,
  Fragment,
} from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { v4 as uuidv4 } from "uuid";
import i18next from "i18next";

import { version } from "../../../package.json";
import {
  searchState,
  componentsState,
  SearchStore,
  SearchStoreName,
} from "../../store/search.store";
import { state } from "../../store/store";
import { slotChangeListener, SlotSkeleton } from "../customized-slots";
import { createTrackingApi } from "../../openApi";
import {
  DefaultApi,
  EventConfirmation,
  SearchImageSource,
  WidgetAction,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  createWidgetEvent,
  createFilterEvent,
  createImageSearchEvent,
} from "../../tracking";
import {
  BasicEventData,
  SelectFilterEventData,
  SelectObjectEventData,
  NoResultEventData,
  TextSearchEvent,
  ImageUploadEventData,
} from "../../recommendation/events";
import { campaignTypeNames } from "../../campaign/Campaign";
import {
  addIfNotEmpty,
  parseExcludedToParams,
} from "../../utils/collections/collectionsUtils";
import { resources } from "../../locale";
import { Locale } from "../../locale";
import { CameraActionIcon, UploadActionIcon } from "../vviinn-icons";
import { DEFAULT_EXAMPLE_IMAGE } from "../../assets/constants";
import { videoStreamSettings } from "../../video/settings";
import { Recommendation } from "../../interfaces/recommendation";
import { checkDeviceType } from "../../helpers";
import {
  OneClickDiscoveryAppendMode,
  UploadSource,
  VisualSearchMode,
} from "../../widget/types";
import {
  extendedFiltersParts,
  filtersParts,
  modalParts,
  productCardParts,
  searchBarParts,
  searchWidgetButtonParts,
  searchWidgetFilterParts,
} from "../../cssParts";
import { findSlotElements } from "../../dom";
import { SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH } from "../../widget/constants";

const CAMERA_START_DELAY = 500;

/**
 * @slot vviinn-teaser-text - Text on the widget's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button.
 * @slot vviinn-image-upload-icon - Icon of Upload Button.
 * @slot vviinn-camera-button-text-start - Title of Start Camera button.
 * @slot vviinn-camera-button-text-stop - Title of Stop Camera button (for Desktop).
 * @slot vviinn-camera-icon - Icon of Camera Button.
 * @slot vviinn-camera-capture-text - Text above the Camera Capture button.
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block.
 * @slot vviinn-image-search-modal-title - Image search modal title.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 *
 * @slot vviinn-results-vpr-icon - One-click Discovery icon.
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part results-title - Title on the results page.
 * @part upload-photo_button - Upload Photo Button.
 * @part start-camera_button - Start Camera Button.
 * @part product-card - Product Card itself.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around troduct title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-base-sale - Numeric part of the base price.
 * @part price-amount-base-outdated - Numeric part of the base price.
 * @part price-amount-base-regular - Numeric part of the base price.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part title - Title inside Product Card.
 * @part text-search-input - Text search input.
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 */

@Component({
  tag: "vviinn-vps-widget",
  styleUrl: "vviinn-vps-widget.css",
  shadow: true,
})
export class VviinnVpsWidget {
  @Element() el: HTMLVviinnVpsWidgetElement;

  /** Vviinn customer’s token (required) */
  @Prop() token: string | undefined;
  /** Toggle the widget's modal showing */
  @Prop({ mutable: true }) active: boolean = true;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Campaign ID applied for visual search */
  @Prop() campaignId: string = "";
  /** Excluded filter. Example: "brand:Nike;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = true;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number = SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Example image source */
  @Prop() exampleImageSource: string = DEFAULT_EXAMPLE_IMAGE;
  /** Show the text search */
  @Prop() textSearchShow: boolean = false;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** Show or hide the One-click Discovery, will be deprecated, use oneClickDiscoveryMode instead */
  @Prop() oneClickDiscoveryShow = false;
  /** One click Discovery mode, restricted to append only (no modal supported for this component)*/
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryAppendMode;
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;

  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** Set true when showing the widget in button */
  /** @internal */
  @Prop() showingInButton?: boolean = false;
  /** Element Id, passed from vps-button */
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() buttonPressed?: boolean;
  /** @internal */
  @Prop() mode: VisualSearchMode = "modal";
  /** @internal */
  @Prop() resetVpsButton: () => void;
  /** @internal */
  @Prop() replaceSlotsContentInButton?: () => void;
  /** @internal */
  @Prop() parentSlots?: HTMLSlotElement[] = [];
  /** @internal */
  @Prop() useComponentsStore?: boolean = false;

  @State() slidePosition: number = 0;
  @State() uploadSource: UploadSource;
  @State() stream: MediaStream | null = null;
  @State() products: Recommendation[] = [];
  @State() searchQuery: string = "";
  @State() requestId: string = "";

  @State() isCameraInitializing: boolean = false;
  @State() isCameraEnabled: boolean = false;
  @State() isCameraButtonClicked: boolean = false;

  @State() showAspectRatioError = false;
  @State() wrongImageFormat: boolean = false;
  @State() trackingDeactivated: boolean = false;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Event emitted on widget load */
  @Event({ bubbles: true })
  vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Event emitted on modal open */
  @Event({ bubbles: true })
  vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** Event emitted on modal close */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** Crop area changes */
  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;

  /** User selects the detected object */
  @Event() vviinnSelectObject: EventEmitter<SelectObjectEventData>;

  /** User selects one of the filters */
  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;

  /** The image upload has started */
  @Event() vviinnImageUploadStarted: EventEmitter<ImageUploadEventData>;

  /** Wrong image format, that isn’t .jpg, .jpeg, png, or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  private overflow: string;
  private uiSessionId: string;
  private trackingApi: DefaultApi;
  private imageSource: SearchImageSource = "upload";
  private cameraAvailable: boolean = false;
  private isDesktop: boolean = false;
  private videoTrack: MediaStreamTrack | null = null;
  private widgetElementId: string;
  private isTextSearch: boolean = false;
  private slots: HTMLSlotElement[] = [];
  private state?: SearchStore;
  private storeName?: SearchStoreName;

  private initResultEvents() {
    this.state.resultLoaded = false;
    this.state.resultViewed = false;
  }

  private replaceSlotsContent(childrenElement?: HTMLElement) {
    this.globalSlotsChanged.emit({
      slots: this.slots,
      element: this.el,
    });

    if (childrenElement) {
      this.globalSlotsChanged.emit({
        slots: this.slots,
        element: childrenElement,
      });
    }
  }

  private stopStreamTracks() {
    this.stream?.getTracks().forEach((track) => {
      track.stop();
    });
  }

  private isOnboardingSlide() {
    return this.slidePosition === 0;
  }

  private isResultSlide() {
    return this.slidePosition === 1;
  }

  private handleVviinnImageUpload = (uploadSource: UploadSource) => {
    this.trackInitialSearch();
    this.uploadSource = uploadSource;
  };

  private handleVviinnImageUploadFinished = () => {
    this.handleImageSelection();
    if (this.mode === "upload" && this.showingInButton) {
      this.active = true;
    }
  };

  private handleVviinnNoResult = (detail: NoResultEventData) => {
    if (detail.reason === "client") {
      this.wrongImageFormat = true;
    }
  };

  private adjustCameraSettings = async () => {
    if (!this.videoTrack) return;
    const capabilities = this.videoTrack?.getCapabilities
      ? this.videoTrack.getCapabilities()
      : {};

    if ("focusMode" in capabilities) {
      try {
        await this.videoTrack.applyConstraints({
          advanced: [{ focusMode: "continuous" }] as any,
        });
      } catch (error) {
        console.error("Failed to apply focus mode constraints", error);
      }
    }

    if ("exposureMode" in capabilities) {
      try {
        await this.videoTrack.applyConstraints({
          advanced: [{ exposureMode: "continuous" }] as any,
        });
      } catch (error) {
        console.error("Failed to apply exposure mode constraints", error);
      }
    }

    if ("whiteBalanceMode" in capabilities) {
      try {
        await this.videoTrack.applyConstraints({
          advanced: [{ whiteBalanceMode: "continuous" }] as any,
        });
      } catch (error) {
        console.error("Failed to apply white balance mode constraints", error);
      }
    }
  };

  private handleStartCameraClick = async () => {
    if (this.stream) {
      this.resetState();
      return;
    }
    this.isCameraInitializing = true;

    setTimeout(async () => {
      this.isCameraButtonClicked = true;
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamSettings,
        });
        this.videoTrack = videoStream.getVideoTracks()[0];
        this.adjustCameraSettings();

        this.stream = videoStream;
        this.uploadSource = "startCamera";
      } catch (error) {
        // TODO: Show error in the UI
        console.log("Error accessing camera: ", error.message);
        this.resetState();
        this.isCameraInitializing = false;
      }
    }, CAMERA_START_DELAY);
  };

  private setShowAspectRatioError = (isError: boolean) => {
    this.showAspectRatioError = isError;
  };

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });

    this.slots = findSlotElements(this.el);

    slotChangeListener(this, this.el);
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
    this.trackWidgetEvent("load");
  }

  componentDidLoad() {
    this.replaceSlotsContent();
  }

  setTrackingDeactivated = (result: EventConfirmation) => {
    if (result.status === "rejected") {
      this.trackingDeactivated = true;
    }
  };

  getBasicEventData = (isTextSearch?: boolean): BasicEventData => {
    const activeCampaign = this.isTextSearch || isTextSearch ? "TPS" : "VPS";
    return {
      campaignTypeId: activeCampaign,
      campaignTypeName: campaignTypeNames[activeCampaign],
      widgetVersion: version,
      ...addIfNotEmpty(
        "widgetId",
        this.buttonElementId ?? this.widgetElementId,
      ),
    };
  };

  @Watch("active")
  activeWatcher(active: boolean) {
    if (active) {
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.vviinnWidgetOpen.emit(this.getBasicEventData());
      if (this.mode === "camera") this.handleStartCameraClick();
      this.trackWidgetEvent("open");
    } else {
      document.body.style.overflow = this.overflow;
      this.initResultEvents();
    }
  }

  @Listen("widgetTextSearchFinished")
  textSearchFinishedHandler({ detail }: TextSearchEvent) {
    this.isTextSearch = true;
    this.searchQuery = detail.query;
    this.requestId = detail.requestId;
    this.slidePosition = 1;
  }

  @Listen("vviinnResultLoad") resultLoadHandler() {
    this.state.resultLoaded = true;
  }

  @Listen("vviinnResultView") resultViewHandler() {
    this.state.resultViewed = true;
  }

  @Listen("vviinnCameraEnabled")
  trackCameraEnabled({ detail: isEnabled }: CustomEvent<boolean>) {
    this.isCameraEnabled = isEnabled;
    this.isCameraInitializing = false;
  }

  @Listen("vviinnImageCrop")
  cropAreaChanges() {
    this.initResultEvents();

    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createImageSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "manual-selection",
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  @Listen("vviinnSelectObject")
  trackDetectedObject() {
    this.initResultEvents();

    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createImageSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "attention-point",
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  @Listen("vviinnSelectFilter")
  trackImageSearchFilterSelected({
    detail,
  }: CustomEvent<SelectFilterEventData>) {
    this.initResultEvents();
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createFilterEvent("VPS")({
      session_id: this.uiSessionId,
      source: this.imageSource,
      kind: detail.kind,
      action: detail.action,
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  connectedCallback() {
    this.isDesktop = checkDeviceType() === "desktop";
    this.storeName = this.useComponentsStore ? "components" : "widget";
    this.state = this.useComponentsStore ? componentsState : searchState;

    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;

    this.cameraAvailable =
      !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

    if (this.excluded) {
      this.excluded = parseExcludedToParams(this.excluded);
    }

    this.state.token = this.token;
    this.state.campaignId = this.campaignId;
    this.state.excluded = this.excluded;

    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.widgetElementId = this.el.id;

    document.addEventListener(
      "vviinnCropperAspectRatioError",
      this.handleAspectRatioError,
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnCropperAspectRatioError",
      this.handleAspectRatioError,
    );
  }

  private handleAspectRatioError = ({ detail }: CustomEvent<boolean>) => {
    this.setShowAspectRatioError(detail);
    this.el.classList.add("bordered");
  };

  private trackWidgetEvent(action: WidgetAction) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const eventBody = {
      action,
      session_id: this.uiSessionId,
      ...rest,
    };

    // TODO:
    const widgetEvent: WidgetEvent = createWidgetEvent("VPS")(eventBody);
    this.trackingApi.trackEvent(widgetEvent).then(this.setTrackingDeactivated);
  }

  private trackInitialSearch() {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createImageSearchEvent({
      session_id: this.uiSessionId,
      search_area: "full",
      source: "upload",
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  private handleImageSelection() {
    if (this.useComponentsStore) {
      this.resetVpsButton && this.resetVpsButton();
      this.resetState();
      return;
    }

    this.slidePosition = 1;
    const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
    const overlay = root.shadowRoot.querySelector("vviinn-overlay");
    const modal = overlay.querySelector("vviinn-modal");
    const modalBody = modal.shadowRoot.querySelector(".body");
    modalBody.scrollTop = 0;
    this.stopStreamTracks();
  }

  private renderButtons() {
    const isLoading =
      (this.state.loading &&
        this.state.searchType === "image" &&
        this.uploadSource === "startCamera") ||
      this.isCameraInitializing;

    const buttons = [
      this.cameraAvailable && (
        <button
          class="action-button"
          part="start-camera_button"
          onClick={() => {
            this.handleStartCameraClick();
          }}
        >
          {isLoading && <vviinn-preloader />}

          <span class={{ "action-button-content": true, hidden: isLoading }}>
            <slot name="vviinn-camera-icon">
              <CameraActionIcon />
            </slot>
            <span class={{ hidden: !this.isCameraEnabled }}>
              <slot name="vviinn-camera-button-text-stop">
                {i18next.t("cameraButtonTextStop")}
              </slot>
            </span>
            <span class={{ hidden: this.isCameraEnabled }}>
              <slot name="vviinn-camera-button-text-start">
                {i18next.t("cameraButtonTextStart")}
              </slot>
            </span>
          </span>
        </button>
      ),
      <vviinn-image-selector
        class="action-button"
        onClick={() => (this.uploadSource = "uploadPhoto")}
        onVviinnImageUploadFinished={this.handleVviinnImageUploadFinished}
        onVviinnImageUploadStarted={() => {
          this.handleVviinnImageUpload("uploadPhoto");
        }}
        storeName={this.storeName}
        onVviinnNoResult={({ detail }) => this.handleVviinnNoResult(detail)}
        resetVpsButton={this.resetVpsButton}
        basicEventData={this.getBasicEventData()}
        part="upload-photo_button"
        startUpload={
          this.buttonPressed && this.showingInButton && this.mode === "upload"
        }
        loading={
          this.state.loading &&
          this.state.searchType === "image" &&
          this.uploadSource === "uploadPhoto"
        }
      >
        <span slot="upload-button-text" class="action-button-content">
          <slot name="vviinn-image-upload-icon">
            <UploadActionIcon />
          </slot>

          <slot name="vviinn-image-upload-button-text">
            <span>{i18next.t("imageUploadButtonText")}</span>
          </slot>
        </span>
      </vviinn-image-selector>,
    ];

    return this.isDesktop ? buttons.reverse() : buttons;
  }

  private resetInnerState = () => {
    this.searchQuery = "";
    this.wrongImageFormat = false;
    this.resetScroll("results-block");
    this.stopStreamTracks();
    this.initResultEvents();
    this.stream = null;
    this.isCameraEnabled = false;
    this.isCameraButtonClicked = false;
    this.isCameraInitializing = false;
    this.setShowAspectRatioError(false);
    this.isTextSearch = false;
    this.resetScroll("start-page_block");
  };

  private resetState() {
    this.resetInnerState();
    if (this.useComponentsStore) return;

    this.slidePosition = 0;
    this.state.resetCategoryLink = undefined;
    this.state.activeIonLink = undefined;
    this.state.image = O.none;
    this.state.results = [];
    this.state.filters = [];
    this.state.dynamicFilters = [];
    this.state.detectedObjects = [];
    this.state.rectangleSearchForm = undefined;
    this.state.loading = false;
    this.state.serverError = false;
    this.state.searchType = undefined;
  }

  private haveErrors(): boolean {
    return this.wrongImageFormat || this.state.serverError;
  }

  private resetScroll(elementId: string, behavior: ScrollBehavior = "auto") {
    const element: HTMLElement = this.el.shadowRoot.getElementById(elementId);
    element?.scroll({ top: 0, left: 0, behavior });
  }

  private handleModalClose() {
    this.active = false;
    this.resetState();

    const elementsToReset = ["start-page_block", "results-block"];
    elementsToReset.forEach((name) => this.resetScroll(name));
    this.trackWidgetEvent("close");
  }

  render() {
    return (
      <Host
        exportparts={`${modalParts}, ${productCardParts}, ${searchBarParts}, ${searchWidgetFilterParts}, ${searchWidgetButtonParts}`}
      >
        {!this.showingInButton && SlotSkeleton("search")}

        <vviinn-overlayed-modal
          class={{ "first-screen": this.isOnboardingSlide() }}
          isFirstScreen={this.isOnboardingSlide()}
          active={this.active}
          resetState={this.resetState.bind(this)}
          onVviinnWidgetClose={({ detail }: CustomEvent<BasicEventData>) => {
            if (detail.campaignTypeId !== "VPR") this.handleModalClose();
          }}
          buttonElementId={this.buttonElementId ?? this.widgetElementId}
          widgetVersion={version}
          hideBackButton={
            (this.mode === "upload" && this.showingInButton) ||
            (!this.isCameraEnabled && this.isOnboardingSlide())
          }
          exportparts={modalParts}
        >
          <vviinn-slider position={this.slidePosition}>
            <vviinn-slide
              class={{
                "start-page": true,
                "camera-enabled": this.isCameraEnabled,
              }}
            >
              <vviinn-camera
                onVviinnImageUploadFinished={
                  this.handleVviinnImageUploadFinished
                }
                onVviinnImageUploadStarted={() => {
                  this.handleVviinnImageUpload("startCamera");
                }}
                basicEventData={this.getBasicEventData()}
                srcObject={this.stream}
                cameraButtonClicked={this.isCameraButtonClicked}
                exampleImageSource={this.exampleImageSource}
                useComponentsStore={this.useComponentsStore}
              />
              <div
                class={{
                  error: this.haveErrors(),
                }}
                id="start-page_block"
              >
                <div class="start-page_main-content">
                  {(this.wrongImageFormat || this.state.serverError) && (
                    <div class="start-page_errors-block">
                      <vviinn-wrong-format
                        class={{ hidden: !this.wrongImageFormat }}
                        handler={() => this.resetState()}
                      />
                      <vviinn-server-error
                        class={{ hidden: !this.state.serverError }}
                        handler={() => this.resetState()}
                      />
                    </div>
                  )}

                  {!this.haveErrors() && (
                    <Fragment>
                      <vviinn-teaser />

                      <div class="buttons-group">{this.renderButtons()}</div>

                      {this.textSearchShow && (
                        <vviinn-text-search
                          token={this.token}
                          showInWidget={true}
                          searchQuery={this.searchQuery}
                          apiPath={this.apiPath}
                          locale={this.locale}
                          uiSessionId={this.uiSessionId}
                          basicEventData={this.getBasicEventData(true)}
                        />
                      )}
                    </Fragment>
                  )}
                </div>
                <vviinn-privacy-badge
                  privacyBadgeText={i18next.t("privacyBadgeText", {
                    interpolation: { escapeValue: false },
                  })}
                  class={{ invisible: this.haveErrors() }}
                />
              </div>
            </vviinn-slide>

            <vviinn-slide
              class={{
                "results-page": true,
                active: this.isResultSlide(),
              }}
            >
              {this.isResultSlide() && this.state.searchType === "image" && (
                <div class="source-wrapper image-wrapper">
                  <vviinn-cropper
                    basicEventData={this.getBasicEventData()}
                    showAspectRatioError={this.showAspectRatioError}
                    apiPath={this.apiPath}
                    showInWidget={true}
                  />
                  <div
                    class={{
                      "filters-wrapper": true,
                      hidden: this.showAspectRatioError,
                    }}
                  >
                    <div class="filters">
                      {this.state.filters.map((filter) => (
                        <search-filters
                          filter={filter}
                          basicEventData={this.getBasicEventData()}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {this.isResultSlide() && this.state.searchType === "text" && (
                <div class="source-wrapper text-search-wrapper">
                  <vviinn-text-search
                    token={this.token}
                    showInWidget={true}
                    searchQuery={this.searchQuery}
                    apiPath={this.apiPath}
                    locale={this.locale}
                    uiSessionId={this.uiSessionId}
                    basicEventData={this.getBasicEventData(true)}
                  />

                  <div
                    class={{
                      "filters-wrapper": true,
                      hidden: this.showAspectRatioError,
                    }}
                  >
                    <vviinn-filters
                      class="preview-filters"
                      showInWidget={true}
                      exportparts={filtersParts}
                    />

                    <vviinn-extended-filters
                      class="preview-extended-filters"
                      mode="preview"
                      showHeader={false}
                      exportparts={extendedFiltersParts}
                      showInWidget={true}
                      locale={this.locale}
                    />

                    <vviinn-extended-filters-button
                      class="extended-filters-button"
                      exportparts="extended-filters-button"
                      showInWidget={true}
                    />
                  </div>
                </div>
              )}

              {this.isResultSlide() && (
                <vviinn-results
                  token={this.token}
                  uiSessionId={this.uiSessionId}
                  apiPath={this.apiPath}
                  widgetElementId={this.buttonElementId ?? this.widgetElementId}
                  showInWidget={true}
                  buttonElementId={this.buttonElementId}
                  imageResolutionWidth={this.imageResolutionWidth}
                  currency-sign={this.currencySign}
                  locale={this.locale}
                  productDetailsNewTab={this.productDetailsNewTab}
                  productDetailsRedirect={this.productDetailsRedirect}
                  addToBasketShow={this.addToBasketShow}
                  favoriteShow={this.favoriteShow}
                  showAspectRatioError={this.showAspectRatioError}
                  trackingDeactivated={this.trackingDeactivated}
                  resetState={this.resetState.bind(this)}
                  replaceSlotsContentInWidget={this.replaceSlotsContent.bind(
                    this,
                  )}
                  replaceSlotsContentInButton={this.replaceSlotsContentInButton}
                  textSearchQuery={this.searchQuery}
                  textSearchRequestId={this.requestId}
                  addPriceContainer={this.addPriceContainer}
                  oneClickDiscoveryMode={
                    this.oneClickDiscoveryMode ??
                    (this.oneClickDiscoveryShow ? "append-grid" : undefined)
                  }
                  oneClickDiscoveryCampaigns={this.oneClickDiscoveryCampaigns}
                  parentSlots={[...this.parentSlots, ...this.slots]}
                />
              )}
            </vviinn-slide>
          </vviinn-slider>

          <vviinn-extended-filters
            class="modal-extended-filters"
            mode="modal"
            exportparts={extendedFiltersParts}
            showInWidget={true}
            locale={this.locale}
          />
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
