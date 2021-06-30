import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { toFile } from "../../../Image/toFile";
import { uploadFile } from "../../../store/imageSearch.store";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Prop() src: string = "";
  @Prop() width: number = 0;
  @Prop() height: number = 0;

  @Event() exampleImageSelected: EventEmitter<void>;

  private async selectImage() {
    const file = await toFile(this.src);
    uploadFile(file);
    this.exampleImageSelected.emit();
  }
  render() {
    return (
      <Host>
        <img
          onClick={() => this.selectImage()}
          src={this.src}
          width={this.width}
          height={this.height}
        />
      </Host>
    );
  }
}
