import { h } from "@stencil/core";

type PhotoFrameCornerProps = {
  className: string;
};

export const PhotoFrameCorner = ({ className }): PhotoFrameCornerProps => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
  >
    <path
      d="M30 2H18C9.16344 2 2 9.16344 2 18V30"
      stroke="white"
      stroke-width="4"
      stroke-linecap="square"
    />
  </svg>
);
