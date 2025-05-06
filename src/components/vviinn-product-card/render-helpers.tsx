import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { FunctionalComponent, h } from "@stencil/core";
import { BasePrice } from "../../interfaces/recommendation";
import { Fragment } from "@stencil/core";
import { ImagePlaceholderIcon, PlusIcon } from "../vviinn-icons";

const FIT_EXPR = /fit\/\d+\//;

const containsFit = (url: string): E.Either<string, string> => {
  return pipe(
    url.match(FIT_EXPR),
    E.fromNullable(url),
    E.map(() => url),
  );
};

const processWidth = (url: string, size: number): string => {
  if (!url?.length) return "";
  return pipe(
    containsFit(url),
    E.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)),
    E.getOrElse(() => url),
  );
};

export const Linked = (props, child) =>
  props.deeplink ? (
    <a class={props.part} part={props.part} href={props.deeplink}>
      {child}
    </a>
  ) : (
    child
  );

const getFormattedPrice = (price: number, locale: string) =>
  price
    ? new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : null;

type PriceType = "sale" | "outdated" | "regular";

type PriceElementProps = {
  readonly locale: string;
  readonly price: number;
  readonly prefix: string;
  readonly currency: string;
  readonly priceType?: PriceType;
};

type BasePriceElementProps = {
  readonly locale: string;
  readonly currency: string;
  readonly basePrice?: BasePrice | null;
  readonly priceType?: PriceType;
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const priceType = props.priceType;
  const formattedPrice = getFormattedPrice(props.price, props.locale);

  const prefixElement = props.prefix ? (
    <span part="price-prefix">{props.prefix + " "}</span>
  ) : null;

  const currencyElement = props.currency ? (
    <span part="currency" class="currency">
      {props.currency}
    </span>
  ) : null;

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
  locale,
}) => {
  if (!basePrice?.price) return null;
  const formattedPrice = getFormattedPrice(basePrice.price, locale);

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

type PriceProps = PriceElementProps & {
  basePrice: BasePrice;
  salePrice: number;
  baseSalePrice: BasePrice;
  showInContainer?: boolean;
};

export const renderCustomLabels = (labels: string[]) => {
  const renderLabel = (label: string, index: number) =>
    label ? (
      <span part={`custom-label-${index}`} class="custom-label">
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
  const renderPrice = () =>
    props.salePrice ? (
      [
        <span class="price-outdated" part="price-outdated">
          <FormattedPrice
            prefix={props.prefix}
            currency={props.currency}
            price={props.price}
            locale={props.locale}
            priceType="outdated"
          />
          <FormattedBasePrice
            currency={props.currency}
            basePrice={props.basePrice}
            locale={props.locale}
            priceType="outdated"
          />
        </span>,

        <span class="price-sale" part="price-sale">
          <FormattedPrice
            prefix={props.prefix}
            currency={props.currency}
            price={props.salePrice}
            locale={props.locale}
            priceType="sale"
          />
          <FormattedBasePrice
            currency={props.currency}
            basePrice={props.baseSalePrice}
            locale={props.locale}
            priceType="sale"
          />
        </span>,
      ]
    ) : (
      <span class="price-regular" part="price-regular">
        <FormattedPrice
          prefix={props.prefix}
          currency={props.currency}
          price={props.price}
          locale={props.locale}
          priceType="regular"
        />

        <FormattedBasePrice
          currency={props.currency}
          basePrice={props.basePrice}
          locale={props.locale}
          priceType="regular"
        />
      </span>
    );

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
  height: number;
  title: string;
  src: string;
  ref: (el: HTMLImageElement) => void;
  isSource?: boolean;
};

function getDimensionValues(value?: number | string) {
  return {
    num: typeof value === "number" ? value : undefined,
    px:
      value !== undefined
        ? typeof value === "number"
          ? `${value}px`
          : value
        : undefined,
  };
}

const ImageOrPlaceholder: FunctionalComponent<{
  src: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  title?: string;
  className?: string;
  ref?: (el: Element) => void;
  onLoad?: () => void;
}> = (props) => {
  const hasImage = !!props.src;

  const { num: widthNum, px: widthPx } = getDimensionValues(props.width);
  const { num: heightNum, px: heightPx } = getDimensionValues(props.height);

  return hasImage ? (
    <img
      src={props.src}
      width={widthNum}
      height={heightNum}
      alt={props.alt}
      title={props.title}
      class={props.className}
      ref={props.ref}
      onLoad={props.onLoad}
      loading="lazy"
      part="image"
    />
  ) : (
    <div
      style={{
        width: widthPx,
        height: heightPx,
      }}
      class="image-placeholder"
      part="image-placeholder"
      ref={props.ref}
    >
      <ImagePlaceholderIcon />
    </div>
  );
};

export const Image = (props: ImageProps, onLoadEnd = () => undefined) => (
  <picture part="image-picture">
    <ImageOrPlaceholder
      src={processWidth(props.src, props.width)}
      width={props.width}
      height={props.height}
      alt={props.title}
      title={props.title}
      className="image"
      ref={props.ref}
      onLoad={onLoadEnd}
    />
    {props.isSource && <PlusIcon />}
  </picture>
);

export const ResponsiveImage = (
  props: ImageProps,
  onLoadEnd = () => undefined,
) => (
  <picture part="image-picture">
    <ImageOrPlaceholder
      src={processWidth(props.src, props.width)}
      alt={props.title}
      title={props.title}
      className="image responsive"
      ref={props.ref}
      onLoad={onLoadEnd}
    />
  </picture>
);
