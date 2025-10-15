import { FunctionalComponent, h, Fragment, JSX } from "@stencil/core";
import { BasePrice } from "../../interfaces";
import { getLastUrlPath } from "../../helpers/url/getLastUrlPath";

type LinkedProps = {
  deeplink: string;
  tabindex?: number;
  part?: string;
};

export const Linked = (props: LinkedProps, child: JSX.Element) =>
  props.deeplink ? (
    <a
      class={props.part}
      part={props.part}
      href={props.deeplink}
      tabindex={props.tabindex}
    >
      {child}
    </a>
  ) : (
    child
  );

const getFormattedPrice = (price: number, locale: string) =>
  price
    ? new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : null;

type PriceType = "sale" | "outdated" | "regular";

type PriceElementProps = {
  readonly locale: string;
  readonly price: number;
  readonly prefix: string;
  readonly currency: string;
  readonly priceType?: PriceType;
};

type BasePriceElementProps = {
  readonly locale: string;
  readonly currency: string;
  readonly basePrice?: BasePrice | null;
  readonly priceType?: PriceType;
};

const FormattedPrice: FunctionalComponent<PriceElementProps> = (props) => {
  const priceType = props.priceType;
  const formattedPrice = getFormattedPrice(props.price, props.locale);

  const prefixElement = props.prefix ? (
    <span part="price-prefix">{props.prefix + " "}</span>
  ) : null;

  const currencyElement = props.currency ? (
    <span part="currency" class="currency">
      {props.currency}
    </span>
  ) : null;

  return (
    <span
      class="price-amount"
      part={`price-amount${priceType ? "-" + priceType : ""}`}
    >
      {prefixElement}
      {formattedPrice}
      {currencyElement}
    </span>
  );
};

const FormattedBasePrice: FunctionalComponent<BasePriceElementProps> = ({
  currency,
  basePrice,
  priceType,
  locale,
}) => {
  if (!basePrice?.price) return null;
  const formattedPrice = getFormattedPrice(basePrice.price, locale);

  return (
    <span
      class="price-amount price-amount--base"
      part={`price-amount-base${priceType ? "-" + priceType : ""}`}
    >
      {formattedPrice}
      {currency?.length > 0 && (
        <span part="currency" class="currency">
          {currency}
        </span>
      )}
      /{basePrice?.quantity > 1 && basePrice?.quantity}
      {basePrice?.measure}
    </span>
  );
};

export const parseBasePrice = (
  basePrice?: BasePrice | string | null,
): BasePrice | null => {
  if (!basePrice) return null;
  if (typeof basePrice === "string") {
    return JSON.parse(basePrice) as BasePrice;
  }
  return basePrice;
};

type PriceProps = PriceElementProps & {
  basePrice: BasePrice;
  salePrice: number;
  baseSalePrice: BasePrice;
  showInContainer?: boolean;
};

export const renderCustomLabels = (labels: string[]) => {
  const renderLabel = (label: string, index: number) =>
    label ? (
      <span part={`custom-label-${index}`} class="custom-label">
        <slot name={`vviinn-custom-label-${index}`}>{label}</slot>
      </span>
    ) : null;

  return (
    <Fragment>
      {labels.map((label, index) => renderLabel(label, index))}
    </Fragment>
  );
};

export const Price: FunctionalComponent<PriceProps> = (props) => {
  const renderPrice = () =>
    props.salePrice ? (
      [
        <span class="price-outdated" part="price-outdated">
          <FormattedPrice
            prefix={props.prefix}
            currency={props.currency}
            price={props.price}
            locale={props.locale}
            priceType="outdated"
          />
          <FormattedBasePrice
            currency={props.currency}
            basePrice={props.basePrice}
            locale={props.locale}
            priceType="outdated"
          />
        </span>,

        <span class="price-sale" part="price-sale">
          <FormattedPrice
            prefix={props.prefix}
            currency={props.currency}
            price={props.salePrice}
            locale={props.locale}
            priceType="sale"
          />
          <FormattedBasePrice
            currency={props.currency}
            basePrice={props.baseSalePrice}
            locale={props.locale}
            priceType="sale"
          />
        </span>,
      ]
    ) : (
      <span class="price-regular" part="price-regular">
        <FormattedPrice
          prefix={props.prefix}
          currency={props.currency}
          price={props.price}
          locale={props.locale}
          priceType="regular"
        />

        <FormattedBasePrice
          currency={props.currency}
          basePrice={props.basePrice}
          locale={props.locale}
          priceType="regular"
        />
      </span>
    );

  return props.showInContainer ? (
    <div class="price-container" part="price-container">
      {renderPrice()}
    </div>
  ) : (
    renderPrice()
  );
};

export type ImageProps = {
  width: number;
  height: number;
  title: string;
  src: string;
  ref: (el: HTMLImageElement) => void;
  isSource?: boolean;
  imageResolutionWidth?: number;
  onLoadEnd?: () => void;
};

export interface UniversalImageProps extends ImageProps {
  isResponsive?: boolean;
  isFullHeight?: boolean;
  additionalClasses?: string[];
  additionalParts?: string[];
  onLoadEnd?: () => void;
}
export const ContentCardContent = (
  contentTitle: string,
  contentLink: string,
  labelText: string,
) => {
  return (
    <div
      class="content-container"
      part="content-container content-card-content-container"
    >
      <div class="content-label" part="content-label">
        {labelText}
      </div>
      {contentTitle && (
        <div class="content-title" part="content-title" title={contentTitle}>
          {contentTitle}
        </div>
      )}
      {contentLink && (
        <Linked deeplink={contentLink} part="content-link" tabindex={0}>
          {getLastUrlPath(contentLink)}
        </Linked>
      )}
    </div>
  );
};

export const ListCardContent = (listTitle: string, labelText: string) => {
  return (
    <div
      class="content-container"
      part="list-container list-card-content-container"
    >
      <div class="list-label" part="list-label">
        {labelText}
      </div>
      {listTitle && (
        <div class="list-title" part="list-title" title={listTitle}>
          {listTitle}
        </div>
      )}
    </div>
  );
};
