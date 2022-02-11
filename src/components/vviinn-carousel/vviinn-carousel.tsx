import { Component, Host, h, Element, State, Prop } from "@stencil/core";
import { chunksOf } from "fp-ts/lib/Array";
import { ChevronIcon } from "../vviinn-icons";

const COLUMNS_NUMBER_CSS_VAR = "--vviinn-carousel-columns-internal";
const CAROUSEL_WIDTH_CSS_VAR = "--vviinn-carousel-content-width";
const CAROUSEL_IMAGE_WIDTH_CSS_VAR = "--vviinn-carousel-image-width";
const CONTENT_GROUP_CSS_CLASS = "items-group";
const INCOMPLETE_GROUP_CSS_CLASS = "incomplete";

type MoveDirection = "left" | "right";
export type CarouselMode = "classic" | "modern";

@Component({
  tag: "vviinn-carousel",
  styleUrl: "vviinn-carousel.css",
  shadow: true,
})
export class VviinnCarousel {
  @Element() el: HTMLElement;

  @State() moveDirection: MoveDirection = "right";
  @State() contentGroups: HTMLElement[] = [];
  @State() activeContentGroup: number = 0;

  @Prop() mode: CarouselMode = "modern";
  @Prop() imageWidth: number = 140;
  @Prop() showScroll: boolean = true;

  private content: Element[] = [];
  private isContentClonned: boolean = false;
  private columns: number = 0;
  private resizeObserver: ResizeObserver = new ResizeObserver(() =>
    this.handleResize()
  );

  connectedCallback() {
    this.el.style.setProperty(
      CAROUSEL_IMAGE_WIDTH_CSS_VAR,
      `${this.imageWidth}px`
    );
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  componentDidRender() {
    this.setWidth();
    this.processScrollbarWidth();
    this.columns = this.getColumnsNumber();
  }

  private getContentClassMap() {
    return {
      content: true,
      [this.moveDirection]: true,
      [this.mode]: true,
    };
  }

  private handleResize() {
    this.setWidth();
    this.processScrollbarWidth();

    const newColumns = this.getColumnsNumber();

    if (newColumns !== this.columns) {
      this.renderContent();
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

  private setWidth() {
    const parent = this.el.offsetParent;
    if (!parent) return;

    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width =
      parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));

    this.el.style.setProperty(CAROUSEL_WIDTH_CSS_VAR, `${width}px`);
  }

  private cloneSlottedContent(event: Event) {
    if (this.isContentClonned) return;

    const slot: HTMLSlotElement = event.target as HTMLSlotElement;
    this.content = slot.assignedElements();
    this.isContentClonned = true;

    this.renderContent();
    this.setWidth();
    this.resizeObserver.observe(this.el.offsetParent);
  }

  private renderContent() {
    const c: any =
      this.mode === "classic"
        ? chunksOf(this.getColumnsNumber())(this.content)
        : this.content.reduce((fragment, element) => {
            fragment.append(element);
            return fragment;
          }, new DocumentFragment());

    this.mode === "classic" ? this.renderGroup(c) : this.renderLine(c);
  }

  private renderGroup(content: Element[][]) {
    const columnsNumber = this.getColumnsNumber();
    const groups = content.map((el: Element[]) => {
      const container = document.createElement("div");
      const groupClassNames =
        el.length < columnsNumber
          ? [CONTENT_GROUP_CSS_CLASS, INCOMPLETE_GROUP_CSS_CLASS]
          : [CONTENT_GROUP_CSS_CLASS];

      container.classList.add(...groupClassNames);

      return el.reduce((acc, el) => {
        acc.append(el);
        return acc;
      }, container);
    });

    const combinedElements = groups.reduce((fragment, element) => {
      fragment.append(element);
      return fragment;
    }, new DocumentFragment());

    this.appendToContent(combinedElements);
    this.contentGroups = this.getContentGroups();
  }

  private renderLine(item: HTMLElement | DocumentFragment) {
    this.appendToContent(item);
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

    return indexedPositions.length > 0 ? indexedPositions[0][1] : 0;
  }

  private getContentNode(): HTMLElement {
    return this.el.shadowRoot.querySelector(".content");
  }

  private getContent(): HTMLElement[] {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c as HTMLElement);
  }

  private getColumnsNumber(): number {
    const styleSheet = getComputedStyle(this.el);
    const columnsInCss = styleSheet.getPropertyValue(COLUMNS_NUMBER_CSS_VAR);
    return parseInt(columnsInCss);
  }

  private getContentGroups(): HTMLElement[] {
    return Array.from(
      this.el.shadowRoot.querySelectorAll(`.${CONTENT_GROUP_CSS_CLASS}`)
    );
  }

  private appendToContent(content: HTMLElement | DocumentFragment) {
    const contentNode = this.getContentNode();
    contentNode.innerHTML = "";
    contentNode.append(content);
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

  private processScrollbarWidth() {
    const target = this.getContentNode();
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
    return this.mode === "classic" && this.showScroll;
  }

  private showScrollbar(): boolean {
    return this.mode === "modern" && this.showScroll;
  }

  private getClassMap() {
    return {
      [this.mode]: true,
      "show-scrollbar": this.showScrollbar(),
    };
  }

  render() {
    return (
      <Host class={this.getClassMap()}>
        <div class="body">
          <button class="prev" onClick={() => this.showPrev()}>
            <ChevronIcon />
          </button>
          <div
            class={this.getContentClassMap()}
            onScroll={() => this.processScrollbarWidth()}
          ></div>
          <button class="next" onClick={() => this.showNext()}>
            <ChevronIcon />
          </button>
        </div>
        {this.showBullets() ? (
          <div class="bullets">
            {this.contentGroups
              .map((_, i) => i)
              .map((i) => (
                <div
                  class={{
                    bullet: true,
                    active: this.activeContentGroup === i,
                  }}
                />
              ))}
          </div>
        ) : (
          ""
        )}
        <slot onSlotchange={(x) => this.cloneSlottedContent(x)}></slot>
      </Host>
    );
  }
}
