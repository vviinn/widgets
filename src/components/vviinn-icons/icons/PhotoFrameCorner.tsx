import { h } from "@stencil/core";

type PhotoFrameCornerProps = {
  className: string;
};

export const PhotoFrameCorner = ({ className }): PhotoFrameCornerProps => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
  >
    <path
      d="M31 3H15C8.37258 3 3 8.37258 3 15V31"
      stroke="white"
      stroke-width="6"
      stroke-linecap="square"
    />
  </svg>
);
