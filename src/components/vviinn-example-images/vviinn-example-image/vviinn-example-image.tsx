import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
} from "@stencil/core";
import { toFile } from "../../../Image/toFile";
import { imageSearchState } from "../../../store/imageSearch.store";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Prop() src: string = "";
  @Prop() width: number = 0;
  @Prop() height: number = 0;

  @State() selected: boolean = false;

  @Event() exampleImageSelected: EventEmitter<void>;
  @Event() exampleImageError: EventEmitter<void>;

  private async selectImage() {
    this.selected = true;

    const file = await toFile(this.src);
    imageSearchState.imageSelectedObserver.next(file);
    this.selected = false;
  }

  private showPreloader(): boolean {
    return (
      (imageSearchState.objectDetectionInProgress ||
        imageSearchState.status === "pending") &&
      this.selected
    );
  }

  render() {
    return (
      <Host>
        {this.showPreloader() ? (
          <div class="image-preloader">
            <vviinn-preloader />
          </div>
        ) : null}
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
