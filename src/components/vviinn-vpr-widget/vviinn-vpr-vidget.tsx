import {
  Component,
  ComponentInterface,
  Host,
  h,
  Prop,
  State,
  Element,
  Watch,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { createBearAuthedHeader } from "./token-helpers";
import { Interfaces } from "../../interfaces/recommendation";
import state from "../../store/store";
import { CampaignName } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { imageSearchState } from "../../store/imageSearch.store";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";

/**
 * @part product-card
 * @part title - title inside product card
 * @part brand - brand inside product card
 * @part currency - brand inside product card
 * @part image - product card image
 * @part image-link - anchor element around product image
 * @part price-amount
 * @part price-container
 * @part price-outdated
 * @part price-prefix
 * @part price-regular
 * @part price-sale
 */
@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Title for recommendations widget */
  @Prop() blockTitle: string = "Recommended products";
  /** Ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** Id of product you need recommendations for */
  @Prop() productId: string;
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** prefix will shown before price */
  @Prop() pricePrefix: string;
  /** Use slider or grid view */
  @Prop() mode: CarouselMode = "continuity";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** @internal */
  @Prop() apiPath: string | undefined;

  @Prop() showScroll = true;
  @Prop() cssUrl: string | null = null;

  @State() recommendations: Interfaces["VisualProductSearch"][] = [];
  @State() loaded: boolean = false;

  @Watch("productId")
  handleProductIdChange() {
    this.getRecommendations();
  }

  @Watch("campaignType")
  handleCampaignTypeChange() {
    this.getRecommendations();
  }

  @Watch("apiPath")
  handleApiPathChange(newPath: string) {
    state.apiPath = newPath;
    this.getRecommendations();
  }

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
  }

  async componentWillLoad() {
    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;

    this.getRecommendations();
  }

  private async getRecommendations() {
    if (this.productId === undefined || this.token === undefined) return;

    const campaignType =
      this.campaignType.length > 0 ? this.campaignType : "VPR";
    const headers = createBearAuthedHeader(this.token);
    const request = pipe(
      TE.of(getRecommendationsService(campaignType)),
      TE.ap(TE.of(this.productId)),
      TE.ap(TE.of(headers)),
      TE.flatten
    );

    const runRequest = await request();

    pipe(
      runRequest,
      E.fold(
        (error) => this.handleError(error),
        (data) => this.handleRecommendationsSucces(data)
      )
    );
  }

  private handleError(error: unknown): any {
    console.log("ERROR:", error);
  }

  private handleRecommendationsSucces(data: any) {
    this.recommendations = data?.extended ?? data;
    imageSearchState.results = this.recommendations;
    this.loaded = true;
  }

  private isExternalCSS(): boolean {
    return this.cssUrl && this.cssUrl.length > 0;
  }

  private renderExternalCSS() {
    return this.isExternalCSS() ? <link href={this.cssUrl} rel="stylesheet" /> : "";
  }

  render() {
    return (
      <Host
        class={{
          loaded: this.loaded,
          empty: this.recommendations.length == 0,
          [this.mode]: true,
        }}
        aria-hidden={this.loaded ? "false" : "true"}
      >
        {this.renderExternalCSS()}
        <style>{state.fallbackStyles}</style>
        <h2 part="recommendations-title">{this.blockTitle}</h2>
        <vviinn-carousel
          mode={this.mode}
          imageWidth={this.imageWidth}
          showScroll={this.showScroll}
          recommendations={this.recommendations}
        >
        </vviinn-carousel>
      </Host>
    );
  }
}
