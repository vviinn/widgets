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
import {
  setupIntersectionObserver,
  type IntersectionObserverConfig,
} from "../../dom";

import {
  ImageProps,
  Linked,
  Price,
  parseBasePrice,
  renderCustomLabels,
  ContentCardContent,
  ListCardContent,
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
  PlusIcon,
} from "../vviinn-icons";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
import { generateRandomNumber } from "../../utils/number";
import {
  BasePrice,
  EnergyCertification,
  EntityType,
  Recommendation,
} from "../../interfaces";
import { resources } from "../../locale";
import {
  contentCardParts,
  listCardParts,
  productCardParts,
} from "../../cssParts";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import {
  PRODUCT_CARD_IMAGE_RESOLUTION_WIDTH,
  PRODUCT_CARD_IMAGE_WIDTH,
} from "../../widget/constants";
import { addEventListenersWithSignal } from "../../dom";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";

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
 * @part list-card - List card container.
 * @part list-card-content-container - List card's content container.
 * @part list-label - List card's label (e.g., "Category").
 * @part list-title - List card's title.
 * @part list-card-image-container - List card's image container.
 * @part list-card-image-link - Anchor element for list card image.
 *
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button (Set mode).
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button (Set mode).
 * @slot vviinn-energy-label-data-sheet-text - Data sheet link's text.
 * @slot vviinn-product-card-actions - Add action buttons like One-Click Discovery to this slot.
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
  @Prop() entityType: EntityType = "product";
  @Prop() isSetMode: boolean = false;
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
  /** Optional for custom CSS. It will overwrite all other settings */
  @Prop() cssUrl: string | null = null;

  /** @internal */
  @Prop() productId: string;
  /** @internal */
  @Prop() product?: Recommendation;
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
  @Prop({ mutable: true }) loading: boolean = false;

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
  private visibilityTrackedElement?: HTMLImageElement | null;
  private intersectionObserver: IntersectionObserver;
  private linkEventAbortController?: AbortController;
  private imageProps: ImageProps;
  private isContentCard: boolean = false;
  private isListCard: boolean = false;

  private isShowUpdateButton = () =>
    this.isSetMode &&
    !this.isSourceProduct &&
    !this.basketButonPressed &&
    this.updateButtonLocation !== "onTop";

  private isShowBasketButton = () =>
    !this.isSourceProduct && (this.addToBasketShow || this.isSetMode);

  private showSkeleton = () =>
    this.isSetMode ? this.isTransitioning : this.loading;

  connectedCallback() {
    this.productData = this.getProductData();
    this.isContentCard = this.entityType === "content";
    this.isListCard = this.entityType === "list";
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
    if (this.showSkeleton()) return;
    this.vviinnProductLoad.emit(this.productData);
    this.addLinksEventListeners();
    this.initializeVisibilityTracking();
  }

  private initializeVisibilityTracking() {
    if (!this.imageElement || this.intersectionObserver || this.showSkeleton())
      return;

    const config: IntersectionObserverConfig = {
      threshold: 0.95,
      onIntersectionChange: (isIntersecting: boolean) => {
        if (isIntersecting) {
          pipe(
            getAnalyticsModule,
            O.map((analytics) => analytics.sendImpression(this.product)),
          );
          this.vviinnProductView.emit(this.productData);
          this.intersectionObserver?.disconnect();
        }
      },
    };

    this.intersectionObserver = setupIntersectionObserver(
      this.imageElement,
      config,
    );
  }

  private cleanupVisibilityTracking() {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    this.visibilityTrackedElement = null;
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
    this.imageProps = this.getImageProps();
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
        (analytics) => analytics.sendClick(this.product),
      ),
    );
  }

  private addLinksEventListeners() {
    if (this.showSkeleton()) return;

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
    this.cleanupVisibilityTracking();
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
        if (el && this.visibilityTrackedElement !== el) {
          this.cleanupVisibilityTracking();
          this.visibilityTrackedElement = el;
          this.initializeVisibilityTracking();
        } else if (!el) {
          this.cleanupVisibilityTracking();
        }
      },
      isSource: this.isSourceProduct,
      onLoadEnd: () => {
        this.imageLoaded = true;
        this.loading = false;
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

  private renderImageWithLoadedState(
    imageProps: ImageProps,
    isResponsive: boolean,
    entityType: EntityType = "product",
  ) {
    return (
      <vviinn-image
        src={imageProps.src}
        width={imageProps.width}
        height={imageProps.height}
        aspectRatio={this.imageRatio}
        alt={imageProps.title}
        imageTitle={imageProps.title}
        responsive={isResponsive}
        entityType={entityType}
        imageResolutionWidth={imageProps.imageResolutionWidth}
        customClass={this.imageLoaded ? "loaded" : ""}
        imageRef={imageProps.ref}
        loadEndCallback={imageProps.onLoadEnd}
        onVviinnImageLoad={imageProps.onLoadEnd}
        showSkeleton={this.showSkeleton()}
        isSetMode={this.isSetMode}
        style={{
          "--image-border": "var(--product-card-image-border, none)",
          "--image-bg-color":
            "var(--product-card-image-bg-color, var(--surface-bg-color-01))",
          "--image-transition-duration":
            "var(--product-card-transition-duration, 0.5s)",
        }}
      >
        <slot
          name="vviinn-image-placeholder-icon"
          slot="placeholder-icon"
        ></slot>
      </vviinn-image>
    );
  }

  render() {
    if (this.isContentCard || this.isListCard) {
      return (
        <Host
          part={`product-card ${this.entityType}-card`}
          class={`${this.entityType}-card`}
          exportparts={this.isContentCard ? contentCardParts : listCardParts}
          data-id={this.productId}
        >
          {renderExternalCSS(this.cssUrl)}
          <div
            class={`image-container ${this.entityType}-card-image-container`}
            part="image-container"
          >
            <Linked
              deeplink={this.deeplink}
              part={`image-link ${this.entityType}-image-link`}
            >
              {this.renderImageWithLoadedState(
                this.imageProps,
                this.responsive,
                this.entityType,
              )}
            </Linked>
          </div>
          {this.isContentCard
            ? ContentCardContent(
                this.productTitle,
                this.deeplink,
                i18next.t("contentLabel"),
              )
            : ListCardContent(this.productTitle, i18next.t("listLabel"))}
          {this.isListCard && this.deeplink && (
            <a
              href={this.deeplink}
              class="list-card-overlay-link"
              aria-label={this.productTitle}
            ></a>
          )}
        </Host>
      );
    }

    return (
      <Host
        part="product-card"
        class={{
          animated: this.isTransitioning,
          "product-card--source": this.isSourceProduct,
          "set-mode": this.isSetMode,
        }}
        exportparts={productCardParts}
        data-id={this.productId}
      >
        {renderExternalCSS(this.cssUrl)}

        <div class="content-container" part="content-container">
          {this.showSkeleton() ? (
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

              {renderCustomLabels(this.customLabels.split(","), "content")}
            </Fragment>
          )}
        </div>

        <div
          class={{
            "basket-button-container": true,
            hidden: !this.isShowBasketButton() || this.showSkeleton(),
          }}
          part="basket-button-container"
        >
          <button
            class={{
              "basket-button": true,
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
                {this.isSetMode ? (
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
                  hidden={!(this.isSetMode && this.appliedDiscountPercentage)}
                >
                  {this.appliedDiscountPercentage}%
                </span>

                <slot name="vviinn-basket-button-text-pressed">
                  {this.isSetMode
                    ? i18next.t("setMode.basketButtonPressedText")
                    : i18next.t("basketButtonPressedText")}
                </slot>
              </span>
            </div>
          </button>
        </div>

        <div class="image-container" part="image-container">
          <Linked deeplink={this.deeplink} part="image-link">
            {this.renderImageWithLoadedState(
              this.imageProps,
              this.responsive,
              this.entityType,
            )}
          </Linked>

          {this.isSourceProduct && <PlusIcon class="plus-icon" />}
          {this.isSetMode &&
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

          {renderCustomLabels(this.customLabels.split(","), "image")}
        </div>

        {this.showFooterArrow && <div class="footer-arrow"></div>}
      </Host>
    );
  }
}
