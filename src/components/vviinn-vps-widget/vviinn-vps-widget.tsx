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
import i18next from "i18next";

import { version } from "../../../package.json";
import {
  resetResultEvents,
  resetStore,
  setTextSearchQuery,
  SearchStore,
  SearchStoreName,
  useSearchStore,
} from "../../store/search.store";
import { trackEvent } from "../../store/store";
import { slotChangeListener, SlotSkeleton } from "../customized-slots";
import { WidgetAction, WidgetEvent } from "vviinn-tracking-client-ts";
import { createWidgetEvent } from "../../tracking";
import { trackImageSearch } from "../../tracking/searchTracking";
import { getUiSessionId } from "../../tracking/session";
import {
  BasicEventData,
  SelectObjectEventData,
  NoResultEventData,
  TextSearchEvent,
  ImageCropEventData,
  ImageUploadEventData,
  RedirectEventData,
  SearchIdEventData,
} from "../../recommendation/events";
import { campaignTypeNames } from "../../campaign/Campaign";
import {
  addIfNotEmpty,
  parseStringToExcluded,
} from "../../utils/collections/collectionsUtils";
import { ErrorType } from "../vviinn-error";
import { Locale, initializeLocale } from "../../locale";
import {
  CameraActionIcon,
  UploadActionIcon,
  DragDropImageIcon,
} from "../vviinn-icons";
import { DEFAULT_EXAMPLE_IMAGE } from "../../constants/exampleImage";
import { videoStreamSettings } from "../../video/settings";
import { Recommendation } from "../../interfaces";
import { checkDeviceType } from "../../helpers/device/checkDeviceType";
import {
  LoadMoreMode,
  OneClickDiscoveryAppendMode,
  UploadSource,
  VisualSearchMode,
} from "../../widget/types";
import {
  extendedFiltersParts,
  filtersParts,
  modalParts,
  productCardParts,
  productCardsGridPart,
  showMoreButtonPart,
  searchBarParts,
  searchWidgetButtonParts,
  searchWidgetFilterParts,
  suggestionsParts,
} from "../../cssParts";
import { findSlotElements, addEventListenersWithSignal } from "../../dom";
import { SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH } from "../../widget/constants";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
import {
  isOnResultsPage,
  buildImageSearchRedirectUrl,
  parseResultsPageParamNames,
} from "../../helpers/url/resultsPageUrl";

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
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 *
 * @slot vviinn-results-vpr-icon - One-Click Discovery icon, hidden when `one-click-discovery-mode` is `unset`.
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part results-title - Title on the results page.
 * @part upload-photo_button - Upload Photo Button.
 * @part start-camera_button - Start Camera Button.
 * @part products - Products container.
 * @part show-more-button - Button that loads the next results. Rendered only if "load-more" property is "button".
 * @part product-card - Product Card itself.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
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
 * @part basket-button - Add to Basket button.
 * @part basket-button-container - Product Card's basket button container.
 * @part favorite-button - Favorite button.
 * @part product-card-actions - Product Card actions wrapper.
 * @part product-card-actions-top - Product Card top actions wrapper.
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
 * @part product-images-pagination - Container for product images pagination dots (mobile only).
 * @part product-images-pagination-bullet - Individual pagination dot.
 * @part product-images-pagination-bullet-active - Active pagination dot.
 */

