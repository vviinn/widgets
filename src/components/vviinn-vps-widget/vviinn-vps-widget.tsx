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
  ProductClickEvent,
  ProductLoadEvent,
  ProductViewEvent,
  SearchImageSource,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  createFilterEvent,
  createProductClickVpsEvent,
  createProductLoadVpsEvent,
  createProductViewVpsEvent,
  createSearchEvent,
  createWidgetVpsEvent,
} from "../../tracking";
import {
  ProductCardEvent,
  BasicEventData,
  SelectFilterEventData,
  ProductCardEventData,
  SelectObjectEventData,
} from "../../recommendation/events";
import { SlotSkeleton } from "../customized-slots";
import { campaignTypeNames } from "../../campaign/Campaign";
import { parseExcluded } from "../../utils/collections/collectionsUtils";
import { resources } from "../../locale/resources-vps";
import { Locale } from "../../locale";

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
 * @part example-images - Example Images block.

 * @slot vviinn-onboarding-title - Title of onboarding section.
 * @slot onboarding-card-1-icon - Icon (or other graphics) on the first onboarding slide.
 * @slot onboarding-card-1-text - Text content of first onboarding slide.
 * @slot onboarding-card-2-icon - Icon (or other graphics) on the second onboarding slide.
 * @slot onboarding-card-2-text - Text content of second onboarding slide.
 * @slot onboarding-card-3-icon - Icon (or other graphics) on the third onboarding slide.
 * @slot onboarding-card-3-text - Text content of third onboarding slide.
 * @slot vviinn-example-images-title - Header of Example Images block.
 * @slot vviinn-example-images-1 - First image in Example Images block.
 * @slot vviinn-example-images-2 - Second image in Example Images block.
 * @slot vviinn-example-images-3 - Third image in Example Images block.
 * @slot vviinn-example-images-4 - Fourth image in Example Images block.
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

  private handleOpenLink(deeplink: string) {
    if (this.productDetailNewTab) {
      window.open(deeplink);
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
  activeWatcher(value: boolean) {
    if (value) {
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.trackOpenEvent();
    } else {
      document.body.style.overflow = this.overflow;
    }
  }

  @Watch("buttonPressed")
  buttonPressedWatcher(pressed: boolean) {
    if (!pressed) return;
    if (this.mode === "modal") {
      this.active = true;
      this.vviinnWidgetOpen.emit(this.getBasicEventData());
    }
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    if (this.trackingDeactivated) return;

    const {
      productRank,
      productId,
      productName,
      widgetType,
      widgetId,
      campaignTypeId,
      campaignTypeName,
      ...rest
    } = detail;

    const productLoadEvent: ProductLoadEvent = createProductLoadVpsEvent({
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    });

    this.trackingApi
      .trackEvent(productLoadEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.resultViewed) {
      this.resultViewed = true;
      this.vviinnResultView.emit(this.getBasicEventData());
    }

    if (this.trackingDeactivated) return;

    const {
      productRank,
      productId,
      productName,
      widgetType,
      widgetId,
      campaignTypeId,
      campaignTypeName,
      ...rest
    } = detail;

    const productViewEvent: ProductViewEvent = createProductViewVpsEvent({
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    });

    this.trackingApi
      .trackEvent(productViewEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const {
      productRank,
      productId,
      productName,
      widgetType,
      widgetId,
      campaignTypeId,
      campaignTypeName,
      ...rest
    } = detail;

    const productClickEvent: ProductClickEvent = createProductClickVpsEvent({
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    });

    const product = imageSearchState.results.find(
      (r) => r.productId === detail.productId
    );
    if (!product || !product.deeplink) return;

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(this.trackingDeactivated ? null : productClickEvent)
        .then(this.setTrackingDeactivated)
        .finally(() => {
          this.handleOpenLink(product.deeplink);
        });
    } else {
      this.handleOpenLink(product.deeplink);
    }
  }

  @Listen("vviinnImageCrop")
  trachSearchAreaChanges() {
    this.initResultEvents();
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "manual-selection",
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  @Listen("vviinnSelectObject")
  trackDetectedObject() {
    this.initResultEvents();
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "attention-point",
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  @Listen("vviinnSelectFilter")
  trackFilter({ detail }: CustomEvent<SelectFilterEventData>) {
    this.initResultEvents();
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createFilterEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      kind: "category",
      action: detail.action,
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

    i18next.init({
      lng: this.locale,
      fallbackLng: "de-DE",
      resources,
    });
  }

  componentWillLoad() {
    slotChangeListener(this, this.el);
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
  }

  private trackOpenEvent() {
    if (this.trackingDeactivated) return;

    const widgetOpenEvent: WidgetEvent = createWidgetVpsEvent({
      action: "open",
      session_id: this.uiSessionId,
    });
    this.trackingApi
      .trackEvent(widgetOpenEvent)
      .then(this.setTrackingDeactivated);
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

  private trackInitialSearch(source: SearchImageSource) {
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      search_area: "full",
      source,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
  }

  private renderResults() {
    if (imageSearchState.results.length === 0) return null;

    if (!this.resultLoaded && this.slidePosition === 1) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
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
        imageWidth={160}
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
    this.resetScroll("onboarding-block");

    this.slidePosition = 0;
    imageSearchState.image = O.none;
    imageSearchState.imageUrl = O.none;
    imageSearchState.imageBounds = O.none;
    imageSearchState.searchArea = O.none;
    imageSearchState.results = [];
    imageSearchState.filters = [];
    imageSearchState.detectedObjects = [];
    imageSearchState.activeIonLink = undefined;
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

    const elementsToReset = ["onboarding-block", "results-block"];
    elementsToReset.forEach((name) => this.resetScroll(name));

    if (this.trackingDeactivated) return;

    const widgetCloseEvent: WidgetEvent = createWidgetVpsEvent({
      action: "close",
      session_id: this.uiSessionId,
    });
    this.trackingApi
      .trackEvent(widgetCloseEvent)
      .then(this.setTrackingDeactivated);
  }

  render() {
    return (
      <Host>
        {!this.showingInButton && <SlotSkeleton />}

        <vviinn-overlayed-modal
          class={{ "first-screen": this.slidePosition === 0 }}
          active={this.active}
          resetState={this.resetState.bind(this)}
          onVviinnWidgetClose={() => this.handleModalClose()}
          buttonElementId={this.buttonElementId ?? this.id}
          widgetVersion={version}
          hideBackButton={this.mode === "upload"}
          exportparts="secondary-action, title, close-button, example-images"
        >
          <vviinn-slider showBullets={false} position={this.slidePosition}>
            <vviinn-slide class={{ "start-page": true }}>
              <div
                class={{
                  error: this.haveErrors(),
                  "start-page_block": true,
                }}
              >
                <vviinn-wrong-format
                  class={{ hidden: !this.wrongImageFormat }}
                  handler={() => (this.wrongImageFormat = false)}
                />
                <vviinn-server-error
                  class={{ hidden: !imageSearchState.serverError }}
                  handler={() => (imageSearchState.serverError = false)}
                />
                <vviinn-teaser class={{ hidden: this.haveErrors() }} />
                <vviinn-image-selector
                  class={{ hidden: this.haveErrors() }}
                  onVviinnImageUploadFinished={() => {
                    this.handleImageSelection("upload");
                    if (this.mode === "upload") {
                      this.vviinnWidgetOpen.emit(this.getBasicEventData());
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
                  <span slot="upload-button-text" class="upload-button-content">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="28"
                      fill="none"
                    >
                      <defs />
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M10.271 3.89A.875.875 0 0111 3.5h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.75A2.625 2.625 0 013.125 21V8.75A2.625 2.625 0 015.75 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.75a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M14.5 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <slot name="vviinn-image-upload-button-text">
                      <span>{i18next.t("imageUploadButtonText")}</span>
                    </slot>
                  </span>
                </vviinn-image-selector>
                <vviinn-privacy-badge
                  class={{ hidden: this.haveErrors() }}
                  privacyBadgeText={i18next.t("privacyBadgeText")}
                />
              </div>
              <div id="onboarding-block" class="start-page_block">
                <div class="onboarding-wrapper">
                  <vviinn-onboarding />
                  <vviinn-example-images
                    part="example-images"
                    exampleImagesTitle={i18next.t("exampleImagesTitle")}
                    onVviinnImageUploadFinished={() =>
                      this.handleImageSelection("example")
                    }
                    onVviinnImageUpload={() => {
                      this.trackInitialSearch("example");
                    }}
                    onVviinnNoResult={() =>
                      this.resetScroll("onboarding-block", "smooth")
                    }
                    basicEventData={this.getBasicEventData()}
                  />
                </div>
              </div>
            </vviinn-slide>
            <vviinn-slide
              class={{ "results-page": true, active: this.slidePosition == 1 }}
            >
              <div class="image-wrapper">
                <vviinn-image-view basicEventData={this.getBasicEventData()} />
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
                  {this.renderResults()}
                </div>
              </div>
            </vviinn-slide>
          </vviinn-slider>
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
