import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { h } from "@stencil/core";
import { Sized } from "../../geometry/Sized";

type ImageProps = {
  readonly url: string;
  readonly title: string;
};

export type ImageData = ImageProps & Sized;

export type LinkData = {
  href: string,
  part: string,
  class: string
};

const FIT_EXPR = /fit\/\d+\//;

export const containsFit = (url: string): E.Either<string, string> => {
  return pipe(
    url.match(FIT_EXPR),
    E.fromNullable(url),
    E.map(() => url)
  );
};

export const processWidth = (url: string, size: number): string => {
  return pipe(
    containsFit(url),
    E.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)),
    E.getOrElse(() => url)
  );
};

export const createImage = (data: ImageData) => (
  <img
    part="image"
    class="image"
    width={data.width}
    height={data?.height}
    src={processWidth(data.url, data.width)}
    alt={data.title}
  />
);

export const wrapInLink = (linkData: LinkData, el: HTMLElement) => (
  <a href={linkData.href}
    part={linkData.part}
    class={linkData.class}
  >
    {el}
  </a>
);
