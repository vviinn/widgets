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
import { WidgetEventData } from "../../recommendation/events";
import { CampaignName, campaignTypeTitle } from "../../campaign/Campaign";

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
  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";

  /** Event emitted when vpr-button clicked */
  @Event() vviinnWidgetOpen: EventEmitter<WidgetEventData>;

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
            campaignTypeTitle: campaignTypeTitle[this.campaignType],
            id: this.el.id,
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
    sidebar.color = this.color;
    sidebar.mode = this.position === "right" ? "grid" : this.mode;
    sidebar.imageWidth = this.imageWidth;
    sidebar.currencySign = this.currencySign;
    sidebar.apiPath = this.apiPath;
    sidebar.buttonElementId = this.el.id;

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
