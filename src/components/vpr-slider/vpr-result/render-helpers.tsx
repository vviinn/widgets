import { Recommendation } from "../../../recommendation/recommendation";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { FunctionalComponent, h } from "@stencil/core";
import { Sized } from "../../../geometry/Sized";

type ImageKind = "thumbnail" | "origin" | "empty";

type ImageProps = {
    readonly kind: ImageKind;
    readonly url: string;
    readonly title: string;
};

type ImageData = ImageProps & Sized;

const imageKindFromRecommendation = (r: Recommendation): ImageKind => {
    const optionalKindM = O.getFirstMonoid<ImageKind>();
    const thumbnail: O.Option<ImageKind> = pipe(
        O.fromNullable(r.image.thumbnail),
        O.map(() => "thumbnail")
    );

    const origin: O.Option<ImageKind> = pipe(
        O.fromNullable(r.image.original),
        O.map(() => "origin")
    );

    return pipe(
        optionalKindM.concat(thumbnail, origin),
        O.getOrElse(() => "empty")
    );
};

const processImage = (r: Recommendation, size: Sized): ImageData => {
    const kind = imageKindFromRecommendation(r);
    // const url = switch (kind) {
    //     case "thumbnail":
    //         return r.image.thumbnail.replace()
    // };
};

const sequenceTEither = sequenceT(E.either);

const checkEmpryString = (x: string): O.Option<string> =>
    x.length > 0 ? O.some(x) : O.none;

const createImage = (data: ImageData) => (
    <img
        part="product-image"
        width={data.width}
        height={data.height}
        src={data.url}
        alt={data.title}
        loading="lazy"
    />
);

export const Image = (
    data: Recommendation,
    wi: number,
    he: number
): FunctionalComponent<Recommendation> =>
    pipe(
        O.fromNullable(data.image.thumbnail),
        O.fold(
            () =>
                pipe(
                    O.fromNullable(data.deeplink),
                    O.chain(checkEmpryString),
                    O.fold(
                        () => (
                            <img
                                part="product-image"
                                width={wi}
                                height={he}
                                src={data.image.original}
                                alt={data.title}
                                loading="lazy"
                            />
                        ),
                        (deeplink) => (
                            <a href={deeplink} part="product-image-link">
                                <img
                                    part="product-image"
                                    width={wi}
                                    height={he}
                                    src={data.image.original}
                                    alt={data.title}
                                    loading="lazy"
                                />
                            </a>
                        )
                    )
                ),
            (thumbnail) =>
                pipe(
                    O.fromNullable(data.deeplink),
                    O.chain(checkEmpryString),
                    O.fold(
                        () => (
                            <img
                                part="product-image"
                                width={wi}
                                height={he}
                                src={thumbnail}
                                alt={data.title}
                                loading="lazy"
                            />
                        ),
                        (deeplink) => (
                            <a href={deeplink} part="product-image-link">
                                <img
                                    part="product-image"
                                    width={wi}
                                    height={he}
                                    src={thumbnail}
                                    alt={data.title}
                                    loading="lazy"
                                />
                            </a>
                        )
                    )
                )
        )
    );

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
