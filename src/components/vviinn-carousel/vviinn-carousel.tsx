import { Component, Host, h, Element, State, Prop } from "@stencil/core";
import { chunksOf } from "fp-ts/lib/Array";
import { Recommendation } from "../../recommendation/recommendation";
import { ChevronIcon } from "../vviinn-icons";
import { CampaignTypeId } from "../../campaign/Campaign";

const COLUMNS_NUMBER_CSS_VAR = "--vviinn-carousel-columns-internal";
const CAROUSEL_WIDTH_CSS_VAR = "--vviinn-carousel-content-width";
const CAROUSEL_IMAGE_WIDTH_CSS_VAR = "--vviinn-carousel-image-width";
const CONTENT_GROUP_CSS_CLASS = "items-group";

type MoveDirection = "left" | "right";
export type CarouselMode = "grid" | "continuity";

/**
 * @part carousel-button
 **/
@Component({
  tag: "vviinn-carousel",
  styleUrl: "vviinn-carousel.css",
  shadow: false,
})
export class VviinnCarousel {
  @Element() el: HTMLElement;

  @State() moveDirection: MoveDirection = "right";
  @State() contentGroups: HTMLElement[] = [];
  @State() activeContentGroup: number = 0;
  @State() isRTL: boolean = false;

  @Prop() mode: CarouselMode = "continuity";
  @Prop() imageWidth: number = 140;
  @Prop() showScroll: boolean = true;
  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() widgetElementId?: string;
  @Prop() gridArrowsDynamic: boolean;

  @Prop() recommendations: Recommendation[] = [];

  private columns: number = 0;
  private resizeObserver: ResizeObserver = new ResizeObserver(() =>
    this.handleResize()
  );

  private mutationObserver = new MutationObserver(() =>
    this.cloneSlottedContent()
  );

  private isLastGroup = () =>
    this.activeContentGroup === this.getContentGroups().length - 1 &&
    this.mode === "grid";

  private isFirstGroup = () =>
    this.activeContentGroup === 0 && this.mode === "grid";

  componentWillLoad() {
    this.isRTL = document.dir === "rtl";
  }

  connectedCallback() {
    this.setItemWidth();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  componentDidLoad() {
    this.setWidth();
    this.processScrollbarWidth();
    this.columns = this.getColumnsNumber();
    const slot = this.el.querySelector(".content");

    this.mutationObserver.observe(slot, { subtree: true, childList: true });
    this.resizeObserver.observe(this.getHostParent());
  }

  private getItemWidthFromDocument(): number {
    return parseInt(
      getComputedStyle(document.body).getPropertyValue(
        CAROUSEL_IMAGE_WIDTH_CSS_VAR
      )
    );
  }

  private setItemWidth() {
    const widthInDocument = this.getItemWidthFromDocument();
    const itemWidth = isNaN(widthInDocument)
      ? this.imageWidth
      : widthInDocument;

    this.el.style.setProperty(CAROUSEL_IMAGE_WIDTH_CSS_VAR, `${itemWidth}px`);
  }

  private getContentClassMap() {
    return {
      content: true,
      [this.moveDirection]: true,
      [this.mode]: true,
      "show-scrollbar": this.showScroll,
    };
  }

  private handleResize() {
    this.setWidth();
    this.processScrollbarWidth();
    this.setItemWidth();

    const newColumns = this.getColumnsNumber();

    if (newColumns !== this.columns) {
      this.columns = newColumns;
    }
  }

  private calculateMoveStep() {
    const contentWidths = this.getContent().map(
      (el) => el.getBoundingClientRect().width
    );
    const sum = contentWidths.reduce((acc, val) => acc + val, 0);

    return sum / contentWidths.length;
  }

  private getHostParent(): Element {
    const parent = this.el.parentNode as any;
    return parent.host.parentElement;
  }

  private setWidth() {
    const parent = this.getHostParent();

    if (!parent) return;

    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width =
      parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));

