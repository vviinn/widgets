import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { BasicEventData } from "../../recommendation/events";
import { CampaignName, campaignTypeNames } from "../../campaign/Campaign";

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
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";
  @Prop() sourceImage: string | null = null;
  @Prop() sidebarTitle: string = "Visually similar products";
  @Prop() modalScrollbar: boolean = false;
  /** comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  @Prop() color: string;
  @Prop() addStyle: boolean = true;
  @Prop() mode: CarouselMode = "continuity";
  @Prop() imageWidth: number = 300;
  @Prop() currencySign: string = "€";
  /** This message is displayed when no results */
  @Prop() noResultText?: string;
  /** Showing message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow?: boolean = true;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;

  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";

  /** Event emitted when vpr-button clicked */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  // List to show in the Storybook:
  @Event() vviinnWidgetLoad: EventEmitter;
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
          this.vviinnWidgetOpen.emit({
            widgetType: "VPR",
            campaignTypeId: this.campaignType,
            campaignTypeName: campaignTypeNames[this.campaignType],
            widgetId: this.el.id,
          });
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