@Component({
  tag: "vviinn-vps-widget",
  styleUrl: "vviinn-vps-widget.css",
  shadow: true,
})
export class VviinnVpsWidget {
  @Element() el: HTMLVviinnVpsWidgetElement;

  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
  /** Toggle the widget's modal showing */
  @Prop({ mutable: true }) active: boolean = true;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Locale for number formatting. Falls back to locale */
  @Prop() numberLocale?: string;
  /** Campaign ID used for Visual Search (deprecated) */
  @Prop() campaignId: string = "";
  /** Campaign ID used for Text Search */
  @Prop() campaignIdTextSearch: string = "";
  /** Campaign ID used for Visual Search */
  @Prop() campaignIdVisualSearch: string = "";
  /** Excluded filter. Example: "brand:Nike,Vans;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = true;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number = SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Show multiple images: swiper on mobile, hover on desktop in product cards */
  @Prop() showMultipleImages: boolean = false;
  /** Accept image files dropped from the OS onto the upload button (desktop only) */
  @Prop() useDragAndDrop: boolean = false;
  /** Example image source */
  @Prop() exampleImageSource: string = DEFAULT_EXAMPLE_IMAGE;
  /** Show the text search */
  @Prop() textSearchShow: boolean = false;
  /** Show auto-suggest dropdown with search completions */
  @Prop() autoSuggestShow: boolean = true;
  /** Show the AI Suggestions block in search results */
  @Prop() aiSuggestionsShow: boolean = false;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** One-Click Discovery mode, restricted to append only (no modal supported for this component)*/
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryAppendMode = "append-grid";
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  /** Load the next results: "button" shows a button below the results */
  @Prop() loadMore: LoadMoreMode = "none";
  /** Show editable input fields in interval filters instead of readonly labels */
  @Prop() showIntervalInputs: boolean = false;
  /** URL to external CSS file for custom styling */
  @Prop() cssUrl: string | null = null;
  /** Render results in modal. Set false to redirect or show results on the page. */
  @Prop() showResultsInModal?: boolean = true;
  /** URL of the results page for automatic search redirect. */
  @Prop() resultsPageUrl?: string;
  /** Custom URL param names for results page redirect. Default: "query=query&searchId=searchId". */
  @Prop() resultsPageParams?: string;

  private get showInWidget() {
    return this.showResultsInModal;
  }

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

  @State() slidePosition: number = 0;
  @State() uploadSource: UploadSource | null = null;
  @State() stream: MediaStream | null = null;
  @State() products: Recommendation[] = [];
  @State() modalBody?: HTMLElement;
  @State() uploadDialogOpened: boolean = false;

  @State() isCameraInitializing: boolean = false;
  @State() isCameraEnabled: boolean = false;
  @State() isCameraButtonClicked: boolean = false;

  @State() showAspectRatioError = false;
  @State() wrongImageFormat: "wrong-format" | "heic-not-supported" | false =
    false;

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
  @Event() vviinnImageCrop: EventEmitter<ImageCropEventData>;

  /** User selects the detected object */
  @Event() vviinnSelectObject: EventEmitter<SelectObjectEventData>;

  /** The image upload has started */
  @Event() vviinnImageUploadStarted: EventEmitter<ImageUploadEventData>;

  /** Wrong image format (supported formats depend on the browser), or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Redirect to results page (can be intercepted by client via preventDefault) */
  @Event({ cancelable: true, bubbles: true, composed: true })
  vviinnRedirect: EventEmitter<RedirectEventData>;

  private overflow: string;
  private uiSessionId: string;
  private cameraAvailable: boolean = false;
  private isDesktop: boolean = false;
  private videoTrack: MediaStreamTrack | null = null;
  private widgetElementId: string;
  private slots: HTMLSlotElement[] = [];
  private state?: SearchStore;
  private storeName?: SearchStoreName;
  private eventAbortController?: AbortController;

  private isTextSearch = () => this.state.searchType === "text";

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

  private handleVviinnImageUploadFinished = (detail: SearchIdEventData) => {
    const visualSearchRedirect = this.state.redirect;
    const hasVisualSearchRedirect =
      !!visualSearchRedirect?.url &&
      visualSearchRedirect.searchId === detail.searchId;

    if (hasVisualSearchRedirect) {
      this.handleImageSearchRedirect(visualSearchRedirect.url, detail.searchId);
      return;
    }

    const shouldRedirectToResultsPage =
      this.resultsPageUrl &&
      !this.showInWidget &&
      !isOnResultsPage(this.resultsPageUrl);

    if (shouldRedirectToResultsPage) {
      const url = buildImageSearchRedirectUrl(
        this.resultsPageUrl,
        detail.searchId,
        parseResultsPageParamNames(this.resultsPageParams).searchId,
      );
      this.handleImageSearchRedirect(url, detail.searchId);
      return;
    }

    this.handleImageSelection();
    if (this.mode === "upload" && this.showInWidget) this.active = true;
  };

