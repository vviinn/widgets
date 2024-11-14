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
import { searchState } from "../../store/search.store";
import { state } from "../../store/store";
import { slotChangeListener } from "../customized-slots";
import { createTrackingApi } from "../../openApi";
import {
  DefaultApi,
  EventConfirmation,
  SearchImageSource,
  WidgetAction,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  createWidgetVpsEvent,
  createFilterEvent,
  createSearchEvent,
} from "../../tracking";
import {
  BasicEventData,
  SelectFilterEventData,
  SelectObjectEventData,
  NoResultEventData,
  TextSearchEvent,
} from "../../recommendation/events";
import { SlotSkeleton } from "../customized-slots";
import { campaignTypeNames } from "../../campaign/Campaign";
import { parseExcludedToParams } from "../../utils/collections/collectionsUtils";
import { resources } from "../../locale";
import { Locale } from "../../locale";
import { CameraActionIcon, UploadActionIcon } from "../vviinn-icons";
import { DEFAULT_EXAMPLE_IMAGE } from "../../assets/constants";
import { videoStreamSettings } from "../../video/settings";
import { Recommendation } from "../../interfaces/recommendation";
import { checkDeviceType } from "../../helpers";
import { UploadSource, VisualSearchMode } from "../../widget/types";

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
 *
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part title - Modal window title.
 * @part upload-photo_button - Upload Photo Button.
 * @part show-files_button - Show Files Button.
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
 * @part custom-label-0 - custom label with index 0.
 * @part custom-label-1 - custom label with index 1.
 * @part custom-label-2 - custom label with index 2.
 * @part custom-label-3 - custom label with index 3.
 * @part custom-label-4 - custom label with index 4.
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
  @Element() el: HTMLElement;

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
  @Prop() imageResolutionWidth: number = 250;
  /** Example image source */
  @Prop() exampleImageSource: string = DEFAULT_EXAMPLE_IMAGE;
  /** Show the text search */
  @Prop() textSearchShow: boolean = false;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide the One-click Discovery */
  @Prop() showOneClickDiscovery = false;
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;

  /** @internal */
  @Prop() apiPath: string = "https://api.vviinn.com";
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

  @State() slidePosition: number = 0;
  @State() width: number = 0;
  @State() wrongImageFormat: boolean = false;
  @State() trackingDeactivated: boolean = false;
  @State() stream: MediaStream | null = null;
  @State() cameraInitializing: boolean = false;
  @State() cameraEnabled: boolean = false;
  @State() cameraButtonClicked: boolean = false;
  @State() uploadSource: UploadSource;
  @State() showAspectRatioError = false;
  @State() products: Recommendation[] = [];
  @State() searchQuery: string = "";

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
  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;

  /** Wrong image format, that isn’t .jpg, .jpeg, png, or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  private overflow: string;
  private uiSessionId: string;
  private trackingApi: DefaultApi;
  private imageSource: SearchImageSource | null = null;
  private cameraAvailable: boolean = false;
  private isDesktop: boolean = false;
  private videoTrack: MediaStreamTrack | null = null;
  private widgetElementId: string;
  private isTextSearch: boolean = false;

  private initResultEvents() {
    searchState.resultLoaded = false;
    searchState.resultViewed = false;
  }

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
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
    this.cameraInitializing = true;

    setTimeout(async () => {
      this.cameraButtonClicked = true;
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
        this.cameraInitializing = false;
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

  getBasicEventData = (): BasicEventData => {
    const activeCampaign = this.isTextSearch ? "TPS" : "VPS";
    return {
      widgetType: activeCampaign,
      campaignTypeId: activeCampaign,
      campaignTypeName: campaignTypeNames[activeCampaign],
      widgetId: this.buttonElementId ?? this.widgetElementId,
      widgetVersion: version,
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

  @Listen("widgetTextSearchFinished") textSearchFinishedHandler({
    detail,
  }: TextSearchEvent) {
    this.isTextSearch = true;
    this.searchQuery = detail.query;
    this.slidePosition = 1;
  }

  @Listen("vviinnResultLoad") resultLoadHandler() {
    searchState.resultLoaded = true;
  }

  @Listen("vviinnResultView") resultViewHandler() {
    searchState.resultViewed = true;
  }

  @Listen("vviinnCameraEnabled")
  trackCameraEnabled({ detail: isEnabled }: CustomEvent<boolean>) {
    this.cameraEnabled = isEnabled;
    this.cameraInitializing = false;
  }

  @Listen("vviinnImageCrop")
  trachSearchAreaChanges() {
    this.initResultEvents();
    if (this.trackingDeactivated) return;
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createSearchEvent({
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
    if (this.trackingDeactivated) return;
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "attention-point",
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  @Listen("vviinnSelectFilter")
  trackFilterSelected({ detail }: CustomEvent<SelectFilterEventData>) {
    this.initResultEvents();
    if (this.trackingDeactivated) return;
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createFilterEvent({
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
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;

    this.cameraAvailable =
      !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

    if (this.excluded) {
      this.excluded = parseExcludedToParams(this.excluded);
    }

    searchState.token = this.token;
    searchState.campaignId = this.campaignId;
    searchState.excluded = this.excluded;

    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.widgetElementId = this.el.id;
  }

  private trackWidgetEvent(action: WidgetAction) {
    if (this.trackingDeactivated) return;

    const { campaignTypeId, widgetType, ...rest } = this.getBasicEventData();

    const eventBody = {
      action,
      session_id: this.uiSessionId,
      ...rest,
    };

    const widgetEvent: WidgetEvent = createWidgetVpsEvent(eventBody);
    this.trackingApi.trackEvent(widgetEvent).then(this.setTrackingDeactivated);
  }

  private trackInitialSearch() {
    if (this.trackingDeactivated) return;
    const { campaignTypeId, widgetType, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      search_area: "full",
      source: "upload",
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  private handleImageSelection() {
    this.imageSource = "upload";
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
      (searchState.loading &&
        searchState.searchType === "image" &&
        this.uploadSource === "startCamera") ||
      this.cameraInitializing;

    const buttons = [
      this.cameraAvailable && (
        <button
          class="action-button"
          part="start-camera_button"
          onClick={() => {
            this.handleStartCameraClick();
          }}
        >
          <vviinn-preloader class={{ hidden: !isLoading }} />

          <span class={{ "action-button-content": true, hidden: isLoading }}>
            <slot name="vviinn-camera-icon">
              <CameraActionIcon />
            </slot>
            <span class={{ hidden: !this.cameraEnabled }}>
              <slot name="vviinn-camera-button-text-stop">
                {i18next.t("cameraButtonTextStop")}
              </slot>
            </span>
            <span class={{ hidden: this.cameraEnabled }}>
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
        onVviinnImageUpload={() => {
          this.handleVviinnImageUpload("uploadPhoto");
        }}
        onVviinnNoResult={({ detail }) => this.handleVviinnNoResult(detail)}
        resetVpsButton={this.resetVpsButton}
        basicEventData={this.getBasicEventData()}
        part="upload-photo_button"
        startUpload={
          this.buttonPressed && this.showingInButton && this.mode === "upload"
        }
        loading={
          searchState.loading &&
          searchState.searchType === "image" &&
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

  private resetState() {
    this.resetScroll("start-page_block");

    this.slidePosition = 0;
    searchState.resetCategoryLink = undefined;
    searchState.activeIonLink = undefined;
    searchState.image = O.none;
    searchState.imageUrl = O.none;
    searchState.imageBounds = O.none;
    searchState.searchArea = O.none;
    searchState.results = [];
    searchState.filters = [];
    searchState.dynamicFilters = [];
    searchState.detectedObjects = [];
    searchState.rectangleSearchForm = undefined;
    searchState.loading = false;
    searchState.serverError = false;
    searchState.searchType = undefined;
    this.searchQuery = "";
    this.wrongImageFormat = false;
    this.resetScroll("results-block");
    this.stopStreamTracks();
    this.initResultEvents();
    this.stream = null;
    this.cameraEnabled = false;
    this.cameraButtonClicked = false;
    this.cameraInitializing = false;
    this.setShowAspectRatioError(false);
  }

  private haveErrors(): boolean {
    return this.wrongImageFormat || searchState.serverError;
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

  LinkText = ({ href, children }) => {
    return <a href={href || ""}>{children}</a>;
  };

  render() {
    return (
      <Host exportparts="image-container, content-container, basket-button-container,brand, product-type, deeplink, currency, image, image-link, image-picture, price-container, price-amount-sale, price-amount-outdated, price-amount-regular, price-amount-base-regular, price-amount-base-sale, price-amount-base-outdated, price-outdated, price-regular, price-sale, price-prefix, title, product-card, upload-photo_button, show-files_button, start-camera_button, text-search-input, close-button, secondary-action, close-button, custom-label-0, custom-label-1, custom-label-2, custom-label-3, custom-label-4, energy-label-container, energy-label-icon, energy-label-product-type, energy-label-data-sheet-link">
        {!this.showingInButton && SlotSkeleton("vps")}

        <vviinn-overlayed-modal
          class={{ "first-screen": this.isOnboardingSlide() }}
          isFirstScreen={this.isOnboardingSlide()}
          active={this.active}
          resetState={this.resetState.bind(this)}
          onVviinnWidgetClose={() => this.handleModalClose()}
          buttonElementId={this.buttonElementId ?? this.widgetElementId}
          widgetVersion={version}
          hideBackButton={
            (this.mode === "upload" && this.showingInButton) ||
            (!this.cameraEnabled && this.isOnboardingSlide())
          }
          exportparts="secondary-action, title, close-button"
        >
          <vviinn-slider position={this.slidePosition}>
            <vviinn-slide
              class={{
                "start-page": true,
                "camera-enabled": this.cameraEnabled,
              }}
            >
              <vviinn-example-image
                onVviinnImageUploadFinished={
                  this.handleVviinnImageUploadFinished
                }
                onVviinnImageUpload={() => {
                  this.handleVviinnImageUpload("startCamera");
                }}
                basicEventData={this.getBasicEventData()}
                srcObject={this.stream}
                cameraButtonClicked={this.cameraButtonClicked}
                exampleImageSource={this.exampleImageSource}
              />
              <div
                class={{
                  error: this.haveErrors(),
                }}
                id="start-page_block"
              >
                <div class="start-page_main-content">
                  <div
                    class={{
                      "start-page_errors-block": true,
                      hidden:
                        !this.wrongImageFormat && !searchState.serverError,
                    }}
                  >
                    <vviinn-wrong-format
                      class={{ hidden: !this.wrongImageFormat }}
                      handler={() => this.resetState()}
                    />
                    <vviinn-server-error
                      class={{ hidden: !searchState.serverError }}
                      handler={() => this.resetState()}
                    />
                  </div>

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
              {this.isResultSlide() && searchState.searchType === "image" && (
                <div class="source-wrapper image-wrapper">
                  <vviinn-image-view
                    basicEventData={this.getBasicEventData()}
                    setShowAspectRatioError={this.setShowAspectRatioError}
                    showAspectRatioError={this.showAspectRatioError}
                  />
                  <div
                    class={{
                      "filters-wrapper": true,
                      hidden: this.showAspectRatioError,
                    }}
                  >
                    <div class="filters">
                      {searchState.filters.map((filter) => (
                        <search-filters
                          filter={filter}
                          basicEventData={this.getBasicEventData()}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {this.isResultSlide() && searchState.searchType === "text" && (
                <div class="source-wrapper text-search-wrapper">
                  <vviinn-text-search
                    token={this.token}
                    showInWidget={true}
                    searchQuery={this.searchQuery}
                    apiPath={this.apiPath}
                    locale={this.locale}
                  />

                  <div
                    class={{
                      "filters-wrapper": true,
                      hidden: this.showAspectRatioError,
                    }}
                  >
                    <vviinn-filters
                      filters={searchState.dynamicFilters}
                      showInWidget={true}
                    ></vviinn-filters>

                    <vviinn-extended-filters
                      filters={searchState.dynamicFilters}
                      mode="preview"
                      showHeader={false}
                    ></vviinn-extended-filters>
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
                  showAspectRatioError={this.showAspectRatioError}
                  trackingDeactivated={this.trackingDeactivated}
                  resetState={this.resetState.bind(this)}
                  replaceSlotsContentInWidget={this.replaceSlotsContent.bind(
                    this
                  )}
                  replaceSlotsContentInButton={this.replaceSlotsContentInButton}
                  textSearchQuery={this.searchQuery}
                  addPriceContainer={this.addPriceContainer}
                />
              )}
            </vviinn-slide>
          </vviinn-slider>
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
