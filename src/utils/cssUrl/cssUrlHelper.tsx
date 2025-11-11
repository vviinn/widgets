import { h, JSX } from "@stencil/core";

export const renderExternalCSS = (
  cssUrl: string | null | undefined,
): JSX.Element | null =>
  cssUrl?.length ? <link href={cssUrl} rel="stylesheet" /> : null;