  private handleImageSearchRedirect(url: string, searchId: string) {
    const redirectData: RedirectEventData = {
      ...this.getBasicEventData(),
      url,
      source: "visual-search",
      searchId,
    };
    const event = this.vviinnRedirect.emit(redirectData);

    if (!event.defaultPrevented) {
      window.location.href = url;
    }
  }

  private handleVviinnNoResult = (detail: NoResultEventData) => {
    if (detail.reason === "client") {
      if (detail.errorCode === "heic-not-supported") {
        this.wrongImageFormat = "heic-not-supported";
      } else if (
        detail.errorCode === "unsupported-file-type" ||
        !detail.errorCode
      ) {
        this.wrongImageFormat = "wrong-format";
      }
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
        console.error("Error accessing camera: ", error.message);
        this.resetState();
        this.isCameraInitializing = false;
      }
    }, CAMERA_START_DELAY);
  };

  private setShowAspectRatioError = (isError: boolean) => {
    this.showAspectRatioError = isError;
  };

  async componentWillLoad() {
    await initializeLocale(this.locale);

    this.slots = findSlotElements(this.el);

    slotChangeListener(this, this.el);
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
    this.trackWidgetEvent("load");
  }

  componentDidLoad() {
    this.replaceSlotsContent();
  }

  private getBasicEventData = (isTextSearch?: boolean): BasicEventData => {
    const activeCampaign = this.isTextSearch() || isTextSearch ? "TPS" : "VPS";
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
      if (this.mode === "upload") {
        this.slidePosition !== 1 && this.resetInnerState();
      } else {
        this.resetState();
      }
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.vviinnWidgetOpen.emit(this.getBasicEventData());
      if (this.mode === "camera") this.handleStartCameraClick();
      this.trackWidgetEvent("open");
    } else {
      this.mode === "upload" && setTimeout(() => this.resetState(), 500);
      document.body.style.overflow = this.overflow;
      this.showInWidget && resetResultEvents(this.storeName);
    }
  }

  @Watch("slidePosition")
  slidePositionWatcher() {
    if (this.slidePosition === 1) {
      const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
      const overlay = root.shadowRoot.querySelector("vviinn-overlay");
      const modal = overlay.querySelector("vviinn-modal");
      this.modalBody = modal.shadowRoot.querySelector(".body");
      this.modalBody.scrollTop = 0;
      this.stopStreamTracks();
    }
  }

  @Listen("widgetTextSearchFinished")
  textSearchFinishedHandler({ detail }: TextSearchEvent) {
    setTextSearchQuery(this.storeName, detail.query);
    if (this.showInWidget) {
      this.slidePosition = 1;
    } else {
      this.closeModalAndResetState();
    }
  }

  @Listen("vviinnTextSearchStarted")
  textSearchStartedHandler({ detail }: TextSearchEvent) {
    if (!this.showInWidget && !detail.isTriggeredByVpsWidget) {
      this.closeModalAndResetState();
    }
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

  connectedCallback() {
    this.isDesktop = checkDeviceType() === "desktop";
    const { state, storeName } = useSearchStore(this.showInWidget);
    this.storeName = storeName;
    this.state = state;
    this.cameraAvailable =
      !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

    this.state.campaignId = this.campaignId;
    this.state.campaignIdTextSearch = this.campaignIdTextSearch;
    this.state.campaignIdVisualSearch = this.campaignIdVisualSearch;
    this.state.excluded = parseStringToExcluded(this.excluded);

    this.uiSessionId = getUiSessionId(storeName);
    this.widgetElementId = this.el.id;

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [["vviinnCropperAspectRatioError", this.handleAspectRatioError]],
      signal,
    );
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
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
    const widgetEvent: WidgetEvent = createWidgetEvent("VPS")(eventBody);
    trackEvent(widgetEvent, this.token, this.apiPath);
  }

  private trackInitialSearch() {
    trackImageSearch({
      searchArea: "full",
      storeName: this.storeName,
      token: this.token,
      apiPath: this.apiPath,
      basicEventData: this.getBasicEventData(),
    });
  }

  private closeModalAndResetState() {
    this.resetVpsButton?.();
    this.resetState();
    this.active = false;
  }

  private handleImageSelection() {
    if (this.showInWidget) {
      this.slidePosition = 1;
    } else {
      this.closeModalAndResetState();
    }
  }

  private handleButtonKeyDown = (event: KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  private renderButtons() {
    const isLoading =
      (this.state.searchStatus === "loading" &&
        this.state.searchType === "image" &&
        this.uploadSource === "startCamera") ||
      this.isCameraInitializing;

    const isDropZone = this.useDragAndDrop && this.isDesktop;

    const buttons = [
      this.cameraAvailable && (
        <button
          class="action-button"
          part="start-camera_button"
          onClick={this.handleStartCameraClick}
          onKeyDown={(e) =>
            this.handleButtonKeyDown(e, this.handleStartCameraClick)
          }
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
        class={isDropZone ? "upload-drop-zone" : "action-button"}
        onClick={() => {
          if (this.mode !== "upload") this.uploadSource = "uploadPhoto";
        }}
        onKeyDown={(e) =>
          this.handleButtonKeyDown(e, () => {
            if (this.mode !== "upload") this.uploadSource = "uploadPhoto";
          })
        }
        onVviinnImageUploadFinished={({ detail }) =>
          this.handleVviinnImageUploadFinished(detail)
        }
        onVviinnImageUploadStarted={() => {
          this.uploadDialogOpened = true;
          this.handleVviinnImageUpload("uploadPhoto");
        }}
        token={this.token}
        apiPath={this.apiPath}
        useDragAndDrop={isDropZone}
        storeName={this.storeName}
        state={this.state}
        onVviinnNoResult={({ detail }) => this.handleVviinnNoResult(detail)}
        resetVpsButton={this.resetVpsButton}
        basicEventData={this.getBasicEventData()}
        part={isDropZone ? "drop-zone" : "upload-photo_button"}
        startUpload={
          this.buttonPressed &&
          this.mode === "upload" &&
          !this.uploadDialogOpened
        }
        showInWidget={this.showInWidget}
        loading={
          this.state.searchStatus === "loading" &&
          this.state.searchType === "image" &&
          this.uploadSource === "uploadPhoto"
        }
      >
        <span slot="drop-zone-icon">
          <slot name="vviinn-drag-drop-icon">
            <DragDropImageIcon />
          </slot>
        </span>
        <span slot="drop-zone-text">
          <slot name="vviinn-drag-drop-text">
            {i18next.t("dragDropHintText")}
          </slot>
        </span>

        <span slot="upload-button-text" class="action-button-content">
          {!isDropZone && (
            <slot name="vviinn-image-upload-icon">
              <UploadActionIcon />
            </slot>
          )}

          <slot name="vviinn-image-upload-button-text">
            <span>{i18next.t("imageUploadButtonText")}</span>
          </slot>
        </span>
      </vviinn-image-selector>,
    ];

    return this.isDesktop ? buttons.reverse() : buttons;
  }

  private resetInnerState = () => {
    this.showInWidget && setTextSearchQuery(this.storeName, null);
    this.wrongImageFormat = false;
    this.resetScroll("results-block");
    this.stopStreamTracks();
    this.showInWidget && resetResultEvents(this.storeName);
    this.stream = null;
    this.isCameraEnabled = false;
    this.isCameraButtonClicked = false;
    this.isCameraInitializing = false;
    this.setShowAspectRatioError(false);
    this.slidePosition = 0;
    this.uploadSource = null;
    this.uploadDialogOpened = false;
    this.resetScroll("start-page_block");
  };

  private resetState = () => {
    this.resetInnerState();
    this.showInWidget && resetStore(this.storeName, "appStateAndReceivedData");
  };

  private haveErrors(): boolean {
    return !!this.wrongImageFormat || this.state.searchStatus === "error";
  }

  private getCurrentErrorType(): ErrorType | null {
    if (this.wrongImageFormat) return this.wrongImageFormat;
    if (this.state.searchStatus === "error") return "server-error";
    return null;
  }

  private resetScroll(elementId: string, behavior: ScrollBehavior = "auto") {
    const element: HTMLElement = this.el.shadowRoot.getElementById(elementId);
    element?.scroll({ top: 0, left: 0, behavior });
  }

  private handleModalClose() {
    this.active = false;

    const elementsToReset = ["start-page_block", "results-block"];
    elementsToReset.forEach((name) => this.resetScroll(name));
    this.trackWidgetEvent("close");
  }

  render() {
    return (
      <Host
        exportparts={`${modalParts}, ${productCardParts}, ${searchBarParts}, ${searchWidgetFilterParts}, ${searchWidgetButtonParts}, ${productCardsGridPart}, ${showMoreButtonPart}, ${suggestionsParts}`}
      >
        {renderExternalCSS(this.cssUrl)}

        {!this.showingInButton && SlotSkeleton("search")}

        <vviinn-overlayed-modal
          class={{ "first-screen": this.isOnboardingSlide() }}
          isFirstScreen={this.isOnboardingSlide()}
          active={this.active}
          resetState={this.resetState}
          onVviinnWidgetClose={({ detail }: CustomEvent<BasicEventData>) => {
            if (detail.campaignTypeId !== "VPR") this.handleModalClose();
          }}
          buttonElementId={this.buttonElementId ?? this.widgetElementId}
          widgetVersion={version}
          hideBackButton={
            this.mode === "upload" ||
            (!this.isCameraEnabled && this.isOnboardingSlide())
          }
        >
          <vviinn-slider position={this.slidePosition}>
            <vviinn-slide
              class={{
                "start-page": true,
                "camera-enabled": this.isCameraEnabled,
              }}
            >
              <vviinn-camera
                token={this.token}
                onVviinnImageUploadFinished={({ detail }) =>
                  this.handleVviinnImageUploadFinished(detail)
                }
                onVviinnImageUploadStarted={() => {
                  this.handleVviinnImageUpload("startCamera");
                }}
                apiPath={this.apiPath}
                basicEventData={this.getBasicEventData()}
                srcObject={this.stream}
                cameraButtonClicked={this.isCameraButtonClicked}
                exampleImageSource={this.exampleImageSource}
                showInWidget={this.showInWidget}
                storeName={this.storeName}
                state={this.state}
              />
              <div
                class={{
                  error: this.haveErrors(),
                }}
                id="start-page_block"
              >
                <div class="start-page_main-content">
                  {(this.wrongImageFormat ||
                    this.state.searchStatus === "error") && (
                    <div class="start-page_errors-block">
                      {this.getCurrentErrorType() && (
                        <vviinn-error
                          errorType={this.getCurrentErrorType()}
                          handler={this.resetState}
                          hasBackground={true}
                          searchType={this.state.searchType}
                        />
                      )}
                    </div>
                  )}

                  {!this.haveErrors() && (
                    <Fragment>
                      <vviinn-teaser />

                      <div class="buttons-group">{this.renderButtons()}</div>

                      {this.textSearchShow && !this.isResultSlide() && (
                        <vviinn-text-search
                          token={this.token}
                          apiPath={this.apiPath}
                          locale={this.locale}
                          showInWidget={this.showInWidget}
                          showOnFirstScreen={true}
                          uiSessionId={this.uiSessionId}
                          basicEventData={this.getBasicEventData(true)}
                          resultsPageUrl={this.resultsPageUrl}
                          autoSuggestShow={this.autoSuggestShow}
                          save-image-mode="never"
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
              {this.isResultSlide() && (
                <div class="source-wrapper">
                  {this.isTextSearch() && (
                    <vviinn-text-search
                      token={this.token}
                      showInWidget={this.showInWidget}
                      apiPath={this.apiPath}
                      locale={this.locale}
                      uiSessionId={this.uiSessionId}
                      basicEventData={this.getBasicEventData(true)}
                      resultsPageUrl={this.resultsPageUrl}
                      autoSuggestShow={this.autoSuggestShow}
                      save-image-mode="never"
                    />
                  )}

                  {!this.isTextSearch() && (
                    <vviinn-cropper
                      token={this.token}
                      basicEventData={this.getBasicEventData()}
                      showAspectRatioError={this.showAspectRatioError}
                      apiPath={this.apiPath}
                      showInWidget={this.showInWidget}
                      save-image-mode="never"
                    />
                  )}

                  {this.aiSuggestionsShow && (
                    <vviinn-suggestions
                      showInWidget={this.showInWidget}
                      token={this.token}
                      apiPath={this.apiPath}
                      locale={this.locale}
                    />
                  )}

                  <vviinn-selected-filters
                    locale={this.locale}
                    currencySign={this.currencySign}
                    showInWidget={this.showInWidget}
                    exportparts={filtersParts}
                  />

                  {this.state.dynamicFilters?.length > 0 && (
                    <div
                      class={{
                        "filters-wrapper": true,
                        hidden: this.showAspectRatioError,
                      }}
                    >
                      <vviinn-filters
                        showInWidget={this.showInWidget}
                        showIntervalInputs={this.showIntervalInputs}
                      />

                      <vviinn-extended-filters
                        mode="preview"
                        showHeader={false}
                        showInWidget={this.showInWidget}
                        locale={this.locale}
                        currencySign={this.currencySign}
                        showIntervalInputs={this.showIntervalInputs}
                      />

                      <vviinn-extended-filters-button
                        class={{
                          "extended-filters-button": true,
                          "has-primary-filters":
                            this.state.dynamicFilters.filter((f) => f.isPrimary)
                              .length > 0,
                        }}
                        showInWidget={this.showInWidget}
                      />
                    </div>
                  )}
                </div>
              )}

              {this.isResultSlide() && (
                <Fragment>
                  <vviinn-results
                    token={this.token}
                    locale={this.locale}
                    numberLocale={this.numberLocale}
                    pricePrefix={this.pricePrefix}
                    currency-sign={this.currencySign}
                    apiPath={this.apiPath}
                    campaignIdTextSearch={this.campaignIdTextSearch}
                    campaignIdVisualSearch={this.campaignIdVisualSearch}
                    uiSessionId={this.uiSessionId}
                    widgetElementId={
                      this.buttonElementId ?? this.widgetElementId
                    }
                    showInWidget={this.showInWidget}
                    buttonElementId={this.buttonElementId}
                    imageResolutionWidth={this.imageResolutionWidth}
                    showMultipleImages={this.showMultipleImages}
                    productDetailsNewTab={this.productDetailsNewTab}
                    productDetailsRedirect={this.productDetailsRedirect}
                    addToBasketShow={this.addToBasketShow}
                    favoriteShow={this.favoriteShow}
                    showAspectRatioError={this.showAspectRatioError}
                    resetWidgetState={this.resetState}
                    replaceSlotsContentInWidget={this.replaceSlotsContent.bind(
                      this,
                    )}
                    replaceSlotsContentInButton={
                      this.replaceSlotsContentInButton
                    }
                    addPriceContainer={this.addPriceContainer}
                    loadMore={this.loadMore}
                    oneClickDiscoveryMode={this.oneClickDiscoveryMode}
                    oneClickDiscoveryCampaigns={this.oneClickDiscoveryCampaigns}
                    parentSlots={[...this.parentSlots, ...this.slots]}
                    scrollableModalBody={this.modalBody}
                  />
                </Fragment>
              )}
            </vviinn-slide>
          </vviinn-slider>

          <vviinn-extended-filters
            class="modal-extended-filters"
            mode="modal"
            exportparts={extendedFiltersParts}
            showInWidget={this.showInWidget}
            locale={this.locale}
            currencySign={this.currencySign}
            showIntervalInputs={this.showIntervalInputs}
          />
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
