import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import { version } from "../../../package.json";
import { VisualSearchIcon } from "../vviinn-icons";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { CampaignName } from "../../campaign/Campaign";

/**
 *
 * @part button - clickable button element
 */
@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Element() el: HTMLElement;
  /** Vviinn customer token (required) */
  @Prop() token: string;
  /** Id of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Choose position of the modal */
  @Prop() position: "bottom" | "right" = "bottom";
  /** Image for showing in the modal's header */
  @Prop() sourceImage: string | null = null;
  /** Customize sidebar title */
  @Prop() sidebarTitle: string = "Visually similar products";
  /** Show or hide scrollbar */
  @Prop() modalScrollbar: boolean = false;
  /** Comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** Color accepts any hexcode string */
  @Prop() color: string;
  /** Add default styles to the button */
  @Prop() addStyle: boolean = true;
  /** Choose one of carousel modes */
  @Prop() mode: CarouselMode = "continuity";
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Message is displayed when no results */
  @Prop() noResultText?: string;
  /** Showing message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow?: boolean = true;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;

  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";

  // List to show in the Storybook:
  @Event() vviinnWidgetLoad: EventEmitter;
  @Event() vviinnWidgetOpen: EventEmitter;
  @Event() vviinnWidgetClose: EventEmitter;
  @Event() vviinnProductClick: EventEmitter;
  @Event() vviinnProductView: EventEmitter;
  @Event() vviinnProductLoad: EventEmitter;
  @Event() vviinnNoResult: EventEmitter;

  private sidebar: HTMLVviinnRecommendationsSidebarElement | null = null;
  private sidebarCloseListener: () => void = () => {
    document.body.removeChild(this.sidebar);
  };

  render() {
    return (
      <Host
        onClick={(): void => {
          this.handleClick();
        }}
        role="button"
        tabindex="0"
      >
        <vviinn-button addStyle={this.addStyle} part="vviinn-button">
          <slot>
            <VisualSearchIcon />
          </slot>
        </vviinn-button>
      </Host>
    );
  }

  handleClick(): void {
    const sidebar = document.createElement("vviinn-recommendations-sidebar");
    sidebar.sidebarTitle = this.sidebarTitle;
    sidebar.productId = this.productId;
    sidebar.token = this.token;
    sidebar.position = this.position;
    sidebar.sourceImage = this.sourceImage;
    sidebar.widgetScrollbar = this.modalScrollbar;
    sidebar.campaigns = this.campaigns;
    sidebar.campaignType = this.campaignType;
    sidebar.color = this.color;
    sidebar.mode = this.position === "right" ? "grid" : this.mode;
    sidebar.imageWidth = this.imageWidth;
    sidebar.currencySign = this.currencySign;
    sidebar.apiPath = this.apiPath;
    sidebar.buttonElementId = this.el.id;
    sidebar.noResultText = this.noResultText;
    sidebar.noResultShow = this.noResultShow;
    sidebar.gridArrowsDynamic = this.gridArrowsDynamic;
    sidebar.widgetVersion = version;
    sidebar.showingInButton = true;

    this.sidebar = sidebar;

    sidebar.addEventListener("vviinnWidgetClose", this.sidebarCloseListener);
    document.body.append(this.sidebar);
  }

  disconnectedCallback() {
    if (!this.sidebar) return;
    this.sidebar.removeEventListener(
      "vviinnWidgetClose",
      this.sidebarCloseListener
    );
    document.body.removeChild(this.sidebar);
  }
}
