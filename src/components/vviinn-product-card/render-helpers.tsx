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
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const locale = props.locale;
  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(props.price);

  const fullPrice = `${props.prefix ?? ""} ${formattedPrice} ${props.currency}`;

  return (
    <span class="price-amount" part="price-amount">
      {fullPrice}
    </span>
  );
};

type PriceProps = PriceElementProps & {
  salePrice: number;
};

export const Price: FunctionalComponent<PriceProps> = (props) => {
  const priceEl = (
    <FormattedPrice
      prefix={props.prefix}
      currency={props.currency}
      price={props.price}
      locale={props.locale}
    />
  );

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
            />
          </span>,
          <span class="price-outdated" part="price-outdated">
            {priceEl}
          </span>,
        ]
      ) : (
        <span class="price-regular" part="price-regular">
          {priceEl}
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
};

export const Image = (props: ImageProps) => (
  <picture>
    <img
      loading="lazy"
      part="image"
      class="image"
      width={props.width}
      height={props.height}
      src={processWidth(props.src, props.width)}
      alt={props.title}
    />
  </picture>
);

export const ResponsiveImage = (props: ImageProps) => (
  <picture>
    <img
      loading="lazy"
      part="image"
      class="image responsive"
      src={processWidth(props.src, props.width)}
      alt={props.title}
    />
  </picture>
);
