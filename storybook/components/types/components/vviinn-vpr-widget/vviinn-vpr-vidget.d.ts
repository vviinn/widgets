import { ComponentInterface } from "../../stencil-public-runtime";
import { Interfaces } from "../../interfaces/recommendation";
import { CampaignName } from "../../campaign/Campaign";
export declare class VviinnVprWidget implements ComponentInterface {
  el: HTMLElement;
  /** Title for recommendations widget */
  blockTitle: string;
  /** Number of columns for recommendations */
  columns: number;
  /** Ratio of each recommended product image */
  imageRatio: number;
  /** Width of each recommended product image */
  imageWidth: number;
  /** Id of product you need recommendations for */
  productId: string;
  /** vviinn customer token */
  token: string;
  /** Currency sign will shown after price */
  currencySign: string;
  /** prefix will shown before price */
  pricePrefix: string;
  /** Use slider or grid view */
  mode: "classic" | "modern";
  /** Campaign type */
  campaignType: CampaignName;
  /** Locale for currency formatting */
  locale: string;
  /** @internal */
  apiPath: string | undefined;
  showScroll: boolean;
  recommendations: Interfaces["VisualProductSearch"][];
  loaded: boolean;
  handleProductIdChange(): void;
  connectedCallback(): void;
  componentWillLoad(): Promise<void>;
  private getRecommendations;
  handleError(error: unknown): any;
  handleRecommendationsSucces(data: any): void;
  render(): any;
}
