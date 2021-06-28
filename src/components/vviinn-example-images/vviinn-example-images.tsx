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
        <h4>Get inspired by choosing an example from gallery</h4>
        <div class="images">
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzEzODk0MzE3X3hsLTIwMTUuanBn" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzc4NjUyMzQwX3hsLTIwMTUuanBn" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzQ5NDI1NzdfeGwtMjAxNS5qcGc=" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzI1MjM3Njg1NF94bC0yMDE1LmpwZw==" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzIzODExNjA0OF94bC0yMDE1LmpwZw==" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzMxMTg3OTQ4Ml94bC0yMDE1LmpwZw==" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzE5ODY4ODA2Nl94bC0yMDE1LmpwZw==" />
          <vviinn-example-image src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9EZXBvc2l0cGhvdG9zXzMyNjA2NjYxNF94bC0yMDE1LmpwZw==" />
        </div>
      </Host>
    );
  }
}
