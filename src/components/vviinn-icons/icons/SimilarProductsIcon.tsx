import { h } from "@stencil/core";
import { Icon } from "../types";

export const SimilarProductsIcon = ({ width = 24, height = 24 }: Icon) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2H11C8.79 2 7 3.79 7 6V7H6C3.79 7 2 8.79 2 11V18C2 20.21 3.79 22 6 22H13C14.86 22 16.41 20.72 16.86 19H14.72C14.37 19.59 13.74 20 13 20H6C4.9 20 4 19.1 4 18V11C4 9.9 4.9 9 6 9H7V13C7 15.21 8.79 17 11 17H18C20.21 17 22 15.21 22 13V6C22 3.79 20.21 2 18 2ZM15 15H11C9.9 15 9 14.1 9 13V9H13C14.1 9 15 9.9 15 11V15ZM20 13C20 14.1 19.1 15 18 15H17V11C17 8.79 15.21 7 13 7H9V6C9 4.9 9.9 4 11 4H18C19.1 4 20 4.9 20 6V13Z"
      fill="currentColor"
    />
  </svg>
);
