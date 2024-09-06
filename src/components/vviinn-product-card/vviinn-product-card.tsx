import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  State,
  Watch,
  Fragment,
  Listen,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { getAnalyticsModule } from "../../analytics/GeneralAnalytics";
import * as O from "fp-ts/lib/Option";
import i18next from "i18next";

import { searchState } from "../../store/search.store";
import {
  ImageProps,
  Linked,
  Price,
  ResponsiveImage,
  Image,
} from "./render-helpers";
import {
  CrossSellingClickEvent,
  CrossSellingClickEventData,
  ProductCardEventData,
} from "../../recommendation/events";

import styles from "./vviinn-product-card.css";
import {
  CampaignTypeId,
  WidgetType,
  campaignTypeNames,
} from "../../campaign/Campaign";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { slotChangeListener } from "../customized-slots";
import { BasketIcon, CheckCircleIcon, UpdateIcon } from "../vviinn-icons";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
import { generateRandomNumber } from "../../utils/number";
import {
  EnergyCertification,
  Recommendation,
} from "../../interfaces/recommendation";

/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property is filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount-sale - numeric part of price.
 * @part price-amount-outdated - numeric part of price.
 * @part price-amount-regular - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part title - Product title
 * @part basket-button - Add to Basket button.
 * @part update-button-item - Update button in Product Card (Set mode).
 * @part discount-label - Discount label in Product Card (Set mode).
 * @part discount-percentage - Discount percentage inside the Add to Basket button (Set mode).
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 *
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button (Set mode).
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button (Set mode).
 * @slot energy-label-data-sheet-text - Data sheet link's text.
 */
@Component({
  tag: "vviinn-product-card",
  shadow: true,
  styles,
})
export class VviinnProductCard {
  @Element() el: HTMLElement;
  @Prop() brand: string | undefined;
  @Prop() currency: string | undefined = undefined;
  @Prop() image: string | undefined;
  @Prop() imageRatio: number = 1;
  @Prop() imageWidth: number = 200;
  @Prop() locale: string | undefined = undefined;
  @Prop() price: number | undefined;
  @Prop() pricePrefix: string | undefined = undefined;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() salePrice: number | undefined;
  @Prop() responsive: boolean = false;
  @Prop() mode?: CarouselMode;
  @Prop() basketButtonShow: boolean;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() priceLabel: string;
  @Prop() energyCertifications?: EnergyCertification[];

  /** @internal */
  @Prop() productId: string;
  /** @internal */
  @Prop() campaignTypeId: CampaignTypeId;
  /** @internal */
  @Prop() widgetElementId?: string;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() deeplink: string | undefined;
  /** @internal */
  @Prop() index: number = 0;
  /** @internal */
  @Prop() updatingAllCards: boolean;
  /** @internal */
  @Prop() defaultAnimationInterval: number;
  /** @internal */
  @Prop() appliedDiscountPercentage?: number;
  /** @internal */
  @Prop() currentDiscountPercentage?: number;
  /** @internal */
  @Prop() isSourceProduct: boolean = false;
  /** @internal */
  @Prop() isResultsWidget: boolean = false;

  @State() isTransitioning: boolean = false;
  @State() basketButonPressed: boolean = false;

  /** Event emitted once when the recommendation is rendered on the page */
  @Event({ bubbles: true })
  vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Event emitted once when the recommendation appears in the viewport */
  @Event({ bubbles: true })
  vviinnProductView: EventEmitter<ProductCardEventData>;
  /** Event emitted ones when user click on deeplink */
  @Event({ bubbles: true })
  vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** User clicks on Add to Basket button */
  @Event({ bubbles: true })
  vviinnAddToBasket: EventEmitter<ProductCardEventData>;

  /** @internal */
  @Event({ bubbles: true })
  vviinnAuxClick: EventEmitter<ProductCardEventData>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnCrossSellingClick: EventEmitter<CrossSellingClickEventData>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnUpdatingAllCardsStarted: EventEmitter;
  /** @internal */
  @Event({ bubbles: true })
  vviinnUpdatingAllCardsFinished: EventEmitter;

  private productData: ProductCardEventData | null = null;
  private imageElement?: HTMLImageElement;
  private intersectionObserver: IntersectionObserver;
  private isSetMode: boolean;
  private isGridMode: boolean;
  private isContinuityMode: boolean;

