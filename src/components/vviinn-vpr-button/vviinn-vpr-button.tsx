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
import {
  BasicEventData,
  ProductCardEventData,
} from "../../recommendation/events";

/**
 *
 * @part button - Clickable button element.
 * @part vviinn-button - Button element container.
 */
@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Element() el: HTMLElement;
  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** ID of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Position of the modal */
  @Prop() position: "bottom" | "right" = "bottom";
  /** Image for showing in the modal's header */
  @Prop() sourceImage: string | null = null;
  /** Sidebar title */
  @Prop() sidebarTitle: string = "Visually similar products";
  /** Show or hide the scrollbar */
  @Prop() modalScrollbar: boolean = false;
  /** Comma-separated list of campaign IDs */
  @Prop() campaigns: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Add default styles to the button */
  @Prop() addStyle: boolean = true;
  /** Switch between carousel modes */
  @Prop() mode: CarouselMode = "continuity";
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** The message is displayed when no results */
  @Prop() noResultText: string = "No results! Please, try again later.";
  /** Showing a message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow: boolean = true;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;
  /** Excluded filter. Example: "brand:Nike;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailNewTab: boolean = false;

  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";

  /** The event emits on widget load */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;
  /** The event emits on modal open */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;
  /** The event emits on modal close */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;
  /** Recommendation request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** The recommendation appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

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
    sidebar.productDetailNewTab = this.productDetailNewTab;
    sidebar.widgetVersion = version;
    sidebar.showingInButton = true;
    sidebar.excluded = this.excluded;

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
