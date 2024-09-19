import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { FunctionalComponent, h } from "@stencil/core";
import { PlusIcon } from "../vviinn-icons";
import { BasePrice, Recommendation } from "../../interfaces/recommendation";
import { Fragment } from "@stencil/core";

const FIT_EXPR = /fit\/\d+\//;

const containsFit = (url: string): E.Either<string, string> => {
  return pipe(
    url.match(FIT_EXPR),
    E.fromNullable(url),
    E.map(() => url)
  );
};

const processWidth = (url: string, size: number): string => {
  return pipe(
    containsFit(url),
    E.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)),
    E.getOrElse(() => url)
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
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(price);

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
  readonly basePrice: BasePrice | null;
  readonly priceType?: PriceType;
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const priceType = props.priceType;
  const formattedPrice = getFormattedPrice(props.price, props.locale);

  const prefixElement = props.prefix ? (
    <span part="price-prefix">{props.prefix + " "}</span>
  ) : null;

  const currencyElement = props.currency ? (
    <span part="currency">&nbsp;{props.currency}</span>
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
      {currency.length > 0 && <span part="currency">&nbsp;{currency}</span>}/
      {basePrice.quantity > 1 && basePrice.quantity}
      {basePrice.measure}
    </span>
  );
};

type PriceProps = PriceElementProps & {
  basePrice: BasePrice;
  salePrice: number;
  baseSalePrice: BasePrice;
  priceLabel: string;
};

export const calculatePriceLabel = ({
  custom_label_0,
  custom_label_1,
  custom_label_2,
  custom_label_3,
  custom_label_4,
}: Recommendation) => {
  const renderLabel = (label: string, index: number) => {
    if (!label) return "";

    const partClass = `price-label-${index}`;

    return (
      <span part={partClass} class={partClass}>
        {label}
      </span>
    );
  };

  return (
    <Fragment>
      {renderLabel(custom_label_0, 0)}
      {renderLabel(custom_label_1, 1)}
      {renderLabel(custom_label_2, 2)}
      {renderLabel(custom_label_3, 3)}
      {renderLabel(custom_label_4, 4)}
    </Fragment>
  );
};

export const Price: FunctionalComponent<PriceProps> = (props) => {
  return (
    <span class="price-container" part="price-container">
      {props.salePrice ? (
        [
          <span class="price-outdated-container">
            {props.priceLabel && (
              <span part="price-label" class="price-label">
                {props.priceLabel}
              </span>
            )}
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
            </span>
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
      )}
    </span>
  );
};

export type ImageProps = {
  width: number;
  height: number;
  title: string;
  src: string;
  lazy: boolean;
  ref: (el: HTMLImageElement) => void;
  isSource?: boolean;
};

export const Image = (props: ImageProps, onLoadEnd = () => undefined) => (
  <picture>
    <img
      loading={props.lazy ? "lazy" : "eager"}
      part="image"
      class="image"
      width={props.width}
      height={props.height}
      src={processWidth(props.src, props.width)}
      alt={props.title}
      ref={props.ref}
      onLoad={onLoadEnd}
    />
    {props.isSource && <PlusIcon />}
  </picture>
);

export const ResponsiveImage = (
  props: ImageProps,
  onLoadEnd = () => undefined
) => (
  <picture>
    <img
      loading={props.lazy ? "lazy" : "eager"}
      part="image"
      class="image responsive"
      src={processWidth(props.src, props.width)}
      alt={props.title}
      ref={props.ref}
      onLoad={onLoadEnd}
    />
  </picture>
);
