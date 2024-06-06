import { h } from "@stencil/core";

type PhotoFrameCornerProps = {
  className: string;
};

export const PhotoFrameCorner = ({ className }): PhotoFrameCornerProps => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
  >
    <path
      d="M29 1H17C8.16344 1 1 8.16344 1 17V29"
      stroke="white"
      stroke-width="2"
      stroke-linecap="square"
    />
  </svg>
);
