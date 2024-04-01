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

import { state } from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";
import { Recommendation } from "../../recommendation/recommendation";
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
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-vidget";

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
 * @part update-button-item - Update button for Set mode.
 *
 * @slot vviinn-basket-button-text - Title of Add to Basket button.
 * @slot vviinn-update-icon-item - Icon of update button for Set mode.
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
  @Prop() deeplink: string | undefined;
  @Prop() image: string | undefined;
  @Prop() imageRatio: number = 1;
  @Prop() imageWidth: number = 200;
  @Prop() locale: string | undefined = undefined;
  @Prop() price: number | undefined;
  @Prop() pricePrefix: string | undefined = undefined;
  @Prop() productId: string;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() salePrice: number | undefined;
  @Prop() responsive: boolean = false;
  @Prop() dimmedBackground: boolean = false;
  @Prop() mode?: CarouselMode;
  @Prop() addToBasketShow: boolean;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() appliedDiscountPercentage?: number;

  /** @internal */
  @Prop() campaignTypeId: CampaignTypeId;
  /** @internal */
  @Prop() widgetElementId?: string;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() index: number = 0;
  /** @internal */
  @Prop() updatingAllCards: boolean;
  /** @internal */
  @Prop() defaultAnimationInterval: number;

  @State() imageLoaded: boolean = false;
  @State() isTransitioning: boolean = false;

  /** Event fires ones when recommendation rendered on page */
  @Event({ bubbles: true })
  vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Event fires ones when recommendation appears on the viewport */
  @Event({ bubbles: true })
  vviinnProductView: EventEmitter<ProductCardEventData>;
  /** Event fires ones when user click on deeplink */
  @Event({ bubbles: true })
  vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** Event fires when user click on Add to Basket button */
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
  vviinnUpdatingAllCardsFinished: EventEmitter;

  private productData: ProductCardEventData | null = null;
  private imageElement?: HTMLImageElement;
  private intersectionObserver;
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

  @Listen("vviinnCrossSellingClick")
  crossSellingClickListener({ detail }: CrossSellingClickEvent) {
    const { animationInterval } = detail;
    this.isTransitioning = true;

    const animationTimer = setTimeout(() => {
      this.isTransitioning = false;
      clearTimeout(animationTimer);
    }, animationInterval);
  }

  @Watch("updatingAllCards")
  updatingAllCardsWatcher() {
    if (!this.updatingAllCards) return;
    this.isTransitioning = true;

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
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct()))
      );
      this.vviinnProductView.emit(this.productData);
      this.intersectionObserver.disconnect();
    }
  };

  componentDidLoad() {
    this.vviinnProductLoad.emit(this.productData);

    this.intersectionObserver = new IntersectionObserver(
      this.intersectionCallback.bind(this.imageElement),
      { threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.imageElement);

    const links = this.el.shadowRoot.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
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
      });

      link.addEventListener("auxclick", () => {
        this.vviinnAuxClick.emit({
          ...this.productData,
        });
      });
    });
  }

  private getProduct(): Recommendation {
    return imageSearchState.results.find((r) => r.productId === this.productId);
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
    };

    return this.responsive ? ResponsiveImage(props) : Image(props);
  }

  private generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {
    return (
      <Host
        part="product-card"
        class={{
          dimmed: this.dimmedBackground,
          animated: this.isTransitioning,
          "set-mode": this.isSetMode,
        }}
        exportparts="brand, currency, deeplink, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, title, basket-button, update-button-item"
      >
        <Linked deeplink={this.deeplink} part="image-link">
          {this.renderImage()}
        </Linked>

        {this.isTransitioning ? (
          <Fragment>
            <vviinn-skeleton height={20}></vviinn-skeleton>
            <vviinn-skeleton height={20} halfWidth={true}></vviinn-skeleton>
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
            <span class="type" part="type">
              {this.productType}
            </span>
            <Price
              prefix={this.pricePrefix ?? state.pricePrefix}
              currency={this.currency ?? state.currencySign}
              price={this.price}
              salePrice={this.salePrice}
              locale={this.locale ?? state.locale}
            />
          </Fragment>
        )}

        {(this.addToBasketShow || this.isSetMode) && (
          <div class="basket-button-container">
            {this.isTransitioning ? (
              <vviinn-skeleton height={40}></vviinn-skeleton>
            ) : (
              <button
                class={{
                  "basket-button": true,
                  "basket-button-grid": this.isGridMode || this.isSetMode,
                  "basket-button-continuity ": this.isContinuityMode,
                  "applied-discount": !!this.appliedDiscountPercentage,
                }}
                part="basket-button"
                onClick={() => {
                  this.vviinnAddToBasket.emit(this.productData);
                }}
              >
                {this.isSetMode ? (
                  <Fragment>
                    {this.appliedDiscountPercentage ? (
                      <CheckCircleIcon />
                    ) : (
                      <BasketIcon />
                    )}
                    <slot name="vviinn-basket-button-text">
                      <span>
                        {this.appliedDiscountPercentage
                          ? `${this.appliedDiscountPercentage}% saved`
                          : i18next.t("setBasketButtonText")}
                      </span>
                    </slot>
                  </Fragment>
                ) : (
                  <slot name="vviinn-basket-button-text">
                    <span>{i18next.t("basketButtonText")}</span>
                  </slot>
                )}
              </button>
            )}
          </div>
        )}
        {this.isSetMode && !this.appliedDiscountPercentage && (
          <button
            class={{
              "update-button": true,
              hidden: this.updateButtonLocation === "onTop",
            }}
            part="update-button-item"
            onClick={() => {
              this.vviinnCrossSellingClick.emit({
                animationInterval: this.generateRandomNumber(800, 1400),
                productData: this.productData,
              });
            }}
          >
            <slot name="vviinn-update-icon-item">
              <UpdateIcon />
            </slot>
          </button>
        )}
      </Host>
    );
  }
}
