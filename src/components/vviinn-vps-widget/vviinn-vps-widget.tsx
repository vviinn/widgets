import { Component, Host, h, State, Prop, Element, Watch } from "@stencil/core";
import state from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";
import * as O from "fp-ts/lib/Option";

/**
 * @prop --color-primary: color used for action button, slider bullets and selected detected object;
 *
 * @part close-button - close button on modal header.
 * @part secondary-action - back button on modal header.
 * @part title - modal window title.
 *
 * @part select-image_button
 *
 * @part product-card_brand - product card brand.
 * @part product-card_currency - currency sign. Renders after price-amount inside product card.
 * @part product-card_deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part product-card_image - product image inside product card.
 * @part product-card_image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part product-card_price-amount - numeric part of price inside product card.
 * @part product-card_price-container - block contains all prices inside product card.
 * @part product-card_price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part product-card_price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part product-card_price-regular - renders inside price-container when "sale-price" property is empty.
 * @part product-card_price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part product-card_title - product title
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
  @Prop() apiPath: string | undefined;
  /** When true modal window with widget will be shown */
  @Prop({ mutable: true }) active: boolean = false;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";

  @State() slidePosition: number = 0;
  @State() width: number = 0;
  @State() wrongImageFormat: boolean = false;

  private body: HTMLVviinnSliderElement;
  private overflow: string;

  @Watch("active")
  activeWatcher(value: boolean) {
    if (value) {
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = this.overflow;
    }
  }

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
    imageSearchState.token = this.token;
  }

  componentDidLoad() {
    const observer = new ResizeObserver((sizes: ResizeObserverEntry[]) => {
      if (sizes.length === 0) return;
      const entry = sizes[0];
      this.width = entry.contentRect.width;
    });

    observer.observe(this.body);
  }

  private handleImageSelection() {
    this.slidePosition = 1;
    const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
    const overlay = root.shadowRoot.querySelector("vviinn-overlay");
    const modal = overlay.querySelector("vviinn-modal");
    const modalBody = modal.shadowRoot.querySelector(".body");
    modalBody.scrollTop = 0;
  }

  private resetState() {
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
  }

  private haveErrors(): boolean {
    return this.wrongImageFormat || imageSearchState.serverError;
  }

  private resetScroll() {
    const block = this.el.shadowRoot.getElementById("onboarding-block");
    block.scrollTop = 0;
  }

  render() {
    return (
      <Host>
        <vviinn-overlayed-modal
          class={{ "first-screen": this.slidePosition === 0 }}
          active={this.active}
          onSecondaryActionClicked={() => this.resetState()}
          onModalClosed={() => (this.active = false)}
          exportparts="secondary-action, title, close-button"
        >
          <vviinn-slider
            showBullets={false}
            position={this.slidePosition}
            ref={(el) => (this.body = el)}
          >
            <vviinn-slide class={{ "start-page": true }}>
              <div
                class={{
                  error: this.haveErrors(),
                  "start-page_block": true,
                }}
              >
                <vviinn-wrong-format
                  class={{ hidden: !this.wrongImageFormat }}
                  onActionClick={() => (this.wrongImageFormat = false)}
                />
                <vviinn-server-error
                  class={{ hidden: !imageSearchState.serverError }}
                  onActionClick={() => (imageSearchState.serverError = false)}
                />
                <vviinn-teaser class={{ hidden: this.haveErrors() }} />
                <vviinn-image-selector
                  class={{ hidden: this.haveErrors() }}
                  onImageSelected={() => this.handleImageSelection()}
                  onImageSelectedError={() => (this.wrongImageFormat = true)}
                  part="select-image_button"
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
                    <span>Kamera oder Bild auswählen</span>
                  </span>
                </vviinn-image-selector>
                <vviinn-privacy-badge class={{ hidden: this.haveErrors() }} />
              </div>
              <div id="onboarding-block" class="start-page_block">
                <div class="onboarding-wrapper">
                  <vviinn-onboarding />
                  <vviinn-example-images
                    onImageSelected={() => this.handleImageSelection()}
                    onImageSelectedError={() => this.resetScroll()}
                  />
                </div>
              </div>
            </vviinn-slide>
            <vviinn-slide
              class={{ "results-page": true, active: this.slidePosition == 1 }}
            >
              <div class="image-wrapper">
                <vviinn-image-view />
                <div class="filters-wrapper">
                  <div class="filters">
                    {imageSearchState.filters.map((filter) => (
                      <search-filters filter={filter} />
                    ))}
                  </div>
                </div>
              </div>
              <div class="products-wrapper">
                <vviinn-empty-results
                  class={{ hidden: imageSearchState.results.length > 0 }}
                />
                <div
                  class={{
                    hidden: imageSearchState.results.length <= 0,
                    products: true,
                  }}
                >
                  {imageSearchState.results.map((p) => (
                    <vviinn-product-card
                      productTitle={p.title}
                      productId={p.productId}
                      brand={p.brand}
                      deeplink={p.deeplink}
                      price={p.price.actual}
                      salePrice={p.price.sale}
                      imageWidth={160}
                      image={p.image.thumbnail ?? p.image.original}
                      exportparts="brand : product-card_brand, currency : product-card_currency, deeplink : product-card_deeplink, image : product-card_image, image-link : product-card_image-link, price-amount : product-card_price-amount, price-container : product-card_price-container, price-outdated : product-card_price-outdated, price-prefix : product-card_price-prefix, price-regular : product-card_price-regular, price-sale : product-card_price-sale, title: product-card_title"
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
