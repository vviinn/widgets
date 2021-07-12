import { Recommendation } from "../../../recommendation/recommendation";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { FunctionalComponent, h } from "@stencil/core";
import { Sized } from "../../../geometry/Sized";
import { ImageSizes } from "./vpr-result";

type ImageProps = {
  readonly url: string;
  readonly srcSet: string | null;
  readonly title: string;
};

export type ImageData = ImageProps & Sized;

const sequenceTEither = sequenceT(E.Apply);
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

export const processSrcSet = (
  url: string,
  sizes: ImageSizes | undefined
): string | null => {
  if (sizes === undefined) return null;

  return pipe(
    containsFit(url),
    E.map((url) =>
      Object.entries(sizes).reduce((acc, value) => {
        const [rule, size] = value;
        const src = `${url.replace(FIT_EXPR, `fit/${size}/`)} ${rule}`;
        return acc.length > 0 ? `${acc}, ${src}` : src;
      }, "")
    ),
    E.getOrElse(() => null)
  );
};

export const createImage = (data: ImageData) => (
  <img
    part="product-image"
    width={data?.width}
    height={data?.height}
    src={data.url}
    srcset={data.srcSet}
    alt={data.title}
  />
);

export const wrapInLink = (href: string, el: HTMLImageElement) => (
  <a href={href} part="product-image-link">
    {el}
  </a>
);

export const Image = (
  r: Recommendation,
  width: number,
  height: number,
  imageSizes: ImageSizes | undefined
): FunctionalComponent<Recommendation> => {
  const url = processWidth(imageUrlFromRecommendation(r), width);
  const srcSet = processSrcSet(imageUrlFromRecommendation(r), imageSizes);
  const image = createImage({ url, width, height, title: r.title, srcSet });

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
  x[0] > x[1] ? E.left(x[1]) : E.right(x);

export const getPrice = (
  data: Recommendation["price"]
): E.Either<number, [number, number]> =>
  pipe(
    bothPricesPresented(data),
    E.chain(pricesAreDifferent),
    E.chain(isSalePrice)
  );

export const getPriceComponent = (
  data: Recommendation["price"],
  prefix: string = null,
  currency: string = null
): FunctionalComponent<Recommendation["price"]> =>
  pipe(
    getPrice(data),
    E.fold(
      (singlePrice) => (
        <span class="price-container" part="price-container">
          <span part="price-regular" class="price regular">
            {PriceComponent(singlePrice, prefix, currency)}
          </span>
        </span>
      ),
      (prices) => (
        <span class="price-container" part="price-container">
          <span part="price-outdated" class="price outdated">
            {PriceComponent(prices[1], prefix, currency)}
          </span>
          <span part="price-discount" class="price discount">
            {PriceComponent(prices[0], prefix, currency)}
          </span>
        </span>
      )
    )
  );
