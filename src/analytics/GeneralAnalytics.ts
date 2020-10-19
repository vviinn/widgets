import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, map, getFirstMonoid, fold } from "fp-ts/lib/Option";
import { GtagAnalytics } from "./GtagAnalytics";
import { GAnalytics } from "./GAnalytics";
import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";

const getGtagAnalytics = pipe(
  fromNullable(window.gtag),
  map(() => new GtagAnalytics())
);

const getCommonAnalytics = pipe(
  fromNullable(window.ga),
  map(() => new GAnalytics())
);

const getAnalyticsModule = getFirstMonoid<ProductAnalytics>();

export const sendAnalytics = (product: Interfaces['VisualProductSearch']): undefined =>
  pipe(
  getAnalyticsModule.concat(getGtagAnalytics, getCommonAnalytics),
  fold(
    () => undefined,
    (analyticsModule: ProductAnalytics) => analyticsModule.send(product)
  )
);
