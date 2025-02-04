import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { h } from "@stencil/core";
import { sequenceToOption } from "../utils/option/option";

export const renderImage = (
  image: O.Option<HTMLImageElement>
): HTMLImageElement | null => {
  return pipe(
    sequenceToOption(image),
    O.map(([imageElement]) => {
      const image = (
        <img
          width="28"
          height="28"
          src={imageElement.src}
          class="title-image"
        />
      );
      return image;
    }),
    O.getOrElse(() => null)
  );
};
