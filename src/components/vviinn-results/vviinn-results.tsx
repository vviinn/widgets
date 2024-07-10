import { Component, Host, h, Prop, Element } from "@stencil/core";
import { CampaignTypeId } from "../../components";
import { searchState } from "../../store/search.store";

@Component({
  tag: "vviinn-results",
  styleUrl: "vviinn-results.css",
  shadow: true,
})
export class VviinnResults {
  @Element() el: HTMLElement;

  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() imageWidth: number;
  @Prop() currencySign: string;
  @Prop() widgetVersion: string;
  @Prop() locale: string;
  @Prop() currency: string;
  @Prop() buttonElementId?: string;
  @Prop() widgetElementId?: string;
  // @Prop() pricePrefix?: string;

  private renderResults() {
    if (searchState.results.length === 0) return null;
    // if (!this.resultLoaded) {
    //   this.vviinnResultLoad.emit(this.getBasicEventData());
    //   this.trackResultEvent("load");
    //   this.resultLoaded = true;
    // }

    return searchState.results.map((p, i) => (
      <vviinn-product-card
        key={p.productId}
        index={i}
        productTitle={p.title}
        productId={p.productId}
        productType={p.productType}
        brand={p.brand}
        deeplink={p.deeplink}
        price={p.price.actual}
        salePrice={p.price.sale}
        responsive={true}
        imageWidth={this.imageWidth}
        image={p.image.thumbnail ?? p.image.original}
        part="product-card"
        campaignTypeId={this.campaignTypeId}
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={this.widgetVersion}
        currency={this.currencySign}
        // pricePrefix={this.pricePrefix}
        locale={this.locale}
      />
    ));
  }

  render() {
    return <Host>{this.renderResults()}</Host>;
  }
}
