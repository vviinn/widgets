import { Interfaces } from '../../../interfaces/recommendation';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply'
import { FunctionalComponent, h } from '@stencil/core';

const sequenceTEither = sequenceT(E.either);

export const Image = (data: Interfaces['VisualProductSearch'], wi: number, he: number): FunctionalComponent<Interfaces['VisualProductSearch']> =>
  pipe(
    O.fromNullable(data.image.thumbnail),
    O.fold(
      () => (<img width={wi} height={he} src={data.image.original} alt={data.title} />),
      (thumbnail) => (<img width={wi} height={he} src={thumbnail} alt={data.title} />)
    )
  );

const checkEmpryString = (x: string): O.Option<string> =>
  x.length > 0 ? O.some(x) : O.none;

export const Title = (data: Interfaces['VisualProductSearch']): FunctionalComponent<Interfaces['VisualProductSearch']> =>
  pipe(
    O.fromNullable(data.deeplink),
    O.chain(checkEmpryString),
    O.fold(
      () => (<span part="product-title" class="product title">{data.title}</span>),
      (url) => (<a part="product-title" class="product title" href={url}>{data.title}</a>)
    )
  );

const Prefix = (x: string) => pipe(
  O.fromNullable(x),
  O.fold(
    () => null,
    (prefix) => <span part="price-prefix" class="price prefix">{prefix}</span>
  )
);

const Currency = (x: string) => pipe(
  O.fromNullable(x),
  O.fold(
    () => null,
    (cur) => <span part="price-currency" class="price currency">{cur}</span>
  )
);

const PriceComponent = (price: number, prefix: string, currency: string) => pipe(
  O.fromNullable(price),
  O.fold(
    () => null,
    () => <span part="price-regular" class="price regular">
        {Prefix(prefix)}
        <span part="price-amount" class="price amount">{ price }</span>
        {Currency(currency)}
    </span>
  )
);

const bothPricesPresented = (x: Interfaces['VisualProductSearch']['price']): E.Either<number, [number, number]> => sequenceTEither(
  E.fromNullable(x.actual)(x.retail),
  E.fromNullable(x.retail)(x.actual)
);

const pricesAreDifferent = (x: [number, number]): E.Either<number, [number, number]> =>
  x[0] === x[1]
  ? E.left(x[0])
  : E.right(x);

const isSalePrice = (x: [number, number]): E.Either<number, [number, number]> =>
  x[0] < x[1]
       ? E.left(x[1])
       : E.right(x);

export const Price = (data: Interfaces['VisualProductSearch'], prefix: string = null, currency: string = null): FunctionalComponent<Interfaces['VisualProductSearch']['price']> =>
  pipe(
    E.fromNullable(null)(data.price),
    E.chain(bothPricesPresented),
    E.chain(pricesAreDifferent),
    E.chain(isSalePrice),
    E.fold(
      (singlePrice) => PriceComponent(singlePrice, prefix, currency),
      (prices) => <div class="sale-container">
          <span part="price-outdated" class="price outdated">
              { PriceComponent(prices[0], prefix, currency) }
          </span>
          <span part="price-discount" class="price discount">
              { PriceComponent(prices[1], prefix, currency) }
          </span>
      </div>
    )
  );
