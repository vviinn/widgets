import { FunctionalComponent, h, Fragment, JSX } from "@stencil/core";
import { BasePrice, EntityType, ProductImage } from "../../interfaces";
import { getLastUrlPath } from "../../helpers/url/getLastUrlPath";
import { isSafeLink } from "../../helpers/url/isSafeLink";
import { configureSwiperElement } from "../../utils/swiper/swiperUtils";
import { register } from "swiper/element";
import { isMobile } from "../../helpers/device/checkDeviceType";
import { getImagesForSwiper } from "./helpers";

if (typeof window !== "undefined") {
  register();
}

type LinkedProps = {
  deeplink: string;
  tabindex?: number;
  part?: string;
};

export const Linked = (props: LinkedProps, child: JSX.Element) =>
  isSafeLink(props.deeplink) ? (
    <a
      class={props.part}
      part={props.part}
      href={props.deeplink}
      tabindex={props.tabindex}
    >
      {child}
    </a>
  ) : (
    child
  );

const getFormattedPrice = (price: number, numberLocale: string) =>
  price
    ? new Intl.NumberFormat(numberLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : null;

type PriceType = "sale" | "outdated" | "regular";

type PriceElementProps = {
  readonly numberLocale: string;
  readonly price: number;
  readonly prefix: string;
  readonly currency: string;
  readonly priceType?: PriceType;
};

type BasePriceElementProps = {
  readonly numberLocale: string;
  readonly currency: string;
  readonly basePrice?: BasePrice | null;
  readonly priceType?: PriceType;
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const priceType = props.priceType;
  const formattedPrice = getFormattedPrice(props.price, props.numberLocale);

  const prefixElement = props.prefix ? (
    <span part="price-prefix">{props.prefix + " "}</span>
  ) : null;

  const currencyElement = props.currency ? (
    <span part="currency" class="currency">
      {props.currency}
    </span>
  ) : null;

  if (!formattedPrice) return null;

  return (
    <span
      class="price-amount"
      part={`price-amount${priceType ? "-" + priceType : ""}`}
    >
      {prefixElement}
      {formattedPrice}
      {currencyElement}
    </span>
  );
};

const FormattedBasePrice: FunctionalComponent<BasePriceElementProps> = ({
  currency,
  basePrice,
  priceType,
  numberLocale,
}) => {
  if (!basePrice?.price) return null;
  const formattedPrice = getFormattedPrice(basePrice.price, numberLocale);

  return (
    <span
      class="price-amount price-amount--base"
      part={`price-amount-base${priceType ? "-" + priceType : ""}`}
    >
      {formattedPrice}
      {currency?.length > 0 && (
        <span part="currency" class="currency">
          {currency}
        </span>
      )}
      /{basePrice?.quantity > 1 && basePrice?.quantity}
      {basePrice?.measure}
    </span>
  );
};

export const parseBasePrice = (
  basePrice?: BasePrice | string | null,
): BasePrice | null => {
  if (!basePrice) return null;
  if (typeof basePrice === "string") {
    return JSON.parse(basePrice) as BasePrice;
  }
  return basePrice;
};

type PriceProps = Omit<PriceElementProps, "priceType"> & {
  basePrice: BasePrice;
  salePrice: number;
  baseSalePrice: BasePrice;
  showInContainer?: boolean;
};

export const renderCustomLabels = (
  labels: string[],
  location: "content" | "image",
) => {
  const renderLabel = (label: string, index: number) =>
    label ? (
      <span
        part={`custom-label-${index} custom-label-${location}`}
        class="custom-label"
      >
        <slot name={`vviinn-custom-label-${index}`}>{label}</slot>
      </span>
    ) : null;

  return (
    <Fragment>
      {labels.map((label, index) => renderLabel(label, index))}
    </Fragment>
  );
};

export const Price: FunctionalComponent<PriceProps> = (props) => {
  const hasRegularPrice = props.price || props.basePrice?.price;
  const hasSalePrice = props.salePrice || props.baseSalePrice?.price;

  const priceGroup = (
    priceType: PriceType,
    price: number,
    basePrice: BasePrice,
  ) => (
    <span class={`price-${priceType}`} part={`price-${priceType}`}>
      <FormattedPrice
        prefix={props.prefix}
        currency={props.currency}
        price={price}
        numberLocale={props.numberLocale}
        priceType={priceType}
      />
      <FormattedBasePrice
        currency={props.currency}
        basePrice={basePrice}
        numberLocale={props.numberLocale}
        priceType={priceType}
      />
    </span>
  );

  const renderPrice = () => {
    if (hasSalePrice) {
      return [
        hasRegularPrice && priceGroup("outdated", props.price, props.basePrice),
        priceGroup("sale", props.salePrice, props.baseSalePrice),
      ];
    }

    if (!hasRegularPrice) return null;

    return priceGroup("regular", props.price, props.basePrice);
  };

  return props.showInContainer ? (
    <div class="price-container" part="price-container">
      {renderPrice()}
    </div>
  ) : (
    renderPrice()
  );
};

export type ImageProps = {
  width: number;
  title: string;
  src: string;
  ref: (el: HTMLImageElement) => void;
  isSource?: boolean;
  imageResolutionWidth?: number;
  onLoadEnd?: () => void;
};

export interface UniversalImageProps extends ImageProps {
  isResponsive?: boolean;
  isFullHeight?: boolean;
  additionalClasses?: string[];
  additionalParts?: string[];
  onLoadEnd?: () => void;
}

export interface ProductCardImageProps {
  src: string;
  width: number;
  title: string;
  responsive?: boolean;
  imageResolutionWidth?: number;
  showSkeleton?: boolean;
  isSetMode?: boolean;
  entityType?: EntityType;
  customClass?: string;
  imageRef?: (el: HTMLImageElement) => void;
  onImageLoad?: () => void;
  renderPlaceholderSlot?: boolean;
  images?: ProductImage[];
  showMultipleImages?: boolean;
  disableMobileSwiper?: boolean;
  deeplink?: string;
}

export const renderProductCardImage = (props: ProductCardImageProps) => {
  const {
    src,
    width,
    title,
    responsive = false,
    imageResolutionWidth,
    showSkeleton = false,
    isSetMode = false,
    entityType = "product",
    customClass = "",
    imageRef,
    onImageLoad,
    renderPlaceholderSlot = true,
    images = [],
    showMultipleImages = false,
    disableMobileSwiper = false,
    deeplink,
  } = props;

  if (showMultipleImages && !disableMobileSwiper && isMobile()) {
    const swiperImages = getImagesForSwiper(src, images);
    if (swiperImages.length > 1) {
      return (
        <ImageSwiper
          images={swiperImages}
          productTitle={title}
          imageWidth={width}
          imageResolutionWidth={imageResolutionWidth}
          onImageLoad={onImageLoad}
          responsive={responsive}
          showSkeleton={showSkeleton}
          isSetMode={isSetMode}
          entityType={entityType}
          customClass={customClass}
          imageRef={imageRef}
          deeplink={deeplink}
        />
      );
    }
  }

  const imageElement = (
    <vviinn-image
      src={src}
      width={width}
      alt={title}
      imageTitle={title}
      responsive={responsive}
      entityType={entityType}
      imageResolutionWidth={imageResolutionWidth}
      customClass={customClass}
      imageRef={imageRef}
      onVviinnImageLoad={onImageLoad}
      showSkeleton={showSkeleton}
      isSetMode={isSetMode}
      style={{
        "--image-border": "var(--product-card-image-border, none)",
        "--image-bg-color":
          "var(--product-card-image-bg-color, var(--surface-bg-color-01))",
        "--image-transition-duration":
          "var(--product-card-transition-duration, 0.5s)",
      }}
    >
      {renderPlaceholderSlot && (
        <slot
          name="vviinn-image-placeholder-icon"
          slot="placeholder-icon"
        ></slot>
      )}
    </vviinn-image>
  );

  return (
    <Linked deeplink={deeplink} part="image-link">
      {imageElement}
    </Linked>
  );
};

export const ContentCardContent = (
  contentTitle: string,
  contentLink: string,
  labelText: string,
) => {
  return (
    <div
      class="content-container"
      part="content-container content-card-content-container"
    >
      <div class="content-label" part="content-label">
        {labelText}
      </div>
      {contentTitle && (
        <div class="content-title" part="content-title" title={contentTitle}>
          {contentTitle}
        </div>
      )}
      {isSafeLink(contentLink) && (
        <Linked deeplink={contentLink} part="content-link" tabindex={0}>
          {getLastUrlPath(contentLink)}
        </Linked>
      )}
    </div>
  );
};

export const ListCardContent = (listTitle: string, labelText: string) => {
  return (
    <div
      class="content-container"
      part="list-container list-card-content-container"
    >
      <div class="list-label" part="list-label">
        {labelText}
      </div>
      {listTitle && (
        <div class="list-title" part="list-title" title={listTitle}>
          {listTitle}
        </div>
      )}
    </div>
  );
};

export type ImageSwiperProps = {
  images: ProductImage[];
  productTitle: string;
  imageWidth: number;
  imageResolutionWidth: number;
  onImageLoad?: () => void;
  responsive?: boolean;
  showSkeleton?: boolean;
  isSetMode?: boolean;
  entityType?: import("../../interfaces").EntityType;
  customClass?: string;
  imageRef?: (el: HTMLImageElement) => void;
  deeplink?: string;
};

export const ImageSwiper: FunctionalComponent<ImageSwiperProps> = (props) => {
  const {
    images,
    productTitle,
    imageWidth,
    imageResolutionWidth,
    onImageLoad,
    responsive,
    showSkeleton,
    isSetMode,
    entityType = "product",
    customClass,
    imageRef,
    deeplink,
  } = props;

  const swiperRef = (el: any) => {
    if (el) {
      configureSwiperElement(el, {
        isDesktop: false,
        pagination: images.length > 1,
        slidesPerView: 1,
        spaceBetween: 0,
      });
    }
  };

  return (
    <div class="product-card-swiper-wrapper">
      <swiper-container
        ref={swiperRef}
        class="product-card-swiper"
        pagination={images.length > 1 ? "true" : undefined}
        pagination-clickable={images.length > 1 ? "true" : undefined}
        exportparts="pagination:product-images-pagination, bullet:product-images-pagination-bullet, bullet-active:product-images-pagination-bullet-active"
      >
        {images.map((img, index) => {
          const imgSrc = img.thumbnail ?? img.original;
          return (
            <swiper-slide key={imgSrc}>
              <Linked deeplink={deeplink} part="image-link">
                <vviinn-image
                  src={imgSrc}
                  width={imageWidth}
                  alt={productTitle}
                  imageTitle={productTitle}
                  responsive={responsive}
                  entityType={entityType}
                  imageResolutionWidth={imageResolutionWidth}
                  customClass={customClass}
                  imageRef={index === 0 ? imageRef : undefined}
                  onVviinnImageLoad={index === 0 ? onImageLoad : undefined}
                  showSkeleton={showSkeleton}
                  isSetMode={isSetMode}
                  style={{
                    "--image-border": "var(--product-card-image-border, none)",
                    "--image-bg-color":
                      "var(--product-card-image-bg-color, var(--surface-bg-color-01))",
                    "--image-transition-duration":
                      "var(--product-card-transition-duration, 0.5s)",
                  }}
                />
              </Linked>
            </swiper-slide>
          );
        })}
      </swiper-container>
    </div>
  );
};
