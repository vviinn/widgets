import { Component, Host, h, Prop } from "@stencil/core";
import { state } from "../../store/store";
import { createImage, ImageData, wrapInLink } from "./render-helpers";

/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part title - product title
 */
@Component({
  tag: "vviinn-product-card",
  styleUrl: "vviinn-product-card.css",
  shadow: true,
})
export class VviinnProductCard {
  @Prop() brand: string | undefined;
  @Prop() currency: string | undefined = undefined;
  @Prop() deeplink: string | undefined;
  @Prop() image: string | undefined;
  @Prop() imageRatio: number = 1;
  @Prop() imageWidth: number = 100;
  @Prop() locale: string | undefined = undefined;
  @Prop() price: number | undefined;
  @Prop() pricePrefix: string | undefined = undefined;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() salePrice: number | undefined;

  private renderSpan(
    content: string | HTMLElement | HTMLElement[],
    name: string
  ): HTMLElement | null {
    return content ? (
      <span part={name} class={name}>
        {content}
      </span>
    ) : null;
  }

  private renderImage(): HTMLElement | null {
    if (!this.image) return null;

    const imageData: ImageData = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      url: this.image,
      title: this.productTitle,
    };

    if (!this.deeplink) return createImage(imageData);

    const linkData = {
      href: this.deeplink,
      class: "image-link",
      part: "image-link",
    };

    return wrapInLink(linkData, createImage(imageData));
  }

  private renderTitle(): HTMLElement {
    const title = this.renderSpan(this.productTitle, "title");

    if (!this.deeplink) return title;

    const linkData = {
      href: this.deeplink,
      class: "deeplink",
      part: "deeplink",
    };

    return wrapInLink(linkData, title);
  }

  private havePrice(): boolean {
    return (this.salePrice ?? this.price) != undefined;
  }

  private renderPricePrefix(): HTMLElement | null {
    const prefix = this.pricePrefix ?? state.pricePrefix;
    return prefix ? this.renderSpan(prefix, "price-prefix") : null;
  }

  private renderCurrency(): HTMLElement | null {
    const currency = this.currency ?? state.currencySign;
    return currency ? this.renderSpan(currency, "currency") : null;
  }

  private formatPrice(price: number): HTMLElement[] {
    const locale = this.locale ?? state.locale;
    const formattedPrice = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
    }).format(price);
    const priceElement = this.renderSpan(formattedPrice, "price-amount");

    return [this.renderPricePrefix(), priceElement, this.renderCurrency()];
  }

  renderRegularPrice(): HTMLElement {
    return this.salePrice
      ? this.renderSpan(this.formatPrice(this.price), "price-outdated")
      : this.renderSpan(this.formatPrice(this.price), "price-regular");
  }

  renderSalePrice(): HTMLElement | null {
    return this.salePrice
      ? this.renderSpan(this.formatPrice(this.salePrice), "price-sale")
      : null;
  }

  private renderPrice(): HTMLElement | null {
    return this.havePrice()
      ? this.renderSpan(
        [this.renderRegularPrice(), this.renderSalePrice()],
        "price-container"
      )
      : null;
  }

  render() {
    return (
      <Host exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title">
        {this.renderImage()}
        {this.renderTitle()}
        {this.renderSpan(this.brand, "brand")}
        {this.renderSpan(this.productType, "product-type")}
        {this.renderPrice()}
      </Host>
    );
  }
}
