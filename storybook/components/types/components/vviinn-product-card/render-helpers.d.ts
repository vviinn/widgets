import * as E from "fp-ts/lib/Either";
import { FunctionalComponent } from "../../stencil-public-runtime";
export declare const containsFit: (url: string) => E.Either<string, string>;
export declare const processWidth: (url: string, size: number) => string;
export declare const Linked: (props: any, child: any) => any;
declare type PriceElementProps = {
  readonly locale: string;
  readonly price: number;
  readonly prefix: string;
  readonly currency: string;
};
declare type PriceProps = PriceElementProps & {
  salePrice: number;
};
export declare const Price: FunctionalComponent<PriceProps>;
export declare type ImageProps = {
  width: number;
  height: number;
  title: string;
  src: string;
};
export declare const Image: (props: ImageProps) => any;
export declare const ResponsiveImage: (props: ImageProps) => any;
export {};
