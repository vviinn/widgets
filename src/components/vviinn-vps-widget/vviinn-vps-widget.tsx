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
import { state } from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";
import * as O from "fp-ts/lib/Option";
import { isEmpty } from "fp-ts/string";
import { slotChangeListener } from "../customized-slots";
import { v4 as uuidv4 } from "uuid";
import { createTrackingApi } from "../../openApi";
import {
  DefaultApi,
  EventConfirmation,
  ProductClickEvent,
  ProductViewEvent,
  SearchImageSource,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  createFilterEvent,
  createProductClickVpsEvent,
  createProductViewVpsEvent,
  createSearchEvent,
  createWidgetVpsEvent,
} from "../../tracking";
import {
  ProductCardEvent,
  BasicEventData,
  SelectFilterEventData,
} from "../../recommendation/events";
import { pipe } from "fp-ts/lib/function";
import { SlotSkeleton } from "../customized-slots";
import { campaignTypeNames } from "../../campaign/Campaign";

const filterInt = (value: string) =>
  /^[-+]?(\d+|Infinity)$/.test(value) ? Number(value) : NaN;

const notEmptyString = (s: string) => !isEmpty(s);
const notNan = (n: number): boolean => !isNaN(n);

/**
 * @prop --color-primary: color used for action button, slider bullets and selected detected object;
 *
 * @part close-button - close button on modal header.
 * @part secondary-action - back button on modal header.
 * @part title - modal window title.
 *
 * @part select-image_button
 *
 * @part product-card - product card.
 * @part brand - product card brand.
 * @part currency - currency sign. Renders after price-amount inside product card.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image inside product card.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount-sale - numeric part of price inside product card.
 * @part price-amount-outdated - numeric part of price inside product card.
 * @part price-amount-regular - numeric part of price inside product card.
 * @part price-container - block contains all prices inside product card.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part title - product title
 * @part example-images - example images block

 * @slot vviinn-onboarding-title - Title of onboarding section
 * @slot onboarding-card-1-icon - Icon (or other graphics) on first onboarding slide
 * @slot onboarding-card-1-text - Text content of first onboarding slide
 * @slot onboarding-card-2-icon - Icon (or other graphics) on second onboarding slide
 * @slot onboarding-card-2-text - Text content of second onboarding slide
 * @slot onboarding-card-3-icon - Icon (or other graphics) on third onboarding slide
 * @slot onboarding-card-3-text - Text content of third onboarding slide
 * @slot vviinn-example-images-title - Header of example images block
 * @slot vviinn-example-images-1 - First image in example images block
 * @slot vviinn-example-images-2 - Second image in example images block
 * @slot vviinn-example-images-3 - Third image in example images block
 * @slot vviinn-example-images-4 - Fourth image in example images block
 * @slot vviinn-teaser-text - Text on widget's main screen
 * @slot vviinn-image-upload-button-text - Title of upload button
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block
 * @slot vviinn-image-search-modal-title - Image search title
 *
 */
@Component({
  tag: "vviinn-vps-widget",
  styleUrl: "vviinn-vps-widget.css",
  shadow: true,
})
export class VviinnVpsWidget {
  @Element() el: HTMLElement;

  /** vviinn customer token */
  @Prop() token: string | undefined;
  /** @internal */
  @Prop() apiPath: string = "https://api.vviinn.com";
  /** When true modal window with widget will be shown */
  @Prop({ mutable: true }) active: boolean = false;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** Campaign using for visual search */
  @Prop() campaignId?: string;
  /** Set true when showing the widget in button */
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

  @Event({ bubbles: true })
  vviinnWidgetLoad: EventEmitter<BasicEventData>;
  @Event({ bubbles: true })
  vviinnWidgetOpen: EventEmitter<BasicEventData>;

  // List to show in the Storybook:
  @Event() vviinnWidgetClose: EventEmitter;
  @Event() vviinnProductClick: EventEmitter;
  @Event() vviinnProductView: EventEmitter;
  @Event() vviinnProductLoad: EventEmitter;
  @Event() vviinnImageUpload: EventEmitter;
  @Event() vviinnImageCrop: EventEmitter;
  @Event() vviinnSelectObject: EventEmitter;
  @Event() vviinnSelectFilter: EventEmitter;
  @Event() vviinnNoResult: EventEmitter;

  private overflow: string;
  private uiSessionId: string;
  private trackingApi: DefaultApi;
  private imageSource: SearchImageSource | null = null;
  private id?: string;

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
      this.resetVpsButton();
    }
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
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

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(this.trackingDeactivated ? null : productClickEvent)
        .then(this.setTrackingDeactivated);
    }

    const product = imageSearchState.results.find(
      (r) => r.productId === detail.productId
    );
    if (!product || !product.deeplink) return;
    window.location.href = product.deeplink;
  }

  @Listen("vviinnImageCrop")
  trachSearchAreaChanges() {
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
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createFilterEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      kind: "category",
      action: detail.action,
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
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

    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.id = this.el.id;
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

    this.trackInitialSearch();
  }

  private trackInitialSearch() {
    if (this.trackingDeactivated) return;

    const searchEvent: WidgetEvent = createSearchEvent({
      session_id: this.uiSessionId,
      source: this.imageSource,
      search_area: "full",
    });
    this.trackingApi.trackEvent(searchEvent).then(this.setTrackingDeactivated);
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
                  onVviinnImageUpload={() => {
                    this.active = true;
                    this.vviinnWidgetOpen.emit(this.getBasicEventData());
                    this.handleImageSelection("upload");
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
                      <span>Kamera oder Bild auswählen</span>
                    </slot>
                  </span>
                </vviinn-image-selector>
                <vviinn-privacy-badge class={{ hidden: this.haveErrors() }} />
              </div>
              <div id="onboarding-block" class="start-page_block">
                <div class="onboarding-wrapper">
                  <vviinn-onboarding />
                  <vviinn-example-images
                    part="example-images"
                    onVviinnImageUpload={() =>
                      this.handleImageSelection("example")
                    }
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
                  {imageSearchState.results.map((p, i) => (
                    <vviinn-product-card
                      key={p.productId}
                      hidden={true}
                      productTitle={p.title}
                      productId={p.productId}
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
                    />
                  ))}
                </div>
              </div>
            </vviinn-slide>
          </vviinn-slider>
        </vviinn-overlayed-modal>
      </Host>
    );
  }
}
