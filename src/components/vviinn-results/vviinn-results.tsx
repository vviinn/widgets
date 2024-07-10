import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
} from "@stencil/core";
import { BasicEventData, CampaignTypeId } from "../../components";
import { searchState } from "../../store/search.store";

@Component({
  tag: "vviinn-results",
  styleUrl: "vviinn-results.css",
  shadow: true,
})
export class VviinnResults {
  @Element() el: HTMLElement;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;
  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() imageWidth: number;
  @Prop() currencySign: string;
  @Prop() widgetVersion: string;
  @Prop() locale: string;
  @Prop() buttonElementId?: string;
  @Prop() widgetElementId?: string;

  private renderResults() {
    if (searchState.results.length === 0) return null;
    // FIXME: fix result events
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
        locale={this.locale}
      />
    ));
  }

  render() {
    return (
      <Host>
        <div class="products">{this.renderResults()}</div>
      </Host>
    );
  }
}
