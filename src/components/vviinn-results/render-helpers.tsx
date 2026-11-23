import { FunctionalComponent, h } from "@stencil/core";
import i18next from "i18next";
import { showMoreButtonTextSlotName } from "../customized-slots";
import { showMoreButtonPart } from "../../cssParts";

type ShowMoreButtonProps = {
  /** Grid order: the button follows the last card. */
  order: number;
  onClick: () => void;
};

export const ShowMoreButton: FunctionalComponent<ShowMoreButtonProps> = ({
  order,
  onClick,
}) => (
  <div class="show-more" style={{ order: order.toString() }}>
    <button type="button" part={showMoreButtonPart} onClick={onClick}>
      <slot name={showMoreButtonTextSlotName}>
        {i18next.t("buttons.showMore")}
      </slot>
    </button>
  </div>
);

type NextPageSkeletonsProps = {
  count: number;
  /** Grid order of the first skeleton. */
  firstOrder: number;
  height?: number;
};

export const NextPageSkeletons: FunctionalComponent<NextPageSkeletonsProps> = ({
  count,
  firstOrder,
  height,
}) =>
  Array.from({ length: count }, (_, i) => (
    <vviinn-product-card
      class="next-page-skeleton"
      loading={true}
      responsive={true}
      productTitle=""
      productId={`skeleton-${i}`}
      key={`skeleton-${i}`}
      // Merchant card styles size the skeleton like the card it stands for
      part="product-card"
      style={{
        order: (firstOrder + i).toString(),
        ...(height && { height: `${height}px` }),
      }}
    />
  ));
