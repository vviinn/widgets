import { h } from "@stencil/core";

export const WarningIcon = () => (
  <svg
    slot="icon"
    class="icon"
    width="32"
    height="32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 26a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
      fill="#525252"
    />
    <path
      d="M17 8h-2v11h2V8Zm-1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
      fill="#525252"
    />
  </svg>
);