    this.el.style.setProperty(CAROUSEL_WIDTH_CSS_VAR, `${width}px`);
  }

  getParent(): HTMLElement {
    const parentNode: any = this.el.parentNode;
    const host = parentNode.host;
    return host.parentElement as HTMLElement;
  }

  private cloneSlottedContent() {
    this.setWidth();
  }

  private getActiveGroupIndex(): number {
    const contentNodeLeft =
      this.getContentNode()?.getBoundingClientRect()?.left;

    if (!contentNodeLeft) return 0;

    const groups = this.getContentGroups();
    const groupsPositions = groups.map((g) => g.getBoundingClientRect().left);

    const indexedPositions = groupsPositions
      .map((value: number, index: number) => [value, index])
      .filter((x) => x[0] >= 0);

    return indexedPositions.length > 0
      ? this.isRTL
        ? indexedPositions[indexedPositions.length - 1][1]
        : indexedPositions[0][1]
      : 0;
  }

  private getContentNode(): HTMLElement {
    return this.el.querySelector(".content");
  }

  private getContent(): HTMLElement[] {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c as HTMLElement);
  }

  private getColumnsNumber(): number {
    const styleSheet = getComputedStyle(this.el);
    const columnsInCss = styleSheet.getPropertyValue(COLUMNS_NUMBER_CSS_VAR);
    const columnsNumber = parseInt(columnsInCss);
    return columnsNumber && !isNaN(columnsNumber) ? columnsNumber : 4;
  }

  private getContentGroups(): HTMLElement[] {
    return Array.from(this.el.querySelectorAll(`.${CONTENT_GROUP_CSS_CLASS}`));
  }

  private showNext() {
    this.moveDirection = "right";
    const contentContainer = this.getContentNode();

    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft + this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }

  private showPrev() {
    this.moveDirection = "left";
    const contentContainer = this.getContentNode();

    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft - this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }

  private scroll(index: number) {
    const contentContainer = this.getContentNode();

    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: this.calculateMoveStep() * index,
        behavior: "smooth",
      });
    });
  }

  private processScrollbarWidth() {
    const target = this.getContentNode();
    if (!target) return;
    const scrollRatio =
      (target.scrollLeft + target.clientWidth) / target.scrollWidth;
    const scrolledWidth = target.clientWidth * scrollRatio;

    this.el.style.setProperty(
      "--vviinn-progressbar-width",
      `${scrolledWidth}px`
    );

    this.activeContentGroup = this.getActiveGroupIndex();
  }

  private showBullets(): boolean {
    return this.mode === "grid" && this.showScroll;
  }

  private showScrollbar(): boolean {
    return this.mode === "continuity" && this.showScroll;
  }

  private getClassMap() {
    return {
      [this.mode]: true,
      "show-scrollbar": this.showScrollbar(),
    };
  }

  private renderRecommendation(
    recommendation: Recommendation,
    rank: number
  ): HTMLVviinnProductCardElement {
    return (
      <vviinn-product-card
        part="product-part"
        productId={recommendation.productId}
        productTitle={recommendation.title}
        deeplink={recommendation.deeplink}
        image={recommendation.image.thumbnail}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
        imageRatio={1}
        price={recommendation.price.actual}
        salePrice={recommendation.price.sale}
        responsive={this.mode === "grid"}
        dimmedBackground={this.mode === "continuity"}
        campaignTypeId={this.campaignTypeId}
        index={rank}
        widgetElementId={this.widgetElementId}
      />
    );
  }

  private renderRecommendationGroup(elements: HTMLVviinnProductCardElement[]) {
    return (
      <div class={CONTENT_GROUP_CSS_CLASS} part="items-group">
        {...elements}
      </div>
    );
  }

  private renderRecommendationGroups(
    elements: HTMLVviinnProductCardElement[][]
  ) {
    return elements.map((el) => this.renderRecommendationGroup(el));
  }

  private renderRecommendations() {
    return this.mode === "grid"
      ? this.renderGrid()
      : this.renderRecommendationsElements();
  }

  private renderRecommendationsElements(): HTMLVviinnProductCardElement[] {
    return this.recommendations.map((r, i) => this.renderRecommendation(r, i));
  }

  private renderGrid() {
    const recommendations = this.renderRecommendationsElements();
    const grouppedContent = chunksOf(this.getColumnsNumber())(recommendations);

    return this.renderRecommendationGroups(grouppedContent);
  }

  private renderBullets() {
    const numberOfBullets = Math.ceil(
      this.recommendations.length / this.getColumnsNumber()
    );

    const bulletsArray = Array.from(Array(numberOfBullets).keys());

    return bulletsArray.map((index) => (
      <div
        class={{
          bullet: true,
          active: this.activeContentGroup === index,
        }}
        onClick={() => this.scroll(index)}
      />
    ));
  }

  render() {
    return (
      <Host class={this.getClassMap()}>
        <div class={{ body: true, ...this.getClassMap() }}>
          <button
            class="prev"
            onClick={() => this.showPrev()}
            part="carousel-button"
            disabled={this.gridArrowsDynamic && this.isFirstGroup()}
          >
            <ChevronIcon />
          </button>

          <div
            class={this.getContentClassMap()}
            onScroll={() => this.processScrollbarWidth()}
          >
            {this.renderRecommendations()}
          </div>

          <button
            class="next"
            onClick={() => this.showNext()}
            part="carousel-button"
            disabled={this.gridArrowsDynamic && this.isLastGroup()}
          >
            <ChevronIcon />
          </button>
        </div>
        {this.showBullets() && (
          <div class="bullets">{this.renderBullets()}</div>
        )}
      </Host>
    );
  }
}
