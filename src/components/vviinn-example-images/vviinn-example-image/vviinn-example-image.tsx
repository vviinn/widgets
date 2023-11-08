import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { toFile } from "../../../Image/toFile";
import {
  imageSearchState,
  processSelectedFile,
} from "../../../store/imageSearch.store";
import * as E from "fp-ts/lib/Either";
import { BasicEventData } from "../../../recommendation/events";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Prop() src: string = "";
  @Prop() width: number = 0;
  @Prop() height: number = 0;
  @Prop() basicEventData: BasicEventData;
  @Prop() isClickable: boolean = true;

  @State() selected: boolean = false;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  private async selectImage() {
    this.selected = true;
    this.vviinnImageUpload.emit(this.basicEventData);
    const file = await toFile(this.src);
    const processResult = await processSelectedFile(file);

    pipe(
      processResult,
      E.match(
        () => this.vviinnNoResult.emit(this.basicEventData),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    this.selected = false;
  }

  private handleKeyPress({ key }: KeyboardEvent) {
    if (key !== "Enter" && key !== " ") return;
    this.selectImage();
  }

  private showPreloader(): boolean {
    return (
      (imageSearchState.objectDetectionInProgress ||
        imageSearchState.loading) &&
      this.selected
    );
  }

  render() {
    return (
      <Host
        onClick={this.isClickable ? () => this.selectImage() : undefined}
        onKeyUp={
          this.isClickable
            ? (ev: KeyboardEvent) => this.handleKeyPress(ev)
            : undefined
        }
      >
        {this.showPreloader() ? (
          <div class="image-preloader">
            <vviinn-preloader />
          </div>
        ) : null}
        <img
          src={this.src}
          width={this.width}
          height={this.height}
          tabindex={1}
          class={{
            "is-clickable": this.isClickable,
          }}
        />
      </Host>
    );
  }
}
