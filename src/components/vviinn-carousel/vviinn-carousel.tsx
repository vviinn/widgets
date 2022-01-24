import { Component, Host, h, Element, State, Prop } from "@stencil/core";
import { chunksOf } from "fp-ts/lib/Array";

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

  @Prop() mode: CarouselMode = "classic";

  private moveStep: number = 0;
  private content: Element[] = [];
  private resizeObserver: ResizeObserver = new ResizeObserver(() =>
    this.handleResize()
  );

  connectedCallback() {
    this.setWidth();
  }

  disconnectedCallback() {
    this.resizeObserver.unobserve(this.el.parentElement);
  }

  componentDidRender() {
    this.moveStep = this.calculateMoveStep();
    this.resizeObserver.observe(this.el.parentElement);
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
  }

  private calculateMoveStep() {
    const contentWidths = this.getContent().map(
      (el) => el.getBoundingClientRect().width
    );
    const sum = contentWidths.reduce((acc, val) => acc + val, 0);

    return sum / contentWidths.length;
  }

  private setWidth() {
    const parent = this.el.parentElement;
    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width =
      parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));

    this.el.style.setProperty("--vviinn-carousel-content-width", `${width}px`);
  }

  private cloneSlottedContent(event: Event) {
    const slot: HTMLSlotElement = event.target as HTMLSlotElement;
    this.content = slot.assignedElements();

    this.renderContent();
  }

  private renderContent() {
    const c: any =
      this.mode === "classic"
        ? chunksOf(4)(this.content)
        : this.content.reduce((fragment, element) => {
          fragment.append(element);
          return fragment;
        }, new DocumentFragment());

    this.mode === "classic" ? this.renderGroup(c) : this.appendToContent(c);
  }

  private renderGroup(content: Element[][]) {
    const kek = content.map((el: Element[]) => {
      const lol = document.createElement("div");
      lol.classList.add("items-group");
      return el.reduce((acc, el) => {
        acc.append(el);
        return acc;
      }, lol);
    });

    const combinedElements = kek.reduce((fragment, element) => {
      fragment.append(element);
      return fragment;
    }, new DocumentFragment());

    this.appendToContent(combinedElements);
  }

  private getContentNode(): HTMLElement {
    return this.el.shadowRoot.querySelector(".content");
  }

  private getContent(): HTMLElement[] {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c as HTMLElement);
  }

  appendToContent(content: HTMLElement | DocumentFragment) {
    const contentNode = this.getContentNode();
    contentNode.append(content);
  }

  private showNext() {
    this.moveDirection = "right";
    const contentContainer = this.getContentNode();

    contentContainer.scrollTo({
      top: 0,
      left: contentContainer.scrollLeft + this.moveStep,
      behavior: "smooth",
    });
  }

  private showPrev() {
    this.moveDirection = "left";
    const contentContainer = this.getContentNode();

    contentContainer.scrollTo({
      top: 0,
      left: contentContainer.scrollLeft - this.moveStep,
      behavior: "smooth",
    });
  }

  render() {
    return (
      <Host>
        <button class="prev" onClick={() => this.showPrev()}>
          P
        </button>
        <div class={this.getContentClassMap()}></div>
        <button class="next" onClick={() => this.showNext()}>
          N
        </button>
        <slot onSlotchange={(x) => this.cloneSlottedContent(x)}></slot>
      </Host>
    );
  }
}
