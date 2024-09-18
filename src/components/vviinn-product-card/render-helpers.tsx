import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { FunctionalComponent, h } from "@stencil/core";
import { PlusIcon } from "../vviinn-icons";
import { Recommendation } from "../../interfaces/recommendation";
import { Fragment } from "@stencil/core";

const FIT_EXPR = /fit\/\d+\//;

export const containsFit = (url: string): E.Either<string, string> => {
  return pipe(
    url.match(FIT_EXPR),
    E.fromNullable(url),
    E.map(() => url)
  );
};

export const processWidth = (url: string, size: number): string => {
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

type PriceElementProps = {
  readonly locale: string;
  readonly price: number;
  readonly prefix: string;
  readonly currency: string;
  readonly priceType?: "sale" | "outdated" | "regular";
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const locale = props.locale;
  const priceType = props.priceType;

  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(props.price);

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

type PriceProps = PriceElementProps & {
  salePrice: number;
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
      {props.priceLabel && (
        <span part="price-label" class="price-label">
          {props.priceLabel}
        </span>
      )}

      {props.salePrice ? (
        [
          <span class="price-sale" part="price-sale">
            <FormattedPrice
              prefix={props.prefix}
              currency={props.currency}
              price={props.salePrice}
              locale={props.locale}
              priceType="sale"
            />
          </span>,
          <span class="price-outdated" part="price-outdated">
            <FormattedPrice
              prefix={props.prefix}
              currency={props.currency}
              price={props.price}
              locale={props.locale}
              priceType="outdated"
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
