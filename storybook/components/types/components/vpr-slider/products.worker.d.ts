import { Recommendation } from "../../recommendation/recommendation";
export declare const rebuildProducts: (products: Recommendation[], slideSize: number, margin: number, itemWidth: number) => Promise<Recommendation[][]>;
export declare const rewrapProducts: (products: Recommendation[], columns: number) => Promise<Recommendation[][]>;
