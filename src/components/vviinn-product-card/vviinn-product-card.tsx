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
  parseBasePrice,
  renderCustomLabels,
  ContentCardContent,
  UniversalImage,
} from "./render-helpers";
import {
  CrossSellingClickEvent,
  CrossSellingClickEventData,
  ProductCardEventData,
} from "../../recommendation/events";

import styles from "./vviinn-product-card.css";
import { CampaignTypeId, campaignTypeNames } from "../../campaign/Campaign";
import { slotChangeListener } from "../customized-slots";
import {
  BasketIcon,
  CheckCircleIcon,
  UpdateIcon,
  FavoriteIcon,
  FavoriteIconPressed,
} from "../vviinn-icons";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
import { generateRandomNumber } from "../../utils/number";
import {
  BasePrice,
  EnergyCertification,
  Recommendation,
} from "../../interfaces";
import { resources } from "../../locale";
import { contentCardParts, productCardParts } from "../../cssParts";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import {
  PRODUCT_CARD_IMAGE_RESOLUTION_WIDTH,
  PRODUCT_CARD_IMAGE_WIDTH,
} from "../../widget/constants";
import { addEventListenersWithSignal } from "../../dom";

/**
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part brand - Product brand.
 * @part product-type - Product type.
 * @part currency - Currency sign. Renders after price-amount.
 * @part deeplink - Anchor element for title. Rendered only if "deeplink" property is filled.
 * @part image - Product image.
 * @part image-link - Anchor element for image. Rendered only if "deeplink" property filled.
 * @part image-picture - Picture element for image.
 * @part image-placeholder - Placeholder shown when no image is available.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-base-sale - Numeric part of the base price.
 * @part price-amount-base-outdated - Numeric part of the base price.
 * @part price-amount-base-regular - Numeric part of the base price.
 * @part price-outdated - Renders when "sale-price" property filled. Contains regular price.
 * @part price-regular - Renders when "sale-price" property is empty.
 * @part price-sale - Renders when "sale-price" property filled. Contains sale price.
 * @part price-prefix - Renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part title - Product title
 * @part basket-button - Add to Basket button.
 * @part update-button-item - Update button in Product Card (Set mode).
 * @part discount-label - Discount label in Product Card (Set mode).
 * @part discount-percentage - Discount percentage inside the Add to Basket button (Set mode).
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 * @part product-card-actions - Style actions wrapper.
 * @part product-card-actions-top - Style top actions wrapper.
 *
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button (Set mode).
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button (Set mode).
 * @slot vviinn-energy-label-data-sheet-text - Data sheet link's text.
 * @slot vviinn-product-card-actions - Add action buttons like One-click discovery to this slot.
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-image-placeholder-icon - Icon or content for the image placeholder.
 *
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
  @Prop() locale: string | undefined = undefined;
  @Prop() pricePrefix?: string;
  @Prop() image: string | undefined;
  @Prop() imageRatio: number = 1;
  @Prop() imageWidth: number = PRODUCT_CARD_IMAGE_WIDTH;
  @Prop() price: number | undefined;
  @Prop() basePrice?: BasePrice | string | null;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() entityType: Recommendation["entityType"] = "product";
  @Prop() setMode: boolean = false;
  @Prop() salePrice: number | undefined;
  @Prop() baseSalePrice: BasePrice | string | null;
  @Prop() responsive: boolean = false;
  @Prop() addToBasketShow: boolean;
  @Prop() favoriteShow: boolean;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() customLabels: string = "";
  @Prop() addPriceContainer?: boolean = false;
  @Prop({ mutable: true }) energyCertifications?: EnergyCertification[];
  @Prop() deeplink: string | undefined;

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
  /** @internal */
  @Prop() energyCertificationsString: string = "";
  /** @internal */
  @Prop() isStandalone: boolean = false;
  /** @internal */
  @Prop() showFooterArrow: boolean = false;
  /** @internal */
  @Prop({ mutable: true }) imageResolutionWidth: number =
    PRODUCT_CARD_IMAGE_RESOLUTION_WIDTH;
  /** @internal */
  @Prop() loading: boolean = false;

  @State() isTransitioning: boolean = false;
  @State() basketButonPressed: boolean = false;
  @State() favoriteButonPressed: boolean = false;
  @State() imageLoaded: boolean = false;

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
  /** User clicks on Favorite button */
  @Event({ bubbles: true })
  vviinnAddToFavorite: EventEmitter<ProductCardEventData>;

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
  private linkEventAbortController?: AbortController;
  private imageProps: ImageProps;
  private isContentCard: boolean;

  private isShowUpdateButton = () =>
    this.setMode &&
    !this.isSourceProduct &&
    !this.basketButonPressed &&
    this.updateButtonLocation !== "onTop";

  private isShowBasketButton = () =>
    !this.isSourceProduct && (this.addToBasketShow || this.setMode);

  connectedCallback() {
    this.productData = this.getProductData();
    this.isContentCard = this.entityType === "content";
    this.imageProps = this.getImageProps();

    this.isStandalone &&
      i18next.init({
        lng: this.locale,
        fallbackLng: "en",
        resources,
      });

    if (this.energyCertificationsString.length > 0) {
      this.parseEnergyCertificationsString();
    }
  }

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  componentDidLoad() {
    this.vviinnProductLoad.emit(this.productData);
    this.addLinksEventListeners();

    if (!this.imageElement) return;
    this.intersectionObserver = new IntersectionObserver(
      this.intersectionCallback.bind(this.imageElement),
      { threshold: 0.95 },
    );
    this.intersectionObserver.observe(this.imageElement);
  }

  @Listen("vviinnCrossSellingClick")
  crossSellingClickListener({ detail }: CrossSellingClickEvent) {
    const { animationInterval } = detail;
    this.isTransitioning = true;
    this.resetButtonStates();
    this.startAnimationTimer(animationInterval);
  }

  @Watch("updatingAllCards")
  updatingAllCardsWatcher() {
    if (!this.updatingAllCards) return;
    this.vviinnUpdatingAllCardsStarted.emit();
    this.isTransitioning = true;
    this.resetButtonStates();
    this.startAnimationTimer(this.defaultAnimationInterval, () => {
      this.vviinnUpdatingAllCardsFinished.emit();
    });
  }

  @Watch("productId")
  productIdWatcher() {
    this.productData = this.getProductData();
  }

  @Watch("loading")
  loadingWatcher(newVal: boolean) {
    if (newVal) {
      this.imageLoaded = false;
    }
  }

  private parseEnergyCertificationsString() {
    if (this.energyCertificationsString === "") return;

    try {
      this.energyCertifications = JSON.parse(
        this.energyCertificationsString,
      ) as EnergyCertification[];
    } catch (e) {
      console.error("Invalid filters string", e);
    }
  }

  private getProductData(): ProductCardEventData {
    return {
      productId: this.productId,
      productRank: this.index,
      productName: this.productTitle,
      productType: this.productType,
      campaignTypeId: this.campaignTypeId,
      campaignTypeName: campaignTypeNames[this.campaignTypeId],
      widgetVersion: this.widgetVersion,
      ...addIfNotEmpty(
        "widgetId",
        this.buttonElementId ?? this.widgetElementId,
      ),
    };
  }

  private intersectionCallback = (data: IntersectionObserverEntry[]) => {
    if (!data.length) return;
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct())),
      );
      this.vviinnProductView.emit(this.productData);
      this.intersectionObserver.disconnect();
    }
  };

  private basketButtonClickHandler() {
    this.vviinnAddToBasket.emit({
      ...this.productData,
      discount: this.currentDiscountPercentage,
    });
    this.basketButonPressed = true;
  }

  private favoriteButtonClickHandler() {
    this.vviinnAddToFavorite.emit({
      ...this.productData,
    });
    this.favoriteButonPressed = !this.favoriteButonPressed;
  }

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
        (analytics) => analytics.sendClick(this.getProduct()),
      ),
    );
  }

  private addLinksEventListeners() {
    this.linkEventAbortController = new AbortController();
    const { signal } = this.linkEventAbortController;
    const links = this.el.shadowRoot.querySelectorAll("a");

    links.forEach((link) => {
      const clickHandler = this.productClickHandler.bind(this);
      const auxClickHandler = () => {
        this.vviinnAuxClick.emit({
          ...this.productData,
        });
      };
      addEventListenersWithSignal(
        link,
        [
          ["click", clickHandler],
          ["auxclick", auxClickHandler],
        ],
        signal,
      );
    });
  }

  disconnectedCallback() {
    this.linkEventAbortController?.abort();
    this.intersectionObserver?.disconnect();
  }

  private getProduct(): Recommendation {
    return searchState.results.find((r) => r.productId === this.productId);
  }

  private getImageProps() {
    return {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      src: this.image,
      imageResolutionWidth: this.isContentCard
        ? this.imageResolutionWidth * 2
        : this.imageResolutionWidth,
      title: this.productTitle,
      ref: (el: HTMLImageElement) => {
        this.imageElement = el;
      },
      isSource: this.isSourceProduct,
      onLoadEnd: () => {
        this.imageLoaded = true;
      },
    };
  }

  private resetButtonStates() {
    this.basketButonPressed = false;
    this.favoriteButonPressed = false;
  }

  private startAnimationTimer(interval: number, callback?: () => void) {
    const timer = setTimeout(() => {
      callback?.();
      this.isTransitioning = false;
      clearTimeout(timer);
    }, interval);
  }

  private shouldShowSkeleton(): boolean {
    return this.loading || this.isTransitioning;
  }

  private renderImageWithLoadedState(
    imageProps: ImageProps,
    isResponsive: boolean,
    isFullHeight: boolean = false,
  ) {
    const additionalClasses = this.imageLoaded ? ["loaded"] : [];
    return UniversalImage({
      ...imageProps,
      isResponsive,
      isFullHeight,
      additionalClasses,
    });
  }

  render() {
    if (this.isContentCard) {
      return (
        <Host
          part="product-card content-card"
          class="content-card"
          exportparts={contentCardParts}
        >
          <div
            class="image-container content-card-image-container"
            part="image-container"
          >
            <Linked
              deeplink={this.deeplink}
              part="image-link content-image-link"
            >
              {this.renderImageWithLoadedState(
                this.imageProps,
                this.responsive,
                true,
              )}
            </Linked>
          </div>
          {ContentCardContent(
            this.productTitle,
            this.deeplink,
            i18next.t("contentLabel"),
          )}
        </Host>
      );
    }

    return (
      <Host
        part="product-card"
        class={{
          animated: this.isTransitioning,
          loading: this.loading,
        }}
        exportparts={productCardParts}
      >
        <div class="content-container" part="content-container">
          {this.shouldShowSkeleton() ? (
            <Fragment>
              <vviinn-skeleton height={40} />
              <vviinn-skeleton height={20} halfWidth={true} />
              <vviinn-skeleton height={40} />
            </Fragment>
          ) : (
            <Fragment>
              <Linked deeplink={this.deeplink} part="deeplink" tabindex={0}>
                <span class="title" part="title">
                  {this.productTitle}
                </span>
              </Linked>

              {this.brand?.length > 0 && (
                <span class="brand" part="brand">
                  {this.brand}
                </span>
              )}

              {this.productType?.length > 0 && (
                <span class="product-type" part="product-type">
                  {this.productType}
                </span>
              )}

              {(this?.energyCertifications ?? []).map((energyCertification) => (
                <vviinn-energy-label
                  classIconUrls={energyCertification?.classIconUrls}
                  classDataSheetUrl={energyCertification?.classDataSheetUrl}
                  productType={energyCertification?.productType}
                  certificationClass={energyCertification?.certificationClass}
                  classRange={energyCertification?.classRange}
                ></vviinn-energy-label>
              ))}

              <Price
                prefix={this.pricePrefix}
                currency={this.currency}
                locale={this.locale}
                price={this.price}
                basePrice={parseBasePrice(this.basePrice)}
                salePrice={this.salePrice}
                baseSalePrice={parseBasePrice(this.baseSalePrice)}
                showInContainer={this.addPriceContainer}
              />

              {renderCustomLabels(this.customLabels.split(","))}
            </Fragment>
          )}
        </div>

        <div
          class={{
            "basket-button-container": true,
            hidden: !this.isShowBasketButton() || this.shouldShowSkeleton(),
          }}
          part="basket-button-container"
        >
          <button
            class={{
              "basket-button": true,
              hidden: this.shouldShowSkeleton(),
              pressed: this.basketButonPressed,
            }}
            part="basket-button"
            onClick={this.basketButtonClickHandler.bind(this)}
          >
            <div
              class={{
                "basket-button-content": true,
                hidden: this.basketButonPressed,
              }}
              key="not-pressed"
            >
              <span class="basket-button-icon-container">
                <slot name="vviinn-basket-button-icon">
                  <BasketIcon />
                </slot>
              </span>
              <span>
                {this.setMode ? (
                  <slot name="vviinn-basket-button-text" key="button-text-set">
                    {i18next.t("setMode.basketButtonText")}
                  </slot>
                ) : (
                  <slot
                    name="vviinn-basket-button-text"
                    key="button-text-default"
                  >
                    {i18next.t("basketButtonText")}
                  </slot>
                )}
              </span>
            </div>

            <div
              key="pressed"
              class={{
                "basket-button-content": true,
                hidden: !this.basketButonPressed,
              }}
            >
              <span class="basket-button-icon-container">
                <slot name="vviinn-basket-button-icon-pressed">
                  <CheckCircleIcon />
                </slot>
              </span>
              <span>
                <span
                  class="discount-percentage"
                  part="discount-percentage"
                  hidden={!(this.setMode && this.appliedDiscountPercentage)}
                >
                  {this.appliedDiscountPercentage}%
                </span>

                <slot name="vviinn-basket-button-text-pressed">
                  {this.setMode
                    ? i18next.t("setMode.basketButtonPressedText")
                    : i18next.t("basketButtonPressedText")}
                </slot>
              </span>
            </div>
          </button>
        </div>

        <div class="image-container" part="image-container">
          {this.shouldShowSkeleton() ? (
            <div
              class="image-skeleton"
              style={{
                "aspect-ratio": this.imageRatio.toString(),
                width: "100%",
              }}
            >
              <vviinn-skeleton />
            </div>
          ) : (
            <Linked deeplink={this.deeplink} part="image-link">
              {this.renderImageWithLoadedState(
                this.imageProps,
                this.responsive,
              )}
            </Linked>
          )}
          {this.setMode &&
            !this.appliedDiscountPercentage &&
            this.currentDiscountPercentage && (
              <div
                class="discount-label"
                part="discount-label"
              >{`-${this.currentDiscountPercentage}%`}</div>
            )}
          <div class="product-card-actions-top" part="product-card-actions-top">
            <button
              class={{
                hidden: !this.favoriteShow || this.isSourceProduct,
              }}
              part="favorite-button"
              onClick={this.favoriteButtonClickHandler.bind(this)}
              aria-label={
                this.favoriteButonPressed
                  ? i18next.t("a11y.removeFromFavorites")
                  : i18next.t("a11y.addToFavorites")
              }
            >
              <div
                key="favorite-not-pressed"
                class={{
                  hidden: this.favoriteButonPressed,
                }}
              >
                <slot name="vviinn-favorite-icon">
                  <FavoriteIcon width={14} height={14} />
                </slot>
              </div>
              <div
                key="favorite-pressed"
                class={{
                  hidden: !this.favoriteButonPressed,
                }}
              >
                <slot name="vviinn-favorite-icon-pressed">
                  <FavoriteIconPressed width={14} height={14} />
                </slot>
              </div>
            </button>

            <button
              class={{
                "update-button": true,
                hidden: !this.isShowUpdateButton(),
              }}
              part="update-button-item"
              onClick={() => {
                this.vviinnCrossSellingClick.emit({
                  animationInterval: generateRandomNumber(800, 1400),
                  productData: this.productData,
                });
              }}
              aria-label={i18next.t("a11y.findSimilarProducts")}
            >
              <div>
                <slot name="vviinn-update-button-icon">
                  <UpdateIcon width={14} height={14} />
                </slot>
              </div>
            </button>
          </div>
          <div class="product-card-actions" part="product-card-actions">
            <slot name="vviinn-product-card-actions"></slot>
          </div>
        </div>

        {this.showFooterArrow && <div class="footer-arrow"></div>}
      </Host>
    );
  }
}
