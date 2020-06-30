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
      () => (<span>{data.title}</span>),
      (url) => (<a href={url}>{data.title}</a>)
    )
  );

const bothPricesPresented = (x: Interfaces['VisualProductSearch']['price']): E.Either<FunctionalComponent<Interfaces['VisualProductSearch']['price']>, [number, number]> => sequenceTEither(
  E.fromNullable(<span class="price">{x.actual}</span>)(x.retail),
  E.fromNullable(<span class="price">{x.retail}</span>)(x.actual)
);

const pricesAreDifferent = (x: [number, number]): E.Either<FunctionalComponent<Interfaces['VisualProductSearch']['price']>, [number, number]> =>
  x[0] === x[1]
  ? E.left(<span class="price">{x[0]}</span>)
  : E.right(x);

const isSalePrice = (x: [number, number]): E.Either<FunctionalComponent<Interfaces['VisualProductSearch']['price']>, [number, number]> =>
  x[0] < x[1]
       ? E.left(<span class="price">{x[1]}</span>)
       : E.right(x);

export const Price = (data: Interfaces['VisualProductSearch']): FunctionalComponent<Interfaces['VisualProductSearch']['price']> =>
  pipe(
    E.fromNullable(null)(data.price),
    E.chain(bothPricesPresented),
    E.chain(pricesAreDifferent),
    E.chain(isSalePrice),
    E.fold(
      (singlePriceComponent) => singlePriceComponent,
      (prices) => <div class="sale-container">
        <span class="price outdated">{prices[0]}</span>
        <span class="price discount">{prices[1]}</span>
      </div>
    )
  );
