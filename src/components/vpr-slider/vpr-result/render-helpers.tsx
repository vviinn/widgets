import { Recommendation } from "../../../recommendation/recommendation";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { FunctionalComponent, h } from "@stencil/core";
import { Sized } from "../../../geometry/Sized";

type ImageProps = {
  readonly url: string;
  readonly title: string;
};

type ImageData = ImageProps & Sized;

const sequenceTEither = sequenceT(E.either);
const optionalStringM = O.getFirstMonoid<string>();

const checkEmpryString = (x: string): O.Option<string> =>
  x.length > 0 ? O.some(x) : O.none;

const FIT_EXPR = /fit\/\d+\//;

export const containsFit = (url: string): E.Either<string, string> => {
  return pipe(
    url.match(FIT_EXPR),
    E.fromNullable(url),
    E.map(() => url)
  );
};

const imageUrlFromRecommendation = (r: Recommendation): string =>
  pipe(
    optionalStringM.concat(
      O.fromNullable(r.image.thumbnail),
      O.fromNullable(r.image.original)
    ),
    O.getOrElse(() => "")
  );

export const processWidth = (url: string, size: number): string => {
  return pipe(
    containsFit(url),
    E.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)),
    E.getOrElse(() => url)
  );
};

const createImage = (data: ImageData) => (
  <img
    part="product-image"
    width={data?.width}
    height={data?.height}
    src={data.url}
    alt={data.title}
    loading="lazy"
  />
);

const wrapInLink = (href: string, el: HTMLImageElement) => (
  <a href={href} part="product-image-link">
    {el}
  </a>
);

export const Image = (
  r: Recommendation,
  width: number,
  height: number
): FunctionalComponent<Recommendation> => {
  const url = processWidth(imageUrlFromRecommendation(r), width);
  const image = createImage({ url, width, height, title: r.title });

  return pipe(
    r.deeplink,
    O.fromNullable,
    O.chain(checkEmpryString),
    O.fold(
      () => image,
      (deeplink) => wrapInLink(deeplink, image)
    )
  );
};

export const Title = (
  data: Recommendation
): FunctionalComponent<Recommendation> =>
  pipe(
    O.fromNullable(data.deeplink),
    O.chain(checkEmpryString),
    O.fold(
      () => (
        <span part="product-title" class="product title" title={data.title}>
          {data.title}
        </span>
      ),
      (url) => (
        <a
          part="product-title"
          class="product title"
          title={data.title}
          href={url}
        >
          {data.title}
        </a>
      )
    )
  );

const Prefix = (x: string) =>
  pipe(
    O.fromNullable(x),
    O.fold(
      () => null,
      (prefix) => (
        <span part="price-prefix" class="price prefix">
          {prefix}
        </span>
      )
    )
  );

const Currency = (x: string) =>
  pipe(
    O.fromNullable(x),
    O.fold(
      () => null,
      (cur) => (
        <span part="price-currency" class="price currency">
          {cur}
        </span>
      )
    )
  );

const PriceComponent = (price: number, prefix: string, currency: string) =>
  pipe(
    O.fromNullable(price),
    O.fold(
      () => null,
      () => [
        Prefix(prefix),
        <span part="price-amount" class="price amount">
          {price}
        </span>,
        Currency(currency),
      ]
    )
  );

const bothPricesPresented = (
  x: Recommendation["price"]
): E.Either<number, [number, number]> =>
  sequenceTEither(
    E.fromNullable(x.actual)(x.sale),
    E.fromNullable(x.sale)(x.actual)
  );

const pricesAreDifferent = (
  x: [number, number]
): E.Either<number, [number, number]> =>
  x[0] === x[1] ? E.left(x[0]) : E.right(x);

const isSalePrice = (x: [number, number]): E.Either<number, [number, number]> =>
  x[0] < x[1] ? E.left(x[1]) : E.right(x);

const getPriceComponent = (
  data: Recommendation["price"],
  prefix: string = null,
  currency: string = null
): FunctionalComponent<Recommendation["price"]> =>
  pipe(
    E.right(data),
    E.chain(bothPricesPresented),
    E.chain(pricesAreDifferent),
    E.chain(isSalePrice),
    E.fold(
      (singlePrice) => (
        <span part="price-regular" class="price regular">
          {PriceComponent(singlePrice, prefix, currency)}
        </span>
      ),
      (prices) => [
        <span part="price-outdated" class="price outdated">
          {PriceComponent(prices[0], prefix, currency)}
        </span>,
        <span part="price-discount" class="price discount">
          {PriceComponent(prices[1], prefix, currency)}
        </span>,
      ]
    )
  );

export const Price = (
  data: Recommendation,
  prefix: string = null,
  currency: string = null
): FunctionalComponent<Recommendation["price"]> =>
  pipe(
    O.fromNullable(data.price),
    O.fold(
      () => null,
      (price) => getPriceComponent(price, prefix, currency)
    )
  );

export const Brand = (
  data: Recommendation
): FunctionalComponent<Recommendation["brand"]> =>
  pipe(
    O.fromNullable(data.brand),
    O.fold(
      () => null,
      (brand) => (
        <span part="brand" class="brand">
          {brand}
        </span>
      )
    )
  );

export const ProductType = (
  data: Recommendation
): FunctionalComponent<Recommendation["productType"]> =>
  pipe(
    O.fromNullable(data.productType),
    O.fold(
      () => null,
      (productType) => (
        <span part="product-type" class="product-type">
          {productType}
        </span>
      )
    )
  );
