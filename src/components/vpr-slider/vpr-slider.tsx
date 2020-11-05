import { Component, Host, h, Prop, Element, State, Method } from "@stencil/core";
import { Interfaces } from "../../interfaces/recommendation";

@Component({
  tag: "vpr-slider",
  styleUrl: "vpr-slider.css",
  shadow: false,
})
export class VprSlider {
  @Element() el: HTMLElement;
  @Prop() items: Interfaces["VisualProductSearch"][];
  @State() kek: Interfaces["VisualProductSearch"][] = [];
  @State() columns: number = 1;

  private resizeObserver: ResizeObserver;

  componentDidLoad() {
    this.resizeObserver = new ResizeObserver(this.test);
    this.resizeObserver.observe(this.el);
    this.updateColumns();    
  }

  @Method()
    async loadKek(x: Interfaces["VisualProductSearch"][]) {
    this.kek = x;

    console.log(this.kek);
  }

  updateColumns() {
    this.columns = parseInt(getComputedStyle(this.el).getPropertyValue('--columns'));
  }

  test() {
    console.log('ololo');
  }

  render() {
    return (
      <Host>
          {this.kek.map((r) => (
            <vpr-result
              item={r}
              imageWidth={100}
              imageRatio={1.5}
            />
          ))}
      </Host>
    );
  }
}
