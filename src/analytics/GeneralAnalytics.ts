import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, map, getFirstMonoid, Option } from "fp-ts/lib/Option";
import { GtagAnalytics } from "./GtagAnalytics";
import { GAnalytics } from "./GAnalytics";
import { ProductAnalytics } from "./ProductAnalytics";

const getGtagAnalytics = pipe(
  fromNullable(window.gtag),
  map(() => new GtagAnalytics())
);

const getCommonAnalytics = pipe(
  fromNullable(window.ga),
  map(() => new GAnalytics())
);

const analyticsMonoid = getFirstMonoid<ProductAnalytics>();

export const getAnalyticsModule = (): Option<ProductAnalytics> =>
  analyticsMonoid.concat(getGtagAnalytics, getCommonAnalytics);