  connectedCallback() {
    this.productData = this.getProductData();
    this.isSetMode = this.mode === "set";
    this.isGridMode = this.mode === "grid";
    this.isContinuityMode = this.mode === "continuity";
  }

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  componentDidLoad() {
    this.vviinnProductLoad.emit(this.productData);

    this.intersectionObserver = new IntersectionObserver(
      this.intersectionCallback.bind(this.imageElement),
      { threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.imageElement);

    this.addLinksEventListeners();
  }

  @Listen("vviinnCrossSellingClick")
  crossSellingClickListener({ detail }: CrossSellingClickEvent) {
    const { animationInterval } = detail;
    this.isTransitioning = true;
    this.basketButonPressed = false;

    const animationTimer = setTimeout(() => {
      this.isTransitioning = false;
      clearTimeout(animationTimer);
    }, animationInterval);
  }

  @Watch("updatingAllCards")
  updatingAllCardsWatcher() {
    if (!this.updatingAllCards) return;
    this.vviinnUpdatingAllCardsStarted.emit();
    this.isTransitioning = true;
    this.basketButonPressed = false;

    const animationTimer = setTimeout(() => {
      this.vviinnUpdatingAllCardsFinished.emit();

      this.isTransitioning = false;
      clearTimeout(animationTimer);
    }, this.defaultAnimationInterval);
  }

  @Watch("productId")
  productIdWatcher() {
    this.productData = this.getProductData();
  }

  private getWidgetType() {
    return this.campaignTypeId === "VPR" || this.campaignTypeId === "VCS"
      ? ("VPR" as WidgetType)
      : ("VPS" as WidgetType);
  }

  private getProductData(): ProductCardEventData {
    return {
      productId: this.productId,
      productRank: this.index,
      productName: this.productTitle,
      productType: this.productType,
      widgetType: this.getWidgetType(),
      campaignTypeId: this.campaignTypeId,
      campaignTypeName: campaignTypeNames[this.campaignTypeId],
      widgetId: this.buttonElementId ?? this.widgetElementId,
      widgetVersion: this.widgetVersion,
    };
  }

  private intersectionCallback = (data: IntersectionObserverEntry[]) => {
    if (!data.length) return;
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct()))
      );
      this.vviinnProductView.emit(this.productData);
      this.intersectionObserver.disconnect();
    }
  };

  private productClickHandler(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.vviinnProductClick.emit({
      ...this.productData,
      clickEvent: event,
    });

    pipe(
      getAnalyticsModule,
      O.match(
        () => null,
        (analytics) => analytics.sendClick(this.getProduct())
      )
    );
  }

  private addLinksEventListeners() {
    const links = this.el.shadowRoot.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("click", this.productClickHandler.bind(this));

      link.addEventListener("auxclick", () => {
        this.vviinnAuxClick.emit({
          ...this.productData,
        });
      });
    });
  }

  private getProduct(): Recommendation {
    return searchState.results.find((r) => r.productId === this.productId);
  }

  private renderImage() {
    const props: ImageProps = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      src: this.image,
      title: this.productTitle,
      lazy: false,
      ref: (el) => {
        this.imageElement = el as HTMLImageElement;
      },
      isSource: this.isSourceProduct,
    };
    return this.responsive ? ResponsiveImage(props) : Image(props);
  }

  render() {
    return (
      <Host
        part="product-card"
        class={{
          animated: this.isTransitioning,
          "set-mode": this.isSetMode,
          "grid-mode": this.isGridMode,
          "continuity-mode": this.isContinuityMode,
          "results-widget": this.isResultsWidget,
        }}
        exportparts="brand,price-label, currency, deeplink, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, discount-label, discount-percentage, title, basket-button, update-button-item, energy-label-container, energy-label-icon, energy-label-product-type, energy-label-data-sheet-link"
      >
        <Linked deeplink={this.deeplink} part="image-link">
          {this.renderImage()}
        </Linked>

        {this.isTransitioning ? (
          <Fragment>
            <vviinn-skeleton height={40} />
            <vviinn-skeleton height={20} halfWidth={true} />
          </Fragment>
        ) : (
          <Fragment>
            <Linked deeplink={this.deeplink} part="deeplink">
              <span class="title" part="title">
                {this.productTitle}
              </span>
            </Linked>
            <span class="brand" part="brand">
              {this.brand}
            </span>

<<<<<<< HEAD
            {this.energyCertifications?.length > 0 &&
              this.energyCertifications.map((energyCertification) => (
                <vviinn-energy-label
                  energyCertification={energyCertification}
                  productClickHandler={this.productClickHandler.bind(this)}
                ></vviinn-energy-label>
              ))}
=======
            {(this?.energyCertifications ?? []).map((energyCertification) => (
              <vviinn-energy-label
                classLabelUrl={energyCertification?.classLabelUrl}
                classIconUrls={energyCertification?.classIconUrls}
                classDataSheetUrl={energyCertification?.classDataSheetUrl}
                productType={energyCertification?.productType}
                productClickHandler={this.productClickHandler.bind(this)}
              ></vviinn-energy-label>
            ))}
>>>>>>> bugfix/37048-fix-energy-label-slot

            <Price
              prefix={this.pricePrefix}
              currency={this.currency}
              price={this.price}
              salePrice={this.salePrice}
              locale={this.locale}
              priceLabel={this.priceLabel}
            />

            {this.isSetMode &&
              !this.appliedDiscountPercentage &&
              this.currentDiscountPercentage && (
                <div
                  class="discount-label"
                  part="discount-label"
                >{`-${this.currentDiscountPercentage}%`}</div>
              )}
          </Fragment>
        )}

        {(this.basketButtonShow || this.isSetMode) && (
          <Fragment>
            {this.isTransitioning && <vviinn-skeleton height={40} />}
            <div class="basket-button-wrapper">
              <button
                class={{
                  "basket-button": true,
                  "basket-button--hidden": this.isTransitioning,
                  "basket-button-grid": this.isGridMode || this.isSetMode,
                  "basket-button-continuity ": this.isContinuityMode,
                  pressed: this.basketButonPressed,
                }}
                part="basket-button"
                onClick={() => {
                  this.vviinnAddToBasket.emit({
                    ...this.productData,
                    discount: this.currentDiscountPercentage,
                  });
                  this.basketButonPressed = true;
                }}
              >
                {this.isSetMode ? (
                  <Fragment>
                    {!this.basketButonPressed && (
                      <div class="basket-button-content" key="set-not-pressed">
                        <span class="basket-button-icon-container">
                          <slot name="vviinn-basket-button-icon">
                            <BasketIcon />
                          </slot>
                        </span>
                        <span>
                          <slot name="vviinn-basket-button-text">
                            {i18next.t("setMode.basketButtonText")}
                          </slot>
                        </span>
                      </div>
                    )}

                    {this.basketButonPressed && (
                      <div key="set-pressed" class="basket-button-content">
                        <span class="basket-button-icon-container">
                          <slot name="vviinn-basket-button-icon-pressed">
                            <CheckCircleIcon />
                          </slot>
                        </span>
                        <span>
                          {this.appliedDiscountPercentage && (
                            <span
                              class="discount-percentage"
                              part="discount-percentage"
                            >
                              {this.appliedDiscountPercentage}%
                            </span>
                          )}
                          <slot name="vviinn-basket-button-text-pressed">
                            {i18next.t("setMode.appliedDiscountText")}
                          </slot>
                        </span>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <div key="not-pressed" class="basket-button-content">
                    <span class="basket-button-icon-container">
                      <slot name="vviinn-basket-button-icon">
                        <BasketIcon />
                      </slot>
                    </span>
                    <span>
                      <slot name="vviinn-basket-button-text">
                        {i18next.t("basketButtonText")}
                      </slot>
                    </span>
                  </div>
                )}
              </button>
            </div>
          </Fragment>
        )}

        {this.isSetMode && !this.basketButonPressed && (
          <button
            class={{
              "update-button": true,
              hidden: this.updateButtonLocation === "onTop",
            }}
            part="update-button-item"
            onClick={() => {
              this.vviinnCrossSellingClick.emit({
                animationInterval: generateRandomNumber(800, 1400),
                productData: this.productData,
              });
            }}
          >
            <slot name="vviinn-update-button-icon">
              <UpdateIcon />
            </slot>
          </button>
        )}
      </Host>
    );
  }
}
