import {
  Component,
  ComponentInterface,
  Host,
  h,
  Prop,
  State,
  Element,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { createBearAuthedHeader } from "./token-helpers";
import { Interfaces } from "../../interfaces/recommendation";
import state from "../../store/store";
import { CampaignName } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { imageSearchState } from "../../store/imageSearch.store";

@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Title for recommendations widget */
  @Prop() blockTitle: string = "Recommended products";
  /** Number of columns for recommendations */
  @Prop() columns: number;
  /** Ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 150;
  /** Id of product you need recommendations for */
  @Prop() productId: string;
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** prefix will shown before price */
  @Prop() pricePrefix: string;
  /** Use slider or grid view */
  @Prop() sliderMode: boolean = false;
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** @internal */
  @Prop() apiPath: string | undefined;

  @State() recommendations: Interfaces["VisualProductSearch"][] = [];
  @State() loaded: boolean = false;

  private cssPartsDetector: HTMLDivElement;
  private slider: HTMLVprSliderElement;

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
  }

  componentDidLoad() {
    const detectorBounds = this.cssPartsDetector.getBoundingClientRect();

    if (detectorBounds.width === 0 && detectorBounds.height === 0) {
      state.fallbackStyles = pipe(
        O.fromNullable(
          document.head.getElementsByTagName("style")["vpr-styles"]
        ),
        O.map((style) =>
          style.textContent.replace(
            /(?:vi-vpr-view::part\()(\w+)-(\w+)\)/g,
            ".$1.$2"
          )
        ),
        O.getOrElse(() => "")
      );
    }
  }

  async componentWillLoad() {
    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;

    if (this.productId === undefined || this.token === undefined) return;

    const headers = createBearAuthedHeader(this.token);
    const request = pipe(
      TE.of(getRecommendationsService(this.campaignType)),
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

  handleError(error: unknown): any {
    console.log("ERROR:", error);
  }

  handleRecommendationsSucces(data: any) {
    this.recommendations = data?.extended ?? data;

    setTimeout(() => {
      this.slider.loadProducts(this.recommendations);
    });

    imageSearchState.results = this.recommendations;
    this.loaded = true;
  }

  render() {
    return (
      <Host
        class={{ loaded: this.loaded, empty: this.recommendations.length == 0 }}
        aria-hidden={this.loaded ? "false" : "true"}
        exportparts="grid"
      >
        <style>{state.fallbackStyles}</style>
        <h2 part="recommendations-title">{this.blockTitle}</h2>
        <vpr-slider
          mode={this.sliderMode ? "auto" : "grid"}
          imageWidth={this.imageWidth}
          imageRatio={this.imageRatio}
          productsInGrid={this.columns}
          part="grid"
          ref={(el) => (this.slider = el)}
        ></vpr-slider>
        <div
          class="visually-hidden"
          part="shadow-parts-detect"
          ref={(el) => (this.cssPartsDetector = el)}
        ></div>
      </Host>
    );
  }
}
