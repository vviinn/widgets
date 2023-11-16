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
} from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { isEmpty } from "fp-ts/string";
import { v4 as uuidv4 } from "uuid";
import i18next from "i18next";

import { version } from "../../../package.json";
import { imageSearchState } from "../../store/imageSearch.store";
import { state } from "../../store/store";
import { slotChangeListener } from "../customized-slots";
import { createTrackingApi } from "../../openApi";
import {
  DefaultApi,
  EventConfirmation,
  ResultLoadEvent,
  ResultViewEvent,
  SearchImageSource,
  WidgetAction,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  createWidgetVpsEvent,
  createFilterEvent,
  createSearchEvent,
  createProductVpsEventByType,
  createResultVpsEventByType,
} from "../../tracking";
import {
  ProductCardEvent,
  BasicEventData,
  SelectFilterEventData,
  ProductCardEventData,
  SelectObjectEventData,
  ProductEventType,
  ProductEvent,
  ResultEventType,
} from "../../recommendation/events";
import { SlotSkeleton } from "../customized-slots";
import { campaignTypeNames } from "../../campaign/Campaign";
import { parseExcluded } from "../../utils/collections/collectionsUtils";
import { resources } from "../../locale/resources-vps";
import { Locale } from "../../locale";
import {
  CameraActionIcon,
  GalleryActionIcon,
  UploadActionIcon,
} from "../vviinn-icons";

const filterInt = (value: string) =>
  /^[-+]?(\d+|Infinity)$/.test(value) ? Number(value) : NaN;

const notEmptyString = (s: string) => !isEmpty(s);
const notNan = (n: number): boolean => !isNaN(n);

