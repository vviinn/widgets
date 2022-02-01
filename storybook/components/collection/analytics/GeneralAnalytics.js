import { pipe } from "fp-ts/lib/function";
import { fromNullable, map, getMonoid } from "fp-ts/lib/Option";
import { GtagAnalytics } from "./GtagAnalytics";
import { GAnalytics } from "./GAnalytics";
import { first } from "fp-ts/lib/Semigroup";
const getGtagAnalytics = () => pipe(fromNullable(window.gtag), map(() => new GtagAnalytics()));
const getCommonAnalytics = () => pipe(fromNullable(window.ga), map(() => new GAnalytics()));
const analyticsMonoid = getMonoid(first());
export const getAnalyticsModule = analyticsMonoid.concat(getGtagAnalytics(), getCommonAnalytics());
