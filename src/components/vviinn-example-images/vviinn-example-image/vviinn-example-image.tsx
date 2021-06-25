import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { toFile } from "../../../Image/toFile";
import { imageSearchState } from "../../../store/imageSearch.store";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Prop() src: string = "";
  @Event() exampleImageSelected: EventEmitter<void>;

  private async selectImage() {
    const file = await toFile(this.src);
    imageSearchState.image = file;
    this.exampleImageSelected.emit();
  }
  render() {
    return (
      <Host>
        <img onClick={() => this.selectImage()} src={this.src} />
      </Host>
    );
  }
}