/**
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part title - Modal window title.
 * @part select-image_button - Upload Button.
 * @part product-card - Product Card itself.
 * @part brand - Brand inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around troduct title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-container - Block of prices.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part title - Title inside Product Card.
 * @part example-block - Example block.

 * @slot vviinn-onboarding-title - Title of onboarding section.
 * @slot onboarding-card-1-icon - Icon (or other graphics) on the first onboarding slide.
 * @slot onboarding-card-1-text - Text content of first onboarding slide.
 * @slot onboarding-card-2-icon - Icon (or other graphics) on the second onboarding slide.
 * @slot onboarding-card-2-text - Text content of second onboarding slide.
 * @slot onboarding-card-3-icon - Icon (or other graphics) on the third onboarding slide.
 * @slot onboarding-card-3-text - Text content of third onboarding slide.
 * @slot vviinn-example-image - Image in Example Images block.
 * @slot vviinn-teaser-text - Text on widget's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block.
 * @slot vviinn-image-search-modal-title - Image search modal title.
 *
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
  @Prop() productDetailNewTab: boolean = true;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number = 250;

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
  @Prop() mode: "modal" | "upload" = "modal";
  /** @internal */
  @Prop() resetVpsButton: () => void;

  @State() slidePosition: number = 0;
  @State() width: number = 0;
  @State() wrongImageFormat: boolean = false;
  @State() trackingDeactivated: boolean = false;
  @State() cameraActive: boolean = false;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** The event emits on widget load */
  @Event({ bubbles: true })
  vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** The event emits on modal open */
  @Event({ bubbles: true })
  vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** The event emits on modal close */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The image upload has started */
  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;

  /** Recommended product renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Recommended product appears in the viewport. */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Wrong image format, that isn’t .jpg, .jpeg, png, or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Crop area changes */
  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;

  /** User selects the detected object */
  @Event() vviinnSelectObject: EventEmitter<SelectObjectEventData>;

  /** User selects one of the filters */
  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;

  private overflow: string;
  private uiSessionId: string;
  private trackingApi: DefaultApi;
  private imageSource: SearchImageSource | null = null;
  private id?: string;
  private resultLoaded: boolean = false;
  private resultViewed: boolean = false;

  private initResultEvents() {
    this.resultLoaded = false;
    this.resultViewed = false;
  }

  private isOnboardingSlide() {
    return this.slidePosition === 0;
  }

  private isResultSlide() {
    return this.slidePosition === 1;
  }

  private handleOpenLink(deeplink: string, event: MouseEvent) {
    if (this.productDetailNewTab || event.ctrlKey || event.metaKey) {
      let newTab = window.open();
      if (newTab) {
        newTab.location.href = deeplink;
      } else {
        window.location.href = deeplink;
      }
    } else {
      window.location.href = deeplink;
    }
  }

  componentDidLoad() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit(Array.from(slots));
  }

  setTrackingDeactivated = (result: EventConfirmation) => {
    if (result.status === "rejected") {
      this.trackingDeactivated = true;
    }
  };

  getBasicEventData = (): BasicEventData => {
    return {
      widgetType: "VPS",
      campaignTypeId: "VPS",
      campaignTypeName: campaignTypeNames["VPS"],
      widgetId: this.buttonElementId ?? this.id,
      widgetVersion: version,
    };
  };

  @Watch("active")
  activeWatcher(active: boolean) {
    if (active) {
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.vviinnWidgetOpen.emit(this.getBasicEventData());
      this.trackWidgetEvent("open");
    } else {
      document.body.style.overflow = this.overflow;
      this.initResultEvents();
    }
  }

  @Watch("buttonPressed")
  buttonPressedWatcher(pressed: boolean) {
    if (!pressed) return;
    if (this.mode === "modal") {
      this.active = true;
    }
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    const productLoadEvent = this.getProductTrackEvent(detail, "load");

    this.trackingApi
      .trackEvent(productLoadEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.resultViewed) {
      this.resultViewed = true;
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");

    this.trackingApi
      .trackEvent(productViewEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = imageSearchState.results.find(
      (r) => r.productId === productId
    );
    if (!product || !product.deeplink) return;

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(productClickEvent)
        .then(this.setTrackingDeactivated)
        .finally(() => {
          this.handleOpenLink(product.deeplink, clickEvent);
        });
    } else {
      this.handleOpenLink(product.deeplink, clickEvent);
    }
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = imageSearchState.results.find(
      (r) => r.productId === productId
    );
    if (!product || !product.deeplink) return;

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(productClickEvent)
        .then(this.setTrackingDeactivated);
    }
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
  trackFilter({ detail }: CustomEvent<SelectFilterEventData>) {
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

  @Listen("secondaryActionClicked")
  trackSecondaryAction() {
    this.initResultEvents();
  }

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
    i18next.init({
      lng: this.locale,
      fallbackLng: "de-DE",
      resources,
    });

    imageSearchState.token = this.token;
    imageSearchState.campaignId = pipe(
      this.campaignId,
      O.fromNullable,
      O.chain(O.fromPredicate(notEmptyString)),
      O.map(filterInt),
      O.chain(O.fromPredicate(notNan)),
      O.map((s) => `${s}`)
    );

    if (this.excluded) {
      this.excluded = parseExcluded(this.excluded);
    }

    imageSearchState.excluded = this.excluded;

    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.id = this.el.id;
  }

  componentWillLoad() {
    slotChangeListener(this, this.el);
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
    this.trackWidgetEvent("load");
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

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType
  ): ProductEvent | null {
    if (this.trackingDeactivated) return null;

    const {
      productRank,
      productId,
      campaignTypeId,
      widgetType,
      clickEvent,
      ...rest
    } = detail;

    const eventBody = {
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    };

    const productEvent: ProductEvent =
      createProductVpsEventByType(eventType)(eventBody);

    return productEvent;
  }

  private trackResultEvent(type: ResultEventType) {
    if (this.trackingDeactivated) return;
    const { campaignTypeId, widgetType, ...rest } = this.getBasicEventData();

    let resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultVpsEventByType(type)({
        session_id: this.uiSessionId,
        ...rest,
      });

    this.trackingApi.trackEvent(resultEvent).then(this.setTrackingDeactivated);
  }

  private trackInitialSearch(source: SearchImageSource) {
    if (this.trackingDeactivated) return;
    const { campaignTypeId, widgetType, ...rest } = this.getBasicEventData();

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      search_area: "full",
      source,
      ...rest,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  private handleImageSelection(source: SearchImageSource) {
    this.imageSource = source;
    this.slidePosition = 1;
    const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
    const overlay = root.shadowRoot.querySelector("vviinn-overlay");
    const modal = overlay.querySelector("vviinn-modal");
    const modalBody = modal.shadowRoot.querySelector(".body");
    modalBody.scrollTop = 0;
  }

  private renderResults() {
    if (imageSearchState.results.length === 0) return null;

    if (!this.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
      this.resultLoaded = true;
    }

    return imageSearchState.results.map((p, i) => (
      <vviinn-product-card
        key={p.productId}
        hidden={true}
        productTitle={p.title}
        productId={p.productId}
        productType={p.productType}
        brand={p.brand}
        deeplink={p.deeplink}
        price={p.price.actual}
        salePrice={p.price.sale}
        responsive={true}
        imageWidth={this.imageResolutionWidth}
        image={p.image.thumbnail ?? p.image.original}
        part="product-card"
        campaignTypeId="VPS"
        index={i}
        widgetElementId={this.id}
        buttonElementId={this.buttonElementId}
        widgetVersion={version}
      />
    ));
  }

  private resetState() {
    this.resetScroll("start-page_block");

    this.slidePosition = 0;
    imageSearchState.resetCategoryLink = undefined;
    imageSearchState.activeIonLink = undefined;
    imageSearchState.image = O.none;
    imageSearchState.imageUrl = O.none;
    imageSearchState.imageBounds = O.none;
    imageSearchState.searchArea = O.none;
    imageSearchState.results = [];
    imageSearchState.filters = [];
    imageSearchState.detectedObjects = [];
    imageSearchState.rectangleSearchForm = undefined;
    imageSearchState.loading = false;
    this.resetScroll("results-block");
  }

  private haveErrors(): boolean {
    return this.wrongImageFormat || imageSearchState.serverError;
  }

  private resetScroll(elementId: string, behavior: ScrollBehavior = "auto") {
    const element: HTMLElement = this.el.shadowRoot.getElementById(elementId);
    element.scroll({ top: 0, left: 0, behavior });
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
      <Host>
        {!this.showingInButton && <SlotSkeleton />}

        <vviinn-overlayed-modal
          class={{ "first-screen": this.isOnboardingSlide() }}
          isFirstScreen={this.isOnboardingSlide()}
          active={this.active}
          resetState={this.resetState.bind(this)}
          onVviinnWidgetClose={() => this.handleModalClose()}
          buttonElementId={this.buttonElementId ?? this.id}
          widgetVersion={version}
          hideBackButton={this.mode === "upload" && this.showingInButton}
          exportparts="secondary-action, title, close-button, example-images"
        >
          <vviinn-slider showBullets={false} position={this.slidePosition}>
            <vviinn-slide class={{ "start-page": true }}>
              <vviinn-example-block
                part="example-block"
                exampleImagesTitle={i18next.t("exampleImagesTitle")}
                onVviinnImageUploadFinished={() =>
                  this.handleImageSelection("example")
                }
                onVviinnImageUpload={() => {
                  this.trackInitialSearch("example");
                }}
                onVviinnNoResult={() =>
                  this.resetScroll("start-page_block", "smooth")
                }
                basicEventData={this.getBasicEventData()}
              />
              <div
                class={{
                  error: this.haveErrors(),
                }}
                id="start-page_block"
              >
                <div class="start-page_main-content">
                  <div class="start-page_errors-block">
                    <vviinn-wrong-format
                      class={{ hidden: !this.wrongImageFormat }}
                      handler={() => (this.wrongImageFormat = false)}
                    />
                    <vviinn-server-error
                      class={{ hidden: !imageSearchState.serverError }}
                      handler={() => (imageSearchState.serverError = false)}
                    />
                  </div>

                  {!this.haveErrors() && <vviinn-teaser />}
                  {!this.haveErrors() && (
                    <div class="buttons-group">
                      <button
                        class="action-button"
                        onClick={() => {
                          this.cameraActive = true;
                        }}
                      >
                        <span class="action-button-content">
                          <CameraActionIcon />
                          <span>Start Camera</span>
                        </span>
                      </button>

                      <button class="action-button">
                        <span class="action-button-content">
                          <GalleryActionIcon />
                          <span>Show Gallery</span>
                        </span>
                      </button>

                      <vviinn-image-selector
                        class="action-button"
                        onVviinnImageUploadFinished={() => {
                          this.handleImageSelection("upload");
                          if (this.mode === "upload" && this.showingInButton) {
                            this.active = true;
                          }
                        }}
                        onVviinnImageUpload={() => {
                          this.trackInitialSearch("upload");
                        }}
                        onVviinnNoResult={() => (this.wrongImageFormat = true)}
                        resetVpsButton={this.resetVpsButton}
                        basicEventData={this.getBasicEventData()}
                        part="select-image_button"
                        startUpload={
                          this.buttonPressed &&
                          this.showingInButton &&
                          this.mode === "upload"
                        }
                      >
                        <span
                          slot="upload-button-text"
                          class="action-button-content"
                        >
                          <UploadActionIcon />
                          <slot name="vviinn-image-upload-button-text">
                            <span>{i18next.t("imageUploadButtonText")}</span>
                          </slot>
                        </span>
                      </vviinn-image-selector>
                    </div>
                  )}
                </div>
                {!this.haveErrors() && (
                  <vviinn-privacy-badge
                    privacyBadgeText={i18next.t("privacyBadgeText")}
                  />
                )}
              </div>
            </vviinn-slide>
            <vviinn-slide
              class={{
                "results-page": true,
                active: this.isResultSlide(),
              }}
            >
              <div class="image-wrapper">
                {this.isResultSlide() && (
                  <vviinn-image-view
                    basicEventData={this.getBasicEventData()}
                  />
                )}
                <div class="filters-wrapper">
                  <div class="filters">
                    {imageSearchState.filters.map((filter) => (
                      <search-filters
                        filter={filter}
                        basicEventData={this.getBasicEventData()}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div id="results-block" class="products-wrapper">
                <div
                  class={{
                    "nothing-found": true,
                    hidden: imageSearchState.results.length > 0,
                  }}
                >
                  <vviinn-empty-results />
                  <vviinn-onboarding />
                </div>
                <div
                  class={{
                    hidden: imageSearchState.results.length <= 0,
                    products: true,
                  }}
                >
                  {this.active && this.renderResults()}
                </div>
              </div>
            </vviinn-slide>
          </vviinn-slider>
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
