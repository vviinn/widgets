import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { FunctionalComponent, h } from "@stencil/core";

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

  const prefixElement = (
    <span part="price-prefix">{props.prefix ? `${props.prefix} ` : ""}</span>
  );
  const currencyElement = (
    <span part="currency">{props.currency ? ` ${props.currency}` : ""}</span>
  );

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
};

export const Price: FunctionalComponent<PriceProps> = (props) => {
  return (
    <span class="price-container" part="price-container">
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
      onLoad={onLoadEnd}
    />
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
      onLoad={onLoadEnd}
    />
  </picture>
);
