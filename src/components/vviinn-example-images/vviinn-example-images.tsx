import { Component, Host, h, Event, EventEmitter, Listen } from "@stencil/core";

@Component({
  tag: "vviinn-example-images",
  styleUrl: "vviinn-example-images.css",
  shadow: true,
})
export class VviinnExampleImages {
  @Event() imageSelected: EventEmitter<void>;

  @Listen("exampleImageSelected")
  handleImageSelection() {
    this.imageSelected.emit();
  }

  render() {
    return (
      <Host>
        <vviinn-exampleimae src="https://unsplash.it/640/425" />
        <vviinn-example-image src="https://unsplash.it/425/425" />
        <vviinn-example-image src="https://unsplash.it/425/640" />
      </Host>
    );
  }
}
