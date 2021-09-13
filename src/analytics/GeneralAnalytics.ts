import { pipe } from "fp-ts/lib/function";
import { fromNullable, map, getMonoid, Option } from "fp-ts/lib/Option";
import { GtagAnalytics } from "./GtagAnalytics";
import { GAnalytics } from "./GAnalytics";
import { ProductAnalytics } from "./ProductAnalytics";
import { first } from "fp-ts/lib/Semigroup";
import { Monoid } from "fp-ts/lib/Monoid";

const getGtagAnalytics = () =>
  pipe(
    fromNullable(window.gtag),
    map(() => new GtagAnalytics())
  );

const getCommonAnalytics = () =>
  pipe(
    fromNullable(window.ga),
    map(() => new GAnalytics())
  );

const analyticsMonoid: Monoid<Option<ProductAnalytics>> = getMonoid(first());

export const getAnalyticsModule: Option<ProductAnalytics> = analyticsMonoid.concat(
  getGtagAnalytics(),
  getCommonAnalytics()
);
